import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { bookColor, useBook } from '../context';
import { HexGrid } from '../hexroute';
import { hexRingsFor, hexSpiral, type Point } from '../layout';
import { layoutPie } from '../pie';
import { href } from '../router';
import type { Book, Chapter } from '../types';
import { chapterNumber, wrapTitle } from './common';

const BOOK_R = 50;
const CHAPTER_R = 15; // 챕터 노드의 기본 반지름. 확대하면 CHAPTER_R_MAX 까지 커지며 제목이 들어간다
const CHAPTER_R_MAX = 46;
const SUB_R = 7; // 하위 챕터도 같다
const SUB_R_MAX = 36;
const SUB_STEP = 27; // 하위 챕터 점 사이 간격(= 챕터에서 첫 고리까지의 거리). 길 찾기 격자(hexroute 의 GRID)의 두 배
const CHAPTER_STEP = 124; // 챕터 사이 간격의 최소값. 하위 챕터가 많으면 더 벌어진다. 실제 값은 SUB_STEP 의 배수로 올림한다
const BOOK_GAP = 26; // 책의 조각과 조각 사이의 틈
const REGION_PAD = 20; // 노드에서 책 영역의 테두리까지
const MAP_ROTATE = 30; // 책이 여러 권일 때 격자의 방향(도). 30이면 격자의 한 결이 가로로 눕는다
const HUB_R = 30;
const ZOOM_MAX = 8;
// 줄이 노드의 가운데에 이보다 가까이 오지 못하는 거리. 확대해서 노드가 커져도 줄이 노드에 닿지 않는 값이다
const CLEAR = { book: BOOK_R + 2, hub: HUB_R + 2, chapter: 23, sub: 11.5 };

interface PlacedSub {
  sub: Chapter;
  at: Point;
  label: string;
}
interface PlacedChapter {
  chapter: Chapter;
  /** 이 자리가 챕터가 아니라 서가 안의 책일 때 그 책의 id */
  innerBook?: string;
  at: Point;
  label: string;
  subs: PlacedSub[];
  /** 하위 챕터까지 포함해 이 챕터가 차지하는 반지름 */
  reach: number;
}
/** 꺾은선 한 줄. 꺾이는 점들(지도 좌표). */
type Line = Point[];
interface PlacedBook {
  book: Book;
  at: Point;
  chapters: PlacedChapter[];
  /** 읽는 순서대로 잇는 선들: 책 → 1 → 2 → … (하위 챕터가 있으면 7 → 7.1 → 7.2 → … → 8) */
  order: { line: Line; sub: boolean }[];
  /** 이 책의 영역: 노드들을 감싸는 육각형의 꼭짓점 */
  region: Point[];
  /** 가운데 표시에서 이 책으로 오는 줄 */
  fromHub?: Line;
}
interface CrossLink {
  key: string;
  from: string;
  to: string;
  line: Line;
}

const polar = (c: Point, r: number, deg: number): Point => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.sin(t), y: c.y - r * Math.cos(t) };
};
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/**
 * 배율 k 에서의 노드 반지름. 확대하면 노드 사이는 k배로 벌어지지만 노드는 그대로이고,
 * 사이가 충분히 벌어지면 제목이 들어갈 만큼만 커진다. 챕터가 먼저 커지고, 더 확대하면 하위 챕터가 커진다.
 * (하위 챕터는 챕터에서 SUB_STEP * k 만큼 떨어져 있으므로 두 반지름의 합이 그보다 작아야 한다.)
 */
function radiiAt(k: number): { chapter: number; sub: number } {
  const gap = SUB_STEP * k;
  const chapter = clamp(gap - SUB_R - 5, CHAPTER_R, CHAPTER_R_MAX);
  const sub = clamp(Math.min((gap - 4) / 2, gap - chapter - 5), SUB_R, SUB_R_MAX);
  return { chapter, sub };
}

/**
 * 지도에서 책 둘레에 놓을 것들. 보통은 챕터이고, 서가(책 속의 책)면 챕터 다음에 안쪽 책들이 온다.
 * 안쪽 책은 번호 붙은 노드 하나로만 보이고, 누르면 그 책으로 들어간다.
 */
function itemsOf(book: Book): { chapter: Chapter; innerBook?: string }[] {
  const draftAll = (b: Book): boolean => b.chapters.every((c) => c.draft && (c.children ?? []).every((x) => x.draft)) && (b.books ?? []).every(draftAll);
  return [
    ...book.chapters.map((chapter) => ({ chapter })),
    ...(book.books ?? []).map((b) => ({ chapter: { id: b.id, title: b.title, draft: draftAll(b) } as Chapter, innerBook: b.id })),
  ];
}

/** 책 한 권이 지도에서 차지하는 크기. items = 책 둘레에 놓을 것들, widest = 그중 가장 넓은 것의 반지름, step = 자리 사이 간격 */
function measure(book: Book): { items: ReturnType<typeof itemsOf>; widest: number; step: number } {
  const items = itemsOf(book);
  const widest = Math.max(CHAPTER_R, ...items.map((it) => reachOf(it.chapter)));
  // 챕터와 하위 챕터가 모두 같은 격자의 노드 자리에 놓이도록 SUB_STEP 의 배수로 올린다
  const step = Math.ceil(Math.max(CHAPTER_STEP, widest * 2 + 18) / SUB_STEP) * SUB_STEP;
  return { items, widest, step };
}

/** 챕터 하나가 하위 챕터까지 포함해 차지하는 반지름 */
function reachOf(ch: Chapter): number {
  const k = ch.children?.length ?? 0;
  return k ? hexRingsFor(k) * SUB_STEP + SUB_R : CHAPTER_R;
}

/** 정해진 자리(spots)에 챕터를 차례로 놓는다. 하위 챕터는 챕터 둘레에 작은 육각형을 그려 가며 놓인다. */
function chaptersAt(book: Book, spots: Point[], rotate: number): PlacedChapter[] {
  return itemsOf(book).map(({ chapter, innerBook }, i) => {
    const label = chapterNumber(book, i);
    const at = spots[i]!;
    const subSpots = hexSpiral(chapter.children?.length ?? 0, at.x, at.y, SUB_STEP, rotate);
    return {
      chapter,
      innerBook,
      label,
      at: { x: at.x, y: at.y },
      reach: reachOf(chapter),
      subs: (chapter.children ?? []).map((sub, j) => ({ sub, label: `${label}.${j + 1}`, at: { x: subSpots[j]!.x, y: subSpots[j]!.y } })),
    };
  });
}

/**
 * 지도 보기. 책은 큰 노드, 챕터는 번호 붙은 노드, 하위 챕터는 챕터 둘레의 작은 육각형.
 * 연한 빨강 화살표 줄은 읽는 순서(목록 보기와 같은 순서)다. 책마다 자기 색의 점선 테두리가 영역을 표시한다.
 *
 * 책이 여러 권이면 지도 전체가 책의 수만큼 모서리가 있는 정다각형이 되고, 가운데에서 뻗은 경계선이 그것을
 * 책의 수만큼 조각으로 나눈다(pie.ts). 조각의 너비는 책의 크기에 맞춰 저절로 정해지고, 조각 사이의 틈은 어디서나 같다.
 * 책이 한 권이면 그 책을 가운데에 두고 챕터를 육각형으로 둘러 놓는다(layout.ts 의 hexSpiral).
 *
 * 줄은 모두 육각형 결(60도 간격의 세 방향)을 따라 꺾이는 꺾은선이고, 노드를 뚫지 않는다(hexroute.ts).
 * 휠을 굴리거나 단추를 누르면 확대·축소된다. 확대하면 노드는 그대로 두고 간격만 벌어지며,
 * 충분히 벌어진 노드에는 제목이 들어간다. 끌어서 옮긴다.
 * 챕터의 links 에 적힌 다른 챕터와는 점선으로 이어진다.
 */
export function WebView({ books }: { books: Book[] }) {
  const { library } = useBook();
  const [hover, setHover] = useState<{ label: string; at: Point; sub: boolean; key: string } | null>(null);
  const [view, setView] = useState({ k: 1, dx: 0, dy: 0 });
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const { placed, box, hub, links } = useMemo(() => {
    const n = books.length;
    const sizes = books.map(measure);
    let rotate: number;
    let placed: PlacedBook[];
    let outline: Point[];

    if (n === 1) {
      // 책이 한 권이면 그 책을 가운데에 두고, 챕터는 책 둘레에 육각형을 그려 가며 놓는다(layout.ts 의 hexSpiral)
      rotate = 0;
      const book = books[0]!;
      const { items, step } = sizes[0]!;
      const chapters = chaptersAt(book, hexSpiral(items.length, 0, 0, step, rotate), rotate);
      // 영역: 변의 방향은 정육각형과 같고, 변마다 노드에 딱 맞게 당긴 육각형
      const circles = [{ x: 0, y: 0, r: BOOK_R }, ...chapters.map((c) => ({ x: c.at.x, y: c.at.y, r: c.reach }))];
      const normals = Array.from({ length: 6 }, (_, k) => polar({ x: 0, y: 0 }, 1, rotate + 30 + 60 * k));
      const reach = normals.map((nk) => Math.max(...circles.map((c) => c.x * nk.x + c.y * nk.y + c.r)) + REGION_PAD);
      outline = normals.map((a, k) => {
        // k번째 변과 k+1번째 변이 만나는 점
        const b = normals[(k + 1) % 6]!;
        const det = a.x * b.y - a.y * b.x;
        return { x: (reach[k]! * b.y - reach[(k + 1) % 6]! * a.y) / det, y: (a.x * reach[(k + 1) % 6]! - b.x * reach[k]!) / det };
      });
      placed = [{ book, at: { x: 0, y: 0 }, chapters, order: [], region: outline }];
    } else {
      // 여러 권이면 책의 수만큼 모서리가 있는 다각형을 조각으로 나눠 한 조각에 한 권씩 놓는다(pie.ts)
      rotate = MAP_ROTATE;
      const pie = layoutPie(
        sizes.map((s) => ({ step: s.step, clears: [BOOK_R, ...s.items.map((it) => reachOf(it.chapter))].map((r) => r + REGION_PAD) })),
        { rotate, gap: BOOK_GAP, hubRadius: HUB_R + BOOK_GAP / 2 },
      );
      outline = pie.outline;
      placed = books.map((book, i) => {
        const { cell, spots } = pie.books[i]!;
        return { book, at: spots[0]!, chapters: chaptersAt(book, spots.slice(1), rotate), order: [], region: cell };
      });
    }
    const hub: Point | null = n > 1 ? { x: 0, y: 0 } : null;

    // 줄 긋기: 모든 노드를 격자에 올리고, 격자 위에서 길을 찾는다
    const grid = new HexGrid(rotate, [...outline, { x: 0, y: 0 }]);
    const hubNode = hub ? grid.addNode(hub, CLEAR.hub) : -1;
    const bookNode = placed.map((p) => grid.addNode(p.at, CLEAR.book));
    /** '책/챕터' → 노드. 묶음 챕터와 하위 챕터 모두 찾을 수 있다. */
    const where = new Map<string, { node: number; book: number; at: Point }>();
    placed.forEach((p, i) => {
      for (const c of p.chapters) {
        where.set(`${p.book.id}/${c.chapter.id}`, { node: grid.addNode(c.at, CLEAR.chapter), book: i, at: c.at });
        for (const s of c.subs) where.set(`${p.book.id}/${s.sub.id}`, { node: grid.addNode(s.at, CLEAR.sub), book: i, at: s.at });
      }
      grid.addRegion(i, p.region);
    });
    const between = (a: { node: number; at: Point }, b: { node: number; at: Point }, home: number[]): Line => grid.route(a.node, b.node, home) ?? [a.at, b.at];

    // 읽는 순서: 목록 보기와 같은 순서로 한 줄로 잇는다
    placed.forEach((p, i) => {
      let prev = { node: bookNode[i]!, at: p.at };
      for (const c of p.chapters) {
        const next = where.get(`${p.book.id}/${c.chapter.id}`)!;
        p.order.push({ line: between(prev, next, [i]), sub: false });
        prev = next;
        for (const s of c.subs) {
          const sub = where.get(`${p.book.id}/${s.sub.id}`)!;
          p.order.push({ line: between(prev, sub, [i]), sub: true });
          prev = sub;
        }
      }
    });
    // 가운데 표시에서 책으로
    if (hub) placed.forEach((p, i) => (p.fromHub = between({ node: hubNode, at: hub }, { node: bookNode[i]!, at: p.at }, [i])));
    // 상호 참조
    const links = new Map<string, CrossLink>();
    const collect = (bookId: string, ch: Chapter): void => {
      const from = `${bookId}/${ch.id}`;
      for (const raw of ch.links ?? []) {
        const to = raw.includes('/') ? raw : `${bookId}/${raw}`;
        const a = where.get(from);
        const b = where.get(to);
        if (!a || !b || from === to) continue; // 지금 보이지 않는 책이거나 없는 챕터
        const key = [from, to].sort().join(' ');
        if (!links.has(key)) links.set(key, { key, from, to, line: between(a, b, [a.book, b.book]) });
      }
      ch.children?.forEach((sub) => collect(bookId, sub));
    };
    for (const p of placed) p.book.chapters.forEach((ch) => collect(p.book.id, ch));

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const v of outline) {
      minX = Math.min(minX, v.x);
      minY = Math.min(minY, v.y);
      maxX = Math.max(maxX, v.x);
      maxY = Math.max(maxY, v.y);
    }
    const pad = 16;
    return { placed, links: [...links.values()], hub, box: { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 } };
  }, [books]);

  // 화면의 가운데(지도 좌표). 확대는 이 점을 중심으로 좌표만 늘리고, viewBox 는 그대로 둔다.
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const center = useRef({ cx, cy });
  center.current = { cx, cy };

  // 휠로 확대·축소. 마우스가 가리키는 곳이 제자리에 있도록 한다.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent): void => {
      const m = el.getScreenCTM();
      if (!m) return;
      e.preventDefault();
      const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      const c = center.current;
      setView((v) => {
        const k = clamp(v.k * Math.exp(-e.deltaY * 0.0015), 1, ZOOM_MAX);
        if (k === v.k) return v;
        if (k === 1) return { k: 1, dx: 0, dy: 0 };
        // 마우스 아래의 지도 좌표 p 가 확대 뒤에도 화면의 같은 자리 q 에 오도록 옮긴다
        const px = (q.x - c.cx) / v.k + c.cx + v.dx;
        const py = (q.y - c.cy) / v.k + c.cy + v.dy;
        return { k, dx: px - c.cx - (q.x - c.cx) / k, dy: py - c.cy - (q.y - c.cy) / k };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [books.length === 0]);

  if (books.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;

  const { k } = view;
  /** 지도 좌표 → 화면(viewBox) 좌표. 노드의 크기는 여기에 들어가지 않으므로 확대해도 그대로다. */
  const T = (p: Point): Point => ({ x: (p.x - cx - view.dx) * k + cx, y: (p.y - cy - view.dy) * k + cy });
  const path = (line: Line): string => line.map((p, i) => `${i ? 'L' : 'M'}${T(p).x.toFixed(1)} ${T(p).y.toFixed(1)}`).join(' ');
  /** 꺾은선에서 가장 긴 토막의 가운데에 놓는 화살표 */
  const arrow = (line: Line, size: number): string => {
    let best = 0;
    let len = -1;
    for (let i = 0; i + 1 < line.length; i++) {
      const d = Math.hypot(line[i + 1]!.x - line[i]!.x, line[i + 1]!.y - line[i]!.y);
      if (d > len) {
        len = d;
        best = i;
      }
    }
    const a = T(line[best]!);
    const b = T(line[best + 1]!);
    const ux = (b.x - a.x) / (Math.hypot(b.x - a.x, b.y - a.y) || 1);
    const uy = (b.y - a.y) / (Math.hypot(b.x - a.x, b.y - a.y) || 1);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const at = (f: number, s: number): string => `${(mx + ux * f * size - uy * s * size).toFixed(1)} ${(my + uy * f * size + ux * s * size).toFixed(1)}`;
    return `M${at(1, 0)} L${at(-1, 0.8)} L${at(-1, -0.8)} z`;
  };
  const radii = radiiAt(k);
  const chapterTitled = radii.chapter >= 30;
  const subTitled = radii.sub >= 22;
  const zoom = (f: number): void =>
    setView((v) => {
      const next = clamp(v.k * f, 1, ZOOM_MAX);
      return next === 1 ? { k: 1, dx: 0, dy: 0 } : { ...v, k: next };
    });

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
    const scale = 1 / (el.getScreenCTM()?.a || 1); // 화면 1px = viewBox 몇 단위
    setView((v) => ({ ...v, dx: v.dx - (px * scale) / v.k, dy: v.dy - (py * scale) / v.k }));
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

  const tip = (label: string, at: Point, sub: boolean, key: string) => ({
    onPointerEnter: () => setHover({ label, at, sub, key }),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover({ label, at, sub, key }),
    onBlur: () => setHover(null),
  });
  /** 노드 안에 넣는 번호와 제목. r = 노드의 반지름 */
  const titled = (at: Point, r: number, label: string, title: string) => {
    const lines = wrapTitle(title);
    return (
      <>
        <text x={at.x} y={at.y - r * 0.56} dy="0.35em" className="bf-node-num" style={{ fontSize: r * 0.22 }}>
          {label}
        </text>
        {lines.map((line, i) => (
          <text key={i} x={at.x} y={at.y + r * 0.1 + (i - (lines.length - 1) / 2) * r * 0.3} dy="0.35em" style={{ fontSize: r * 0.25 }}>
            {line}
          </text>
        ))}
      </>
    );
  };

  return (
    <div className="bf-web">
      <div className="bf-web-tools" role="toolbar" aria-label="지도 확대">
        <button type="button" onClick={() => zoom(1.4)} aria-label="확대" disabled={k >= ZOOM_MAX}>＋</button>
        <button type="button" onClick={() => zoom(1 / 1.4)} aria-label="축소" disabled={k <= 1}>－</button>
        <button type="button" onClick={() => setView({ k: 1, dx: 0, dy: 0 })} disabled={k === 1 && view.dx === 0 && view.dy === 0}>전체</button>
      </div>
      <svg
        ref={svg}
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        role="img"
        aria-label="책과 챕터 지도"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g className="bf-web-regions">
          {placed.map((p) => (
            <polygon key={p.book.id} points={p.region.map((v) => `${T(v).x.toFixed(1)},${T(v).y.toFixed(1)}`).join(' ')} style={{ ['--node' as string]: bookColor(library, p.book) }} />
          ))}
        </g>

        <g className="bf-web-lines">{placed.map((p) => p.fromHub && <path key={`h-${p.book.id}`} d={path(p.fromHub)} />)}</g>

        <g className="bf-web-order">
          {placed.map((p) =>
            p.order.map((o, i) => (
              <g key={`${p.book.id}-${i}`} className={o.sub ? 'is-sub' : undefined}>
                <path d={path(o.line)} />
                <path className="bf-web-arrow" d={arrow(o.line, o.sub ? 3.2 : 4.2)} />
              </g>
            )),
          )}
        </g>

        <g className="bf-web-links">
          {links.map((l) => (
            <path key={l.key} d={path(l.line)} className={hover && (hover.key === l.from || hover.key === l.to) ? 'is-on' : undefined} />
          ))}
        </g>

        {hub && (
          <g className="bf-web-hub">
            <circle cx={T(hub).x} cy={T(hub).y} r={HUB_R} />
            <text x={T(hub).x} y={T(hub).y} dy="0.35em">
              {library.books.length}권
            </text>
          </g>
        )}

        {placed.map((p) => {
          const color = bookColor(library, p.book);
          const bookAt = T(p.at);
          return (
            <g key={p.book.id} style={{ ['--node' as string]: color }}>
              {p.chapters.map((c) => {
                const at = T(c.at);
                return (
                  <g key={c.chapter.id}>
                    {c.subs.map((s) => {
                      const subAt = T(s.at);
                      return (
                        <a
                          key={s.sub.id}
                          href={href({ name: 'read', bookId: p.book.id, chapterId: s.sub.id })}
                          className={`bf-node bf-node-sub${subTitled ? ' is-titled' : ''}${s.sub.draft ? ' is-draft' : ''}`}
                          aria-label={`${p.book.title} ${s.label} ${s.sub.title}${s.sub.draft ? ' (준비 중)' : ''}`}
                          {...tip(`${s.label} ${s.sub.title}${s.sub.draft ? ' · 준비 중' : ''}`, s.at, true, `${p.book.id}/${s.sub.id}`)}
                        >
                          <circle cx={subAt.x} cy={subAt.y} r={radii.sub} />
                          {subTitled && titled(subAt, radii.sub, s.label, s.sub.title)}
                        </a>
                      );
                    })}
                    <a
                      href={c.innerBook ? href({ name: 'book', bookId: c.innerBook }) : href({ name: 'read', bookId: p.book.id, chapterId: c.chapter.id })}
                      className={`bf-node bf-node-chapter${chapterTitled ? ' is-titled' : ''}${c.innerBook ? ' is-book' : ''}${c.chapter.draft ? ' is-draft' : ''}`}
                      aria-label={`${p.book.title} ${c.label}. ${c.chapter.title}${c.chapter.draft ? ' (준비 중)' : ''}`}
                      {...tip(`${c.label}. ${c.chapter.title}${c.chapter.draft ? ' · 준비 중' : ''}`, c.at, false, `${p.book.id}/${c.chapter.id}`)}
                    >
                      <circle cx={at.x} cy={at.y} r={radii.chapter} />
                      {chapterTitled ? (
                        titled(at, radii.chapter, c.label, c.chapter.title)
                      ) : (
                        <text x={at.x} y={at.y} dy="0.35em">
                          {c.label}
                        </text>
                      )}
                    </a>
                  </g>
                );
              })}
              <a href={href({ name: 'book', bookId: p.book.id })} className="bf-node bf-node-book" aria-label={p.book.title}>
                <circle cx={bookAt.x} cy={bookAt.y} r={BOOK_R} />
                {wrapTitle(p.book.title).map((line, i, all) => (
                  <text key={i} x={bookAt.x} y={bookAt.y + (i - (all.length - 1) / 2) * 17} dy="0.35em">
                    {line}
                  </text>
                ))}
              </a>
            </g>
          );
        })}

        {hover && (
          <g className="bf-web-tip" transform={`translate(${T(hover.at).x} ${T(hover.at).y - (hover.sub ? radii.sub : radii.chapter) - 10})`} pointerEvents="none">
            <text textAnchor="middle">{hover.label}</text>
          </g>
        )}
      </svg>
    </div>
  );
}
