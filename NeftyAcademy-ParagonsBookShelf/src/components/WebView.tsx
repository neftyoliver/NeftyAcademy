import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { bookColor, useBook } from '../context';
import { hexRingsFor, hexSpiral, type Point } from '../layout';
import { href } from '../router';
import type { Book, Chapter } from '../types';
import { chapterNumber, wrapTitle } from './common';

const BOOK_R = 50;
const CHAPTER_R = 15;
const SUB_R = 7;
const SUB_STEP = 27; // 하위 챕터 점 사이 간격(= 챕터에서 첫 고리까지의 거리)
const CHAPTER_STEP = 124; // 챕터 사이 간격의 최소값. 하위 챕터가 많으면 더 벌어진다
const BOOK_GAP = 26; // 책 영역과 영역 사이에 두는 여백
const REGION_PAD = 20; // 노드에서 책 영역의 테두리까지
const TILT = 16; // 육각형을 살짝 돌리는 각도(도). 가운데에서 오는 줄이 챕터 노드 사이로 지나가게 한다
const HUB_R = 30;

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
interface PlacedBook {
  book: Book;
  at: Point;
  chapters: PlacedChapter[];
  /** 읽는 순서대로 잇는 선들: 책 → 1 → 2 → … (하위 챕터가 있으면 7 → 7.1 → 7.2 → … → 8) */
  order: { d: string; sub: boolean }[];
  /** 이 책의 영역: 노드들을 감싸는 육각형의 꼭짓점 */
  region: string;
}
interface CrossLink {
  key: string;
  from: string;
  to: string;
  d: string;
}

const polar = (c: Point, r: number, deg: number): Point => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.sin(t), y: c.y - r * Math.cos(t) };
};

/** 책이 n권일 때 가운데 둘레의 육각형에서 쓸 자리(도). 꼭짓점이 좌우에 오도록 30도 돌린 육각형이다. */
const BOOK_SLOTS: Record<number, number[]> = {
  2: [270, 90],
  3: [30, 150, 270],
  4: [330, 30, 150, 210],
  5: [330, 30, 90, 150, 210],
  6: [330, 30, 90, 150, 210, 270],
};

/** 가운데에 화살표가 놓이도록 중간점을 넣은 선분 */
const arrowLine = (a: Point, b: Point): string =>
  `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2).toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

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
function shapeOf(book: Book, rotate: number): { extent: number; build: (c: Point) => Pick<PlacedBook, 'chapters' | 'order'> } {
  // 챕터 하나가 하위 챕터까지 포함해 차지하는 반지름
  const reach = (ch: Chapter): number => {
    const k = ch.children?.length ?? 0;
    return k ? hexRingsFor(k) * SUB_STEP + SUB_R : CHAPTER_R;
  };
  const items = itemsOf(book);
  const widest = Math.max(CHAPTER_R, ...items.map((it) => reach(it.chapter)));
  const step = Math.max(CHAPTER_STEP, widest * 2 + 18);
  const extent = hexRingsFor(items.length) * step + widest;

  return {
    extent,
    build: (c) => {
      const spots = hexSpiral(items.length, c.x, c.y, step, rotate);
      const chapters = items.map(({ chapter, innerBook }, i) => {
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
      // 목록 보기와 같은 순서로 한 줄로 잇는다
      const order: { d: string; sub: boolean }[] = [];
      let prev = c;
      for (const ch of chapters) {
        order.push({ d: arrowLine(prev, ch.at), sub: false });
        prev = ch.at;
        for (const s of ch.subs) {
          order.push({ d: arrowLine(prev, s.at), sub: true });
          prev = s.at;
        }
      }
      return { chapters, order };
    },
  };
}

/** 두 점을 살짝 휜 선으로 잇는다. 육각형의 곧은 선과 겹쳐도 구별되게. */
function curve(a: Point, b: Point): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bend = 0.14;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${(mx - (b.y - a.y) * bend).toFixed(1)} ${(my + (b.x - a.x) * bend).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/**
 * 지도 보기. 책은 큰 노드, 챕터는 그 둘레에 육각형을 그려 가며 놓이는 번호 붙은 노드, 하위 챕터는 챕터 둘레의 작은 육각형.
 * 연한 빨강 화살표 줄은 읽는 순서(목록 보기와 같은 순서)다. 책마다 자기 색의 점선 육각형이 영역을 표시한다.
 * 배치 규칙은 layout.ts 의 hexSpiral 참고(첫 고리 6개, 다음 12개, 18개…). 끌어서 옮기고 단추로 확대·축소한다.
 * 챕터의 links 에 적힌 다른 챕터와는 휜 줄로 이어진다.
 */
export function WebView({ books }: { books: Book[] }) {
  const { library } = useBook();
  const [hover, setHover] = useState<{ label: string; at: Point; r: number; key: string } | null>(null);
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
    const shapes = books.map((book) => shapeOf(book, rotate));

    // 책을 원점에 놓았을 때 노드들이 차지하는 동그라미들
    const local = books.map((_, i) => [
      { x: 0, y: 0, r: BOOK_R },
      ...shapes[i]!.build({ x: 0, y: 0 }).chapters.map((c) => ({ x: c.at.x, y: c.at.y, r: c.reach })),
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

    // 간격을 step 으로 잡았을 때 두 책의 영역이 겹치거나, 영역이 가운데 표시를 덮는가.
    // 변의 방향이 같은 볼록 도형끼리라서, 여섯 방향 가운데 하나에서라도 떨어져 있으면 겹치지 않는다.
    const collides = (step: number): boolean => {
      for (let i = 0; i < n; i++) {
        const clearOfHub = normals.some((nk, k) => -(unit[i]!.x * nk.x + unit[i]!.y * nk.y) * step - reach[i]![k]! >= HUB_R + BOOK_GAP);
        if (!clearOfHub) return true;
        for (let j = i + 1; j < n; j++) {
          const dx = (unit[j]!.x - unit[i]!.x) * step;
          const dy = (unit[j]!.y - unit[i]!.y) * step;
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
          step = Math.max(step, (shapes[i]!.extent + shapes[j]!.extent + REGION_PAD * 3 + BOOK_GAP) / Math.hypot(unit[i]!.x - unit[j]!.x, unit[i]!.y - unit[j]!.y));
      while (step > 8 && !collides(step - 8)) step -= 8;
    }
    const centers: Point[] = unit.map((u) => ({ x: u.x * step, y: u.y * step }));

    const placed: PlacedBook[] = books.map((book, i) => ({
      book,
      at: centers[i]!,
      ...shapes[i]!.build(centers[i]!),
      region: corners(i).map((v) => `${(v.x + centers[i]!.x).toFixed(1)},${(v.y + centers[i]!.y).toFixed(1)}`).join(' '),
    }));
    // 상호 참조: '책/챕터' → 자리. 묶음 챕터와 하위 챕터 모두 찾을 수 있다.
    const where = new Map<string, Point>();
    for (const p of placed)
      for (const c of p.chapters) {
        where.set(`${p.book.id}/${c.chapter.id}`, c.at);
        for (const s of c.subs) where.set(`${p.book.id}/${s.sub.id}`, s.at);
      }
    const links = new Map<string, CrossLink>();
    const collect = (bookId: string, ch: Chapter): void => {
      const from = `${bookId}/${ch.id}`;
      for (const raw of ch.links ?? []) {
        const to = raw.includes('/') ? raw : `${bookId}/${raw}`;
        const a = where.get(from);
        const b = where.get(to);
        if (!a || !b || from === to) continue; // 지금 보이지 않는 책이거나 없는 챕터
        const key = [from, to].sort().join(' ');
        if (!links.has(key)) links.set(key, { key, from, to, d: curve(a, b) });
      }
      ch.children?.forEach((sub) => collect(bookId, sub));
    };
    for (const p of placed) p.book.chapters.forEach((ch) => collect(p.book.id, ch));

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    placed.forEach((p, i) => {
      for (const v of corners(i)) {
        minX = Math.min(minX, p.at.x + v.x);
        minY = Math.min(minY, p.at.y + v.y);
        maxX = Math.max(maxX, p.at.x + v.x);
        maxY = Math.max(maxY, p.at.y + v.y);
      }
    });
    const pad = 16;
    return { placed, links: [...links.values()], hub: n > 1 ? { x: 0, y: 0 } : null, box: { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 } };
  }, [books]);

  if (books.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;

  const w = box.w / view.k;
  const h = box.h / view.k;
  const viewBox = `${box.x + box.w / 2 + view.dx - w / 2} ${box.y + box.h / 2 + view.dy - h / 2} ${w} ${h}`;
  const zoom = (f: number): void => setView((v) => ({ ...v, k: Math.min(12, Math.max(1, v.k * f)) }));

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

  const tip = (label: string, at: Point, r: number, key: string) => ({
    onPointerEnter: () => setHover({ label, at, r, key }),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover({ label, at, r, key }),
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
        <defs>
          <marker id="bf-order-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
            <path d="M1 1 L9 5 L1 9 z" />
          </marker>
          <marker id="bf-order-arrow-sub" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M1 1 L9 5 L1 9 z" />
          </marker>
        </defs>

        <g className="bf-web-regions">
          {placed.map((p) => (
            <polygon key={p.book.id} points={p.region} style={{ ['--node' as string]: bookColor(library, p.book) }} />
          ))}
        </g>

        <g className="bf-web-lines">{hub && placed.map((p) => <line key={`h-${p.book.id}`} x1={hub.x} y1={hub.y} x2={p.at.x} y2={p.at.y} />)}</g>

        <g className="bf-web-order">
          {placed.map((p) => p.order.map((o, i) => <path key={`${p.book.id}-${i}`} d={o.d} className={o.sub ? 'is-sub' : undefined} markerMid={o.sub ? 'url(#bf-order-arrow-sub)' : 'url(#bf-order-arrow)'} />))}
        </g>

        <g className="bf-web-links">
          {links.map((l) => (
            <path key={l.key} d={l.d} className={hover && (hover.key === l.from || hover.key === l.to) ? 'is-on' : undefined} />
          ))}
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
                      {...tip(`${s.label} ${s.sub.title}${s.sub.draft ? ' · 준비 중' : ''}`, s.at, SUB_R, `${p.book.id}/${s.sub.id}`)}
                    >
                      <circle cx={s.at.x} cy={s.at.y} r={SUB_R} />
                    </a>
                  ))}
                  <a
                    href={c.innerBook ? href({ name: 'book', bookId: c.innerBook }) : href({ name: 'read', bookId: p.book.id, chapterId: c.chapter.id })}
                    className={`bf-node bf-node-chapter${c.innerBook ? ' is-book' : ''}${c.chapter.draft ? ' is-draft' : ''}`}
                    aria-label={`${p.book.title} ${c.label}. ${c.chapter.title}${c.chapter.draft ? ' (준비 중)' : ''}`}
                    {...tip(`${c.label}. ${c.chapter.title}${c.chapter.draft ? ' · 준비 중' : ''}`, c.at, CHAPTER_R, `${p.book.id}/${c.chapter.id}`)}
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
