import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { bookColor, useBook } from '../context';
import { neighbourGap, ringAngles, type Point } from '../layout';
import { href } from '../router';
import type { Book, Chapter } from '../types';
import { chapterNumber, wrapTitle } from './common';

const BOOK_R = 50;
const CHAPTER_R = 15;
const SUB_R = 7;
const SUB_GAP = 18; // 하위 챕터 점 사이 간격
const HUB_R = 30;

interface PlacedSub {
  sub: Chapter;
  at: Point;
  label: string;
}
interface PlacedChapter {
  chapter: Chapter;
  at: Point;
  label: string;
  subs: PlacedSub[];
}
interface PlacedBook {
  book: Book;
  at: Point;
  orbit: number;
  chapters: PlacedChapter[];
}

const polar = (c: Point, r: number, deg: number): Point => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.sin(t), y: c.y - r * Math.cos(t) };
};

/** 책 한 권의 모양을 원점 기준으로 계산한다. extent = 가장 바깥 노드까지의 거리. */
function shapeOf(book: Book, rotate: number): { orbit: number; extent: number; build: (c: Point) => PlacedChapter[] } {
  const m = book.chapters.length;
  const orbit = Math.max(90, (m * (CHAPTER_R * 2 + 14)) / (2 * Math.PI));
  const angles = ringAngles(m).map((a) => a + rotate);
  const slot = ((m >= 5 ? 360 / m : 90) * 0.9 * Math.PI) / 180; // 한 챕터가 쓸 수 있는 각도 폭

  // 하위 챕터: 챕터 바깥쪽으로 여러 줄의 호를 그리며 놓는다. 줄마다 들어갈 수 있는 만큼만.
  const subPolar = (k: number): { r: number; offset: number }[] => {
    const out: { r: number; offset: number }[] = [];
    let row = 0;
    let left = k;
    while (left > 0) {
      const r = orbit + CHAPTER_R + 20 + row * SUB_GAP;
      const cap = Math.max(1, Math.floor((r * slot) / SUB_GAP));
      const n = Math.min(cap, left);
      const step = (SUB_GAP / r) * (180 / Math.PI);
      for (let i = 0; i < n; i++) out.push({ r, offset: (i - (n - 1) / 2) * step });
      left -= n;
      row++;
    }
    return out;
  };

  let extent = orbit + CHAPTER_R;
  const plans = book.chapters.map((ch) => {
    const p = subPolar(ch.children?.length ?? 0);
    for (const q of p) extent = Math.max(extent, q.r + SUB_R);
    return p;
  });

  return {
    orbit,
    extent,
    build: (c) =>
      book.chapters.map((chapter, i) => {
        const label = chapterNumber(book, i);
        const angle = angles[i] ?? 0;
        return {
          chapter,
          label,
          at: polar(c, orbit, angle),
          subs: (chapter.children ?? []).map((sub, j) => ({ sub, label: `${label}.${j + 1}`, at: polar(c, plans[i]![j]!.r, angle + plans[i]![j]!.offset) })),
        };
      }),
  };
}

/**
 * 거미줄 보기. 책은 큰 노드, 챕터는 그 둘레의 번호 붙은 노드, 하위 챕터는 챕터 바깥의 작은 점.
 * 배치 규칙은 layout.ts 참고(5개 이상 정n각형, 미만 십자가). 끌어서 옮기고 단추로 확대·축소한다.
 */
export function WebView({ books }: { books: Book[] }) {
  const { library } = useBook();
  const [hover, setHover] = useState<{ label: string; at: Point; r: number } | null>(null);
  const [view, setView] = useState({ k: 1, dx: 0, dy: 0 });
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const { placed, box, hub } = useMemo(() => {
    const n = books.length;
    const angles = ringAngles(n);
    const shapes = books.map((book, i) => {
      const m = book.chapters.length;
      // 1번 챕터가 바깥을 보게 돌리고, 가운데에서 오는 선이 챕터 노드를 뚫지 않게 짝수 개면 반 칸 더 돌린다
      const rotate = n > 1 ? (angles[i] ?? 0) + (m % 2 === 0 ? 180 / m : 0) : 0;
      return shapeOf(book, rotate);
    });
    const maxExtent = Math.max(...shapes.map((s) => s.extent), 0);

    let ring = 0;
    if (n >= 5) {
      ring = maxExtent * 2 + 40;
      while (neighbourGap(n, ring) < maxExtent * 2 + 40) ring += 10;
    }
    const centers: Point[] = books.map((_, i) => {
      if (n === 1) return { x: 0, y: 0 };
      // 십자가 배치는 책마다 크기에 맞춰 거리를 따로 잡는다(직각으로 이웃한 두 책이 겹치지 않는 비율)
      const dist = n < 5 ? shapes[i]!.extent * 1.45 + 30 : ring;
      return polar({ x: 0, y: 0 }, dist, angles[i] ?? 0);
    });

    const placed: PlacedBook[] = books.map((book, i) => ({ book, at: centers[i]!, orbit: shapes[i]!.orbit, chapters: shapes[i]!.build(centers[i]!) }));

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    placed.forEach((p, i) => {
      const e = shapes[i]!.extent;
      minX = Math.min(minX, p.at.x - e);
      minY = Math.min(minY, p.at.y - e);
      maxX = Math.max(maxX, p.at.x + e);
      maxY = Math.max(maxY, p.at.y + e);
    });
    const pad = 36;
    return { placed, hub: n > 1 ? { x: 0, y: 0 } : null, box: { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 } };
  }, [books]);

  if (books.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;

  const w = box.w / view.k;
  const h = box.h / view.k;
  const viewBox = `${box.x + box.w / 2 + view.dx - w / 2} ${box.y + box.h / 2 + view.dy - h / 2} ${w} ${h}`;
  const zoom = (f: number): void => setView((v) => ({ ...v, k: Math.min(6, Math.max(1, v.k * f)) }));

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>): void => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerMove = (e: RPointerEvent<SVGSVGElement>): void => {
    const d = drag.current;
    const el = svg.current;
    if (!d || !el) return;
    const px = e.clientX - d.x;
    const py = e.clientY - d.y;
    if (!d.moved && Math.hypot(px, py) < 5) return;
    if (!d.moved) el.setPointerCapture(e.pointerId);
    d.moved = true;
    d.x = e.clientX;
    d.y = e.clientY;
    const scale = w / el.clientWidth; // 화면 1px = 지도 몇 단위
    setView((v) => ({ ...v, dx: v.dx - px * scale, dy: v.dy - py * scale }));
  };
  const onPointerUp = (): void => {
    // 끌었으면 이어지는 클릭(링크 이동)을 한 번 막는다
    if (drag.current?.moved) {
      const stop = (ev: MouseEvent): void => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      window.addEventListener('click', stop, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
    }
    drag.current = null;
  };

  const tip = (label: string, at: Point, r: number) => ({
    onPointerEnter: () => setHover({ label, at, r }),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover({ label, at, r }),
    onBlur: () => setHover(null),
  });

  return (
    <div className="bf-web">
      <div className="bf-web-tools" role="toolbar" aria-label="지도 확대">
        <button type="button" onClick={() => zoom(1.4)} aria-label="확대">＋</button>
        <button type="button" onClick={() => zoom(1 / 1.4)} aria-label="축소" disabled={view.k <= 1}>－</button>
        <button type="button" onClick={() => setView({ k: 1, dx: 0, dy: 0 })} disabled={view.k === 1 && view.dx === 0 && view.dy === 0}>전체</button>
      </div>
      <svg
        ref={svg}
        viewBox={viewBox}
        role="img"
        aria-label="책과 챕터 지도"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g className="bf-web-lines">
          {hub && placed.map((p) => <line key={`h-${p.book.id}`} x1={hub.x} y1={hub.y} x2={p.at.x} y2={p.at.y} />)}
          {placed.map((p) => (
            <circle key={`o-${p.book.id}`} className="bf-web-orbit" cx={p.at.x} cy={p.at.y} r={p.orbit} />
          ))}
          {placed.map((p) =>
            p.chapters.map((c) => (
              <g key={`c-${p.book.id}-${c.chapter.id}`}>
                <line className="bf-web-spoke" x1={p.at.x} y1={p.at.y} x2={c.at.x} y2={c.at.y} />
                {c.subs.map((s) => (
                  <line key={s.sub.id} className="bf-web-twig" x1={c.at.x} y1={c.at.y} x2={s.at.x} y2={s.at.y} />
                ))}
              </g>
            )),
          )}
        </g>

        {hub && (
          <g className="bf-web-hub">
            <circle cx={hub.x} cy={hub.y} r={HUB_R} />
            <text x={hub.x} y={hub.y} dy="0.35em">
              {library.books.length}권
            </text>
          </g>
        )}

        {placed.map((p) => {
          const color = bookColor(library, p.book);
          return (
            <g key={p.book.id} style={{ ['--node' as string]: color }}>
              {p.chapters.map((c) => (
                <g key={c.chapter.id}>
                  {c.subs.map((s) => (
                    <a
                      key={s.sub.id}
                      href={href({ name: 'read', bookId: p.book.id, chapterId: s.sub.id })}
                      className={`bf-node bf-node-sub${s.sub.draft ? ' is-draft' : ''}`}
                      aria-label={`${p.book.title} ${s.label} ${s.sub.title}${s.sub.draft ? ' (준비 중)' : ''}`}
                      {...tip(`${s.label} ${s.sub.title}${s.sub.draft ? ' · 준비 중' : ''}`, s.at, SUB_R)}
                    >
                      <circle cx={s.at.x} cy={s.at.y} r={SUB_R} />
                    </a>
                  ))}
                  <a
                    href={href({ name: 'read', bookId: p.book.id, chapterId: c.chapter.id })}
                    className={`bf-node bf-node-chapter${c.chapter.draft ? ' is-draft' : ''}`}
                    aria-label={`${p.book.title} ${c.label}. ${c.chapter.title}${c.chapter.draft ? ' (준비 중)' : ''}`}
                    {...tip(`${c.label}. ${c.chapter.title}${c.chapter.draft ? ' · 준비 중' : ''}`, c.at, CHAPTER_R)}
                  >
                    <circle cx={c.at.x} cy={c.at.y} r={CHAPTER_R} />
                    <text x={c.at.x} y={c.at.y} dy="0.35em">
                      {c.label}
                    </text>
                  </a>
                </g>
              ))}
              <a href={href({ name: 'book', bookId: p.book.id })} className="bf-node bf-node-book" aria-label={p.book.title}>
                <circle cx={p.at.x} cy={p.at.y} r={BOOK_R} />
                {wrapTitle(p.book.title).map((line, i, all) => (
                  <text key={i} x={p.at.x} y={p.at.y + (i - (all.length - 1) / 2) * 17} dy="0.35em">
                    {line}
                  </text>
                ))}
              </a>
            </g>
          );
        })}

        {hover && (
          <g className="bf-web-tip" transform={`translate(${hover.at.x} ${hover.at.y - hover.r - 10})`} pointerEvents="none">
            <text textAnchor="middle" style={{ fontSize: 13 / Math.sqrt(view.k) }}>
              {hover.label}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
