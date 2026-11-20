import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { bookColor, useBook } from '../context';
import { HexGrid, hexAxes } from '../hexroute';
import { hexRingsFor, hexSpiral, type Point } from '../layout';
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
const BOOK_GAP = 26; // 책 영역과 영역 사이에 두는 여백
const REGION_PAD = 20; // 노드에서 책 영역의 테두리까지
const TILT = 16; // 육각형을 살짝 돌리는 각도(도). 가운데에서 오는 줄이 챕터 노드 사이로 지나가게 한다
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

/** 책이 n권일 때 가운데 둘레의 육각형에서 쓸 자리(도). 꼭짓점이 좌우에 오도록 30도 돌린 육각형이다. */
const BOOK_SLOTS: Record<number, number[]> = {
  2: [270, 90],
  3: [30, 150, 270],
  4: [330, 30, 150, 210],
  5: [330, 30, 90, 150, 210],
  6: [330, 30, 90, 150, 210, 270],
};

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

/** 책 한 권의 모양. extent = 가운데에서 가장 바깥 점까지의 거리. rotate = 육각형을 돌리는 각도. */
function shapeOf(book: Book, rotate: number): { extent: number; build: (c: Point) => PlacedChapter[] } {
  // 챕터 하나가 하위 챕터까지 포함해 차지하는 반지름
  const reach = (ch: Chapter): number => {
    const k = ch.children?.length ?? 0;
    return k ? hexRingsFor(k) * SUB_STEP + SUB_R : CHAPTER_R;
  };
  const items = itemsOf(book);
  const widest = Math.max(CHAPTER_R, ...items.map((it) => reach(it.chapter)));
  // 챕터와 하위 챕터가 모두 같은 격자의 노드 자리에 놓이도록 SUB_STEP 의 배수로 올린다
  const step = Math.ceil(Math.max(CHAPTER_STEP, widest * 2 + 18) / SUB_STEP) * SUB_STEP;
  const extent = hexRingsFor(items.length) * step + widest;

  return {
    extent,
    build: (c) => {
      const spots = hexSpiral(items.length, c.x, c.y, step, rotate);
      return items.map(({ chapter, innerBook }, i) => {
        const label = chapterNumber(book, i);
        const at = spots[i]!;
        const subSpots = hexSpiral(chapter.children?.length ?? 0, at.x, at.y, SUB_STEP, rotate);
        return {
          chapter,
          innerBook,
          label,
          at: { x: at.x, y: at.y },
          reach: reach(chapter),
          subs: (chapter.children ?? []).map((sub, j) => ({ sub, label: `${label}.${j + 1}`, at: { x: subSpots[j]!.x, y: subSpots[j]!.y } })),
        };
      });
    },
  };
}

/**
 * 지도 보기. 책은 큰 노드, 챕터는 그 둘레에 육각형을 그려 가며 놓이는 번호 붙은 노드, 하위 챕터는 챕터 둘레의 작은 육각형.
 * 연한 빨강 화살표 줄은 읽는 순서(목록 보기와 같은 순서)다. 책마다 자기 색의 점선 육각형이 영역을 표시한다.
 * 배치 규칙은 layout.ts 의 hexSpiral 참고(첫 고리 6개, 다음 12개, 18개…).
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

    // 책들도 가운데 둘레의 육각형 자리에 놓는다. 먼저 간격 1짜리 육각형에서의 방향을 정한다.
    const slots = BOOK_SLOTS[n];
    const spiral = hexSpiral(n, 0, 0, 1, -30);
    const unit: Point[] = books.map((_, i) => {
      if (n === 1) return { x: 0, y: 0 };
      if (slots) return polar({ x: 0, y: 0 }, 1, slots[i]!);
      return { x: spiral[i]!.x, y: spiral[i]!.y };
    });

    // 가운데에서 책으로 가는 줄이 챕터 노드 사이로 지나가도록, 줄의 방향이 육각형 꼭짓점에서 TILT도 비껴 나게 돌린다.
    // 책 영역끼리 변이 나란하도록 모든 책을 같은 각도로 돌린다(여섯 권까지는 어차피 같은 값이 나온다).
    const toHub = n > 1 ? (Math.atan2(-unit[0]!.x, unit[0]!.y) * 180) / Math.PI : TILT; // 책에서 본 가운데의 방향(0 = 12시, 시계 방향)
    const rotate = (((toHub - TILT) % 60) + 60) % 60;
    const axes = hexAxes(rotate);
    const shapes = books.map((book) => shapeOf(book, rotate));

    // 책을 원점에 놓았을 때 노드들이 차지하는 동그라미들
    const local = books.map((_, i) => [
      { x: 0, y: 0, r: BOOK_R },
      ...shapes[i]!.build({ x: 0, y: 0 }).map((c) => ({ x: c.at.x, y: c.at.y, r: c.reach })),
    ]);

    // 책 영역: 변의 방향은 정육각형과 같고, 변마다 노드에 딱 맞게 당긴 육각형.
    // normals[k] = 가운데에서 k번째 변을 향하는 방향, reach[i][k] = 책 i의 가운데에서 그 변까지의 거리
    const normals = Array.from({ length: 6 }, (_, k) => polar({ x: 0, y: 0 }, 1, rotate + 30 + 60 * k));
    const reach = local.map((circles) => normals.map((nk) => Math.max(...circles.map((c) => c.x * nk.x + c.y * nk.y + c.r)) + REGION_PAD));
    const corners = (i: number): Point[] =>
      normals.map((a, k) => {
        // k번째 변과 k+1번째 변이 만나는 점
        const b = normals[(k + 1) % 6]!;
        const ha = reach[i]![k]!;
        const hb = reach[i]![(k + 1) % 6]!;
        const det = a.x * b.y - a.y * b.x;
        return { x: (ha * b.y - hb * a.y) / det, y: (a.x * hb - b.x * ha) / det };
      });

    // 책의 가운데는 격자의 노드 자리에 맞춘다. 그래야 모든 책의 노드가 한 장의 격자 위에 놓여 줄이 책 사이를 건너갈 수 있다.
    const centersAt = (step: number): Point[] => unit.map((u) => axes.snap({ x: u.x * step, y: u.y * step }));

    // 간격을 step 으로 잡았을 때 두 책의 영역이 겹치거나, 영역이 가운데 표시를 덮는가.
    // 변의 방향이 같은 볼록 도형끼리라서, 여섯 방향 가운데 하나에서라도 떨어져 있으면 겹치지 않는다.
    const collides = (step: number): boolean => {
      const at = centersAt(step);
      for (let i = 0; i < n; i++) {
        const clearOfHub = normals.some((nk, k) => -(at[i]!.x * nk.x + at[i]!.y * nk.y) - reach[i]![k]! >= HUB_R + BOOK_GAP);
        if (!clearOfHub) return true;
        for (let j = i + 1; j < n; j++) {
          const dx = at[j]!.x - at[i]!.x;
          const dy = at[j]!.y - at[i]!.y;
          const apart = normals.some((nk, k) => dx * nk.x + dy * nk.y >= reach[i]![k]! + reach[j]![(k + 3) % 6]! + BOOK_GAP);
          if (!apart) return true;
        }
      }
      return false;
    };
    // 넉넉한 간격에서 시작해, 겹치기 직전까지 가운데로 당긴다
    let step = 0;
    if (n > 1) {
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
          step = Math.max(step, (shapes[i]!.extent + shapes[j]!.extent + REGION_PAD * 3 + BOOK_GAP + 40) / Math.hypot(unit[i]!.x - unit[j]!.x, unit[i]!.y - unit[j]!.y));
      while (step > 8 && !collides(step - 8)) step -= 8;
    }
    const centers = centersAt(step);

    const placed: PlacedBook[] = books.map((book, i) => ({
      book,
      at: centers[i]!,
      chapters: shapes[i]!.build(centers[i]!),
      order: [],
      region: corners(i).map((v) => ({ x: v.x + centers[i]!.x, y: v.y + centers[i]!.y })),
    }));
    const hub: Point | null = n > 1 ? { x: 0, y: 0 } : null;

    // 줄 긋기: 모든 노드를 격자에 올리고, 격자 위에서 길을 찾는다
    const grid = new HexGrid(rotate, [...placed.flatMap((p) => p.region), { x: 0, y: 0 }]);
    const hubNode = hub ? grid.addNode(hub, CLEAR.hub) : -1;
    const bookNode = placed.map((p) => grid.addNode(p.at, CLEAR.book));
    /** '책/챕터' → 노드. 묶음 챕터와 하위 챕터 모두 찾을 수 있다. */
    const where = new Map<string, { node: number; book: number; at: Point }>();
    placed.forEach((p, i) => {
      for (const c of p.chapters) {
        where.set(`${p.book.id}/${c.chapter.id}`, { node: grid.addNode(c.at, CLEAR.chapter), book: i, at: c.at });
        for (const s of c.subs) where.set(`${p.book.id}/${s.sub.id}`, { node: grid.addNode(s.at, CLEAR.sub), book: i, at: s.at });
      }
      grid.addRegion(i, p.at, normals, reach[i]!);
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
    for (const p of placed)
      for (const v of p.region) {
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
