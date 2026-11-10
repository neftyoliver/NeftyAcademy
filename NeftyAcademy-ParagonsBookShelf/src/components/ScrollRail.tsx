import { useEffect, useRef, useState } from 'react';

export interface RailSection {
  index: number;
  title: string;
  el: HTMLElement;
}

/**
 * 오른쪽 스크롤 레일. 문서 전체 길이를 레일 높이에 줄여서
 *  - 단락(h2) 자리에 눈금, 지금 단락은 진하게
 *  - 줄친 곳은 노란 점, 북마크한 단락은 작은 리본
 *  - 지금 보이는 화면 범위는 반투명 막대
 * 를 그린다. 레일 위에 마우스를 올리면 그 높이에 해당하는 단락 이름이 뜬다.
 */
export function ScrollRail({
  sections,
  current,
  markTops,
  bookmarkSections,
  chapterTitle,
}: {
  sections: RailSection[];
  current: number;
  markTops: number[];
  bookmarkSections: number[];
  chapterTitle: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ doc: 1, view: 1, scroll: 0, tops: [] as number[] });
  const [tip, setTip] = useState<{ y: number; label: string } | null>(null);

  useEffect(() => {
    let raf = 0;
    const measure = (): void => {
      raf = 0;
      setGeo({
        doc: Math.max(1, document.documentElement.scrollHeight),
        view: window.innerHeight,
        scroll: window.scrollY,
        tops: sections.map((s) => s.el.getBoundingClientRect().top + window.scrollY),
      });
    };
    const schedule = (): void => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [sections]);

  const pct = (y: number): string => `${Math.min(100, Math.max(0, (y / geo.doc) * 100))}%`;

  const sectionAt = (docY: number): string => {
    let label = chapterTitle;
    geo.tops.forEach((t, i) => {
      if (t <= docY + 1) label = sections[i]?.title ?? label;
    });
    return label;
  };

  const fromPointer = (clientY: number): { y: number; docY: number } | null => {
    const r = rail.current?.getBoundingClientRect();
    if (!r) return null;
    const y = Math.min(r.height, Math.max(0, clientY - r.top));
    return { y, docY: (y / r.height) * geo.doc };
  };

  return (
    <div
      ref={rail}
      className="bf-rail"
      role="navigation"
      aria-label="단락 위치"
      onPointerMove={(e) => {
        const p = fromPointer(e.clientY);
        if (p) setTip({ y: p.y, label: sectionAt(p.docY) });
      }}
      onPointerLeave={() => setTip(null)}
      onClick={(e) => {
        const p = fromPointer(e.clientY);
        if (p) window.scrollTo({ top: p.docY - geo.view / 3, behavior: 'smooth' });
      }}
    >
      <div className="bf-rail-track" />
      <div className="bf-rail-thumb" style={{ top: pct(geo.scroll), height: pct(geo.view) }} />
      {geo.tops.map((t, i) => (
        <button
          key={i}
          type="button"
          className={`bf-rail-tick${i === current ? ' is-current' : ''}`}
          style={{ top: pct(t) }}
          aria-label={sections[i]?.title}
          onClick={(e) => {
            e.stopPropagation();
            sections[i]?.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      ))}
      {markTops.map((t, i) => (
        <span key={`m${i}`} className="bf-rail-mark" style={{ top: pct(t) }} />
      ))}
      {bookmarkSections.map((s) => (
        <span key={`b${s}`} className="bf-rail-bookmark" style={{ top: s < 0 ? '0%' : pct(geo.tops[s] ?? 0) }} />
      ))}
      {tip && (
        <div className="bf-rail-tip" style={{ top: tip.y }}>
          {tip.label}
        </div>
      )}
    </div>
  );
}
