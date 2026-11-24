import { memo, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react';
import { bookColor, useBook } from '../context';
import { HexGrid } from '../hexroute';
import { hexRingsFor, hexSpiral, type Point } from '../layout';
import { layoutOnion } from '../onion';
import { href } from '../router';
import type { Book, Chapter } from '../types';
import { chapterNumber, wrapInCircle } from './common';

// 노드의 반지름과 글자 크기는 배율 1(전체 보기)에서의 값이다. 확대하면 함께 커진다(radiiAt)
const BOOK_R = 48;
const BOOK_FONT = 15.5; // 책 제목의 글자 크기. 줄 사이는 BOOK_LEADING
const BOOK_LEADING = 18.5;
const CHAPTER_R = 15;
const CHAPTER_FONT = 0.8; // 번호만 보일 때 번호의 글자 크기(챕터 반지름의 몇 배인가)
const SUB_R = 7;
const SUB_STEP = 27; // 하위 챕터 점 사이 간격(= 챕터에서 첫 고리까지의 거리). 길 찾기 격자(hexroute 의 GRID)의 두 배
const CHAPTER_STEP = 124; // 챕터 사이 간격의 최소값. 하위 챕터가 많으면 더 벌어진다. 실제 값은 SUB_STEP 의 배수로 올림한다
const BOOK_GAP = 14; // 책 영역과 영역 사이의 틈
const REGION_PAD = 20; // 노드에서 책 영역의 테두리까지
const MAP_ROTATE = 30; // 책이 여러 권일 때 격자의 방향(도). 30이면 격자의 한 결이 가로로 눕고, 지도의 육각형은 위아래 변이 평평하다
const HUB_R = 30;
const HUB_FONT = 13;
const TIP_FONT = 13; // 노드 위에 뜨는 이름표. 배율의 제곱근만큼만 커진다
// 노드 속에 제목까지 넣기 시작하는 반지름
const CHAPTER_TITLED_R = 30;
const SUB_TITLED_R = 22;
// 노드 속 글자의 크기(노드 반지름의 몇 배인가). 제목은 큰 것부터 대 보고 줄임표 없이 들어가는 첫 크기를 쓴다
const NUM_FONT = 0.3;
const TITLE_FONTS = [0.38, 0.34, 0.3, 0.27];
const TITLE_LEADING = 1.16; // 줄 사이 = 글자 크기의 몇 배
const ZOOM_MAX = 16; // 책이 많은 지도에서도 쪽 노드의 제목을 읽을 수 있을 만큼
const HOVER_WAIT = 160; // 마우스가 노드에 이만큼(ms) 머물러야 그 노드를 고른다. 지나가다 스친 노드의 줄까지 그려져 남지 않게
const FLOW_SPEED = 46; // 화살표가 흐르는 빠르기(화면 단위/초)
const FLOW_GAP = 64; // 흐르는 화살표 사이의 거리
const PORTAL_R = 13; // 지도 밖의 책으로 이어지는 화이트홀의 반지름
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
  /** 이 책의 영역: 노드들을 감싸는 다각형(들) */
  region: Point[][];
  /** 가운데 표시에서 이 책으로 오는 줄 */
  fromHub?: Line;
}
/** 지도에 놓인 챕터(또는 하위 챕터) 하나 */
interface Spot {
  /** '책id/챕터id' */
  key: string;
  node: number;
  at: Point;
  book: number;
  sub: boolean;
}
/** 참조 줄 하나. 두 챕터가 서로 가리켜도, 한 챕터가 다른 챕터를 여러 번 가리켜도 줄은 하나다 */
interface CrossLink {
  key: string;
  a: Spot;
  b: Spot;
  /** a 가 b 를 가리키는가, b 가 a 를 가리키는가 */
  ab: boolean;
  ba: boolean;
  /** a 에서 b 로 가는 길. 길을 찾은 뒤에 채워진다 */
  line?: Line;
  /** 그 길의 path 글(지도 좌표) */
  d?: string;
}

const polar = (c: Point, r: number, deg: number): Point => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.sin(t), y: c.y - r * Math.cos(t) };
};
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/**
 * 배율 k 에서의 노드 반지름. 확대하면 노드 사이가 k배로 벌어지고, 노드도(그 속의 글자도) 함께 커진다.
 * 책, 가운데 표시, 하위 챕터는 그대로 k배가 된다. 챕터는 첫 하위 챕터까지의 거리(SUB_STEP * k)에서
 * 하위 챕터와 틈(4 + k. 배율 1에서 5)을 뺀 만큼이라 k배보다 조금 더 빨리 커지고, 그만큼 제목이 일찍 들어간다.
 * 어느 배율에서도 노드끼리 겹치지 않고, 줄이 비켜 가는 거리(CLEAR * k)보다 작다.
 */
function radiiAt(k: number): { book: number; hub: number; chapter: number; sub: number } {
  const sub = SUB_R * k;
  return { book: BOOK_R * k, hub: HUB_R * k, chapter: SUB_STEP * k - (4 + k) - sub, sub };
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

/** 꺾은선의 path 글 */
const pathOf = (line: Line): string => line.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
const lengthOf = (line: Line): number => line.reduce((sum, p, i) => (i ? sum + Math.hypot(p.x - line[i - 1]!.x, p.y - line[i - 1]!.y) : 0), 0);

/**
 * 남겨 둔 참조 줄의 바탕 그림(지금까지 고른 챕터들의 줄). 줄이 많아도 끌거나 확대할 때마다 다시 계산하지 않도록,
 * 지도 좌표로 한 번 그려 두고 이것을 감싼 묶음(g)의 변환만 바꾼다. 줄의 굵기는 변환을 타지 않는다(CSS 의 vector-effect).
 * routed 는 길을 더 찾을 때마다 올라가는 수로, 새로 찾은 길을 그리게 하려는 것이다.
 */
const LinkLayer = memo(function LinkLayer({ links, kept }: { links: CrossLink[]; kept: ReadonlySet<string>; routed: number }) {
  return <>{links.map((l) => (l.d && kept.has(l.key) ? <path key={l.key} d={l.d} /> : null))}</>;
});

/**
 * 지도마다 남겨 둔 줄. 쪽을 읽고 돌아와도(지도가 다시 그려져도) 남아 있도록 컴포넌트 밖에 둔다.
 * 열쇠는 그 지도에 놓인 책들이고, 화면을 새로 열면 비어 있다.
 */
const KEPT = new Map<string, ReadonlySet<string>>();
const NONE: ReadonlySet<string> = new Set();

/** 화살촉. 오른쪽(+x)을 향한다 */
const HEAD = 'M-7.5 -6.3 L6.8 0 L-7.5 6.3 L-3.6 0 Z'; // 흐르는 화살촉. 줄 위에서 잘 보이는 크기

/**
 * 흐르는 화살표 한 줄. pts = 가리키는 쪽에서 가리킨 쪽으로 가는 길(화면 좌표), r = 도착하는 노드의 반지름.
 * 화살촉들이 길을 따라 흘러가고, 도착하는 노드 바로 앞에는 화살촉 하나가 서 있다.
 * still 이면(움직임을 줄이라는 설정) 흐르지 않고 서 있는 화살촉만 그린다.
 */
function Flow({ pts, r, still }: { pts: Point[]; r: number; still: boolean }) {
  const d = pathOf(pts);
  const len = lengthOf(pts);
  const n = clamp(Math.round(len / FLOW_GAP), 1, 8);
  const dur = Math.max(1.2, len / FLOW_SPEED);
  const end = pts[pts.length - 1]!;
  const before = pts[pts.length - 2] ?? end;
  const seg = Math.hypot(end.x - before.x, end.y - before.y) || 1;
  const ux = (end.x - before.x) / seg;
  const uy = (end.y - before.y) / seg;
  const turn = (Math.atan2(uy, ux) * 180) / Math.PI;
  return (
    <g>
      <path className="bf-flow-line" d={d} />
      {still
        ? null
        : Array.from({ length: n }, (_, i) => (
            <path key={i} className="bf-flow-head" d={HEAD}>
              <animateMotion dur={`${dur.toFixed(2)}s`} begin={`${(-(dur * i) / n).toFixed(2)}s`} repeatCount="indefinite" rotate="auto" path={d} />
            </path>
          ))}
      <path className="bf-flow-head is-end" d={HEAD} transform={`translate(${(end.x - ux * (r + 6)).toFixed(1)} ${(end.y - uy * (r + 6)).toFixed(1)}) rotate(${turn.toFixed(1)})`} />
    </g>
  );
}

/**
 * 지도 보기. 책은 큰 노드, 챕터는 번호 붙은 노드, 하위 챕터는 챕터 둘레의 작은 육각형.
 * 연한 빨강 화살표 줄은 읽는 순서(목록 보기와 같은 순서)다. 책마다 자기 색의 점선 테두리가 영역을 표시한다.
 *
 * 책이 여러 권이면 지도 전체가 육각형이 되고, 책들은 양파 껍질처럼 겹겹이(한 겹에 여섯 권 안팎) 놓인다(onion.ts).
 * 노드는 모두 한 장의 격자 위에 같은 간격으로 놓이고, 책의 영역은 그 자리들을 감싸는 다각형으로 나중에 그려진다.
 * 책이 한 권이면 그 책을 가운데에 두고 챕터를 육각형으로 둘러 놓는다(layout.ts 의 hexSpiral).
 *
 * 줄은 모두 육각형 결(60도 간격의 세 방향)을 따라 꺾이는 꺾은선이고, 노드를 뚫지 않는다(hexroute.ts).
 * 휠을 굴리거나 단추를 누르거나 두 손가락을 벌리면 확대된다. 확대하면 간격이 벌어지면서 노드와 글자도 함께 커지고,
 * 충분히 커진 노드에는 제목이 들어간다. 끌어서 옮긴다.
 *
 * 참조 줄: 챕터의 links(본문에서 가리킨 다른 챕터)가 줄이 된다. 같은 두 챕터 사이에는 한 줄뿐이다.
 * 처음에는 아무 줄도 긋지 않는다(수천 개를 다 그으면 지도가 늦게 뜬다). 챕터에 올리면(손가락으로는 한 번 누르면)
 * 그 챕터가 "고른 챕터"가 되고, 그 챕터를 가리키는 쪽에서 화살표가 흘러온다.
 * R 키나 왼쪽 아래 단추로 방향을 뒤집으면, 고른 챕터가 가리키는 쪽으로 화살표가 흘러간다(들어오던 화살표는 가려진다).
 * 한 번 그린 줄은 다른 챕터를 골라도 옅은 점선으로 남는다. 「참조관계 지우기」 단추가 남은 줄을 모두 지운다.
 * 가리키는 쪽이 이 지도에 없는 책이면, 그 책(또는 그 책을 담은 서가)이 책 노드로라도 놓여 있을 때는 그 노드로 잇고,
 * 아예 없을 때는 챕터 옆에 화이트홀을 그려 지도 밖으로 이어짐을 보인다.
 */
export function WebView({ books }: { books: Book[] }) {
  const { library, refs, record, readOf, bookPath } = useBook();
  const [hover, setHover] = useState<{ label: string; at: Point; sub: boolean; key: string } | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [mode, setMode] = useState<'in' | 'out'>('in');
  const [view, setView] = useState({ k: 1, dx: 0, dy: 0 });
  const [routed, setRouted] = useState(0);
  const mapKey = useMemo(() => books.map((b) => b.id).join('|'), [books]);
  const [kept, setKept] = useState<ReadonlySet<string>>(() => KEPT.get(mapKey) ?? NONE);
  const [fit, setFit] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());
  /** 두 손가락 사이의 거리. 0 = 벌리는 중이 아님 */
  const pinch = useRef(0);
  const pointerKind = useRef('mouse');
  /** 손가락으로 한 번 눌러 고른 챕터. 한 번 더 누르면 그 챕터를 연다 */
  const armed = useRef('');
  const waiting = useRef(0);
  const gradient = `bfp${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const still = useMemo(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const { placed, box, hub, links, routeLink, spots, spotOf, rotate } = useMemo(() => {
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
      placed = [{ book, at: { x: 0, y: 0 }, chapters, order: [], region: [outline] }];
    } else {
      // 여러 권이면 지도 전체가 육각형이 되게 양파 껍질처럼 겹겹이 놓는다(onion.ts).
      // 자리 사이의 간격은 어느 책에서나 같다: 가장 넓은 간격이 필요한 책에 맞춘다.
      rotate = MAP_ROTATE;
      const onion = layoutOnion(sizes.map((s) => s.items.length + 1), { step: Math.max(...sizes.map((s) => s.step)), rotate, gap: BOOK_GAP });
      outline = onion.outline;
      placed = books.map((book, i) => {
        const { spots, region } = onion.books[i]!;
        return { book, at: spots[0]!, chapters: chaptersAt(book, spots.slice(1), rotate), order: [], region };
      });
    }
    const hub: Point | null = n > 1 ? { x: 0, y: 0 } : null;

    // 줄 긋기: 모든 노드를 격자에 올리고, 격자 위에서 길을 찾는다
    const grid = new HexGrid(rotate, [...outline, { x: 0, y: 0 }]);
    const hubNode = hub ? grid.addNode(hub, CLEAR.hub) : -1;
    const bookNode = placed.map((p) => grid.addNode(p.at, CLEAR.book));
    /** '책/챕터' → 지도의 자리. 묶음 챕터, 하위 챕터, 서가 안의 책(챕터 자리에 놓인 것) 모두 찾을 수 있다. */
    const spots = new Map<string, Spot>();
    placed.forEach((p, i) => {
      for (const c of p.chapters) {
        const key = `${p.book.id}/${c.chapter.id}`;
        spots.set(key, { key, node: grid.addNode(c.at, CLEAR.chapter), book: i, at: c.at, sub: false });
        for (const s of c.subs) {
          const subKey = `${p.book.id}/${s.sub.id}`;
          spots.set(subKey, { key: subKey, node: grid.addNode(s.at, CLEAR.sub), book: i, at: s.at, sub: true });
        }
      }
      for (const loop of p.region) grid.addRegion(i, loop);
    });
    const between = (a: { node: number; at: Point }, b: { node: number; at: Point }, home: number[]): Line => grid.route(a.node, b.node, home) ?? [a.at, b.at];

    // 읽는 순서: 목록 보기와 같은 순서로 한 줄로 잇는다
    placed.forEach((p, i) => {
      let prev = { node: bookNode[i]!, at: p.at };
      for (const c of p.chapters) {
        const next = spots.get(`${p.book.id}/${c.chapter.id}`)!;
        p.order.push({ line: between(prev, next, [i]), sub: false });
        prev = next;
        for (const s of c.subs) {
          const sub = spots.get(`${p.book.id}/${s.sub.id}`)!;
          p.order.push({ line: between(prev, sub, [i]), sub: true });
          prev = sub;
        }
      }
    });
    // 가운데 표시에서 책으로
    if (hub) placed.forEach((p, i) => (p.fromHub = between({ node: hubNode, at: hub }, { node: bookNode[i]!, at: p.at }, [i])));

    // 참조. 지도에 없는 쪽은, 그 쪽이 든 책이나 그 책을 담은 서가가 이 지도에 책 노드(챕터 자리의 책)로 놓여 있으면 그 노드로 친다
    const viaBook = new Map<string, Spot | undefined>();
    const spotOf = (key: string): Spot | undefined => {
      const hit = spots.get(key);
      if (hit) return hit;
      const target = refs.at.get(key);
      if (!target) return undefined;
      const id = target.book.id;
      if (!viaBook.has(id)) {
        const path = bookPath(id); // 바깥 서가 → … → 이 책
        let found: Spot | undefined;
        for (let i = path.length - 1; i > 0 && !found; i--) found = spots.get(`${path[i - 1]!.id}/${path[i]!.id}`);
        viaBook.set(id, found);
      }
      return viaBook.get(id);
    };
    const links = new Map<string, CrossLink>();
    for (const [from, targets] of refs.out) {
      const a = spotOf(from);
      if (!a) continue;
      for (const to of targets) {
        const b = spotOf(to);
        if (!b || a === b) continue;
        const lo: Spot = a.key < b.key ? a : b;
        const hi: Spot = lo === a ? b : a;
        const key = `${lo.key} ${hi.key}`;
        const link = links.get(key) ?? links.set(key, { key, a: lo, b: hi, ab: false, ba: false }).get(key)!;
        if (a === lo) link.ab = true;
        else link.ba = true;
      }
    }
    const routeLink = (l: CrossLink): Line => {
      if (!l.line) {
        l.line = between(l.a, l.b, [l.a.book, l.b.book]);
        l.d = pathOf(l.line);
      }
      return l.line;
    };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const v of outline) {
      minX = Math.min(minX, v.x);
      minY = Math.min(minY, v.y);
      maxX = Math.max(maxX, v.x);
      maxY = Math.max(maxY, v.y);
    }
    const pad = 16;
    return { placed, links: [...links.values()], routeLink, spots, spotOf, rotate, hub, box: { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 } };
  }, [books, refs, bookPath]);

  // 지도가 바뀌면(카테고리를 바꾸거나 다른 서가로 가면) 고른 챕터를 풀고, 그 지도에 남겨 둔 줄을 꺼낸다
  useEffect(() => {
    setFocus(null);
    armed.current = '';
    setKept(KEPT.get(mapKey) ?? NONE);
  }, [links, mapKey]);

  // 고른 챕터의 줄(지금 방향). 지도에 놓인 쪽끼리의 줄만이다
  const focusLinks = useMemo(() => {
    const at = focus ? spots.get(focus) : undefined;
    if (!at) return [];
    return links.filter((l) => (mode === 'in' ? (l.b === at && l.ab) || (l.a === at && l.ba) : (l.a === at && l.ab) || (l.b === at && l.ba)));
  }, [focus, mode, links, spots]);

  // 고른 챕터의 줄은 남겨 둔다
  useEffect(() => {
    if (focusLinks.length === 0) return;
    setKept((old) => {
      if (focusLinks.every((l) => old.has(l.key))) return old;
      const next = new Set(old);
      for (const l of focusLinks) next.add(l.key);
      KEPT.set(mapKey, next);
      return next;
    });
  }, [focusLinks, mapKey]);

  // 줄의 길은 그릴 것만, 조금씩 나눠서 찾는다. 줄이 수백 개 걸린 챕터를 골라도 화면이 멈추지 않는다
  useEffect(() => {
    const seen = new Set<string>();
    const todo = [...focusLinks, ...links.filter((l) => kept.has(l.key))].filter((l) => !l.line && !seen.has(l.key) && seen.add(l.key));
    if (todo.length === 0) return;
    let alive = true;
    let done = 0;
    let timer = 0;
    let shown = performance.now();
    const step = (): void => {
      if (!alive) return;
      const until = performance.now() + 9;
      while (done < todo.length && performance.now() < until) routeLink(todo[done++]!);
      // 다 찾았거나 조금 모였을 때만 그린다. 길 하나 찾을 때마다 그리면 그리는 데 시간이 더 든다
      const now = performance.now();
      if (done >= todo.length || now - shown >= 70) {
        shown = now;
        setRouted((n) => n + 1);
      }
      if (done < todo.length) timer = window.setTimeout(step, 3);
    };
    timer = window.setTimeout(step, 0);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [focusLinks, kept, links, routeLink]);

  // 화면의 가운데(지도 좌표). 확대는 이 점을 중심으로 좌표를 늘리고, viewBox 는 그대로 둔다.
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const center = useRef({ cx, cy });
  center.current = { cx, cy };

  /** 화면의 한 점(마우스, 두 손가락의 가운데)이 제자리에 있도록 f 배로 확대한다 */
  const zoomAt = useRef((_x: number, _y: number, _f: number): void => {});
  zoomAt.current = (x, y, f) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return;
    const q = new DOMPoint(x, y).matrixTransform(m.inverse());
    const c = center.current;
    setView((v) => {
      const k = clamp(v.k * f, 1, ZOOM_MAX);
      if (k === v.k) return v;
      if (k === 1) return { k: 1, dx: 0, dy: 0 };
      // 그 점 아래의 지도 좌표 p 가 확대 뒤에도 화면의 같은 자리 q 에 오도록 옮긴다
      const px = (q.x - c.cx) / v.k + c.cx + v.dx;
      const py = (q.y - c.cy) / v.k + c.cy + v.dy;
      return { k, dx: px - c.cx - (q.x - c.cx) / k, dy: py - c.cy - (q.y - c.cy) / k };
    });
  };

  // 휠로 확대·축소
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      zoomAt.current(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [books.length === 0]);

  // 지도의 높이: 지도의 위쪽에서 화면의 아래쪽까지. 위에 글이 많아 그 거리가 짧아도 화면 높이의 78%는 쓴다
  useLayoutEffect(() => {
    const measureFit = (): void => {
      const el = svg.current;
      if (el) setFit(Math.max(260, Math.round(window.innerHeight * 0.78), window.innerHeight - (el.getBoundingClientRect().top + window.scrollY) - 20));
    };
    measureFit();
    window.addEventListener('resize', measureFit);
    return () => window.removeEventListener('resize', measureFit);
  }, [placed]);

  // R: 화살표의 방향 뒤집기, Esc: 고른 챕터 풀기
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.code === 'KeyR') setMode((m) => (m === 'in' ? 'out' : 'in'));
      else if (e.key === 'Escape') {
        armed.current = '';
        setFocus(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (books.length === 0) return <p className="bf-empty">이 카테고리에는 아직 책이 없습니다.</p>;

  const { k } = view;
  /** 지도 좌표 → 화면(viewBox) 좌표 */
  const T = (p: Point): Point => ({ x: (p.x - cx - view.dx) * k + cx, y: (p.y - cy - view.dy) * k + cy });
  const path = (line: Line): string => pathOf(line.map(T));
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
  const chapterTitled = radii.chapter >= CHAPTER_TITLED_R;
  const subTitled = radii.sub >= SUB_TITLED_R;
  const zoom = (f: number): void =>
    setView((v) => {
      const next = clamp(v.k * f, 1, ZOOM_MAX);
      return next === 1 ? { k: 1, dx: 0, dy: 0 } : { ...v, k: next };
    });

  // ---------- 끌기와 두 손가락 벌리기 ----------
  const onPointerDown = (e: RPointerEvent<SVGSVGElement>): void => {
    pointerKind.current = e.pointerType;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const at = touches.current;
    at.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (at.size === 2) {
      const [p, q] = [...at.values()] as [{ x: number; y: number }, { x: number; y: number }];
      pinch.current = Math.hypot(p.x - q.x, p.y - q.y);
      // 두 손가락의 가운데를 끌기의 기준으로 삼는다. 손을 뗀 뒤의 클릭(링크 이동)은 막는다
      drag.current = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, moved: true };
    } else if (at.size === 1) drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerMove = (e: RPointerEvent<SVGSVGElement>): void => {
    const at = touches.current;
    const mine = at.get(e.pointerId);
    const d = drag.current;
    const el = svg.current;
    if (!mine || !d || !el) return;
    mine.x = e.clientX;
    mine.y = e.clientY;
    let x = e.clientX;
    let y = e.clientY;
    if (at.size >= 2) {
      const [p, q] = [...at.values()] as [{ x: number; y: number }, { x: number; y: number }];
      x = (p.x + q.x) / 2;
      y = (p.y + q.y) / 2;
      const apart = Math.hypot(p.x - q.x, p.y - q.y);
      if (pinch.current > 0 && apart > 0) zoomAt.current(x, y, apart / pinch.current);
      pinch.current = apart;
    }
    const px = x - d.x;
    const py = y - d.y;
    if (!d.moved && Math.hypot(px, py) < 5) return;
    if (!d.moved) el.setPointerCapture(e.pointerId);
    d.moved = true;
    d.x = x;
    d.y = y;
    const scale = 1 / (el.getScreenCTM()?.a || 1); // 화면 1px = viewBox 몇 단위
    setView((v) => ({ ...v, dx: v.dx - (px * scale) / v.k, dy: v.dy - (py * scale) / v.k }));
  };
  const onPointerUp = (e: RPointerEvent<SVGSVGElement>): void => {
    const at = touches.current;
    const wasPinch = at.size >= 2;
    at.delete(e.pointerId);
    pinch.current = 0;
    if (wasPinch && at.size === 1) {
      // 한 손가락이 남았다: 그 손가락으로 끌기를 이어 간다
      const [p] = [...at.values()] as [{ x: number; y: number }];
      drag.current = { x: p.x, y: p.y, moved: true };
      return;
    }
    // 끌었으면 이어지는 클릭(링크 이동)을 한 번 막는다
    if (drag.current?.moved) {
      const stop = (ev: MouseEvent): void => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      window.addEventListener('click', stop, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
    }
    if (at.size === 0) drag.current = null;
  };
  const onBackground = (e: RMouseEvent<SVGSVGElement>): void => {
    if (e.target !== e.currentTarget) return;
    armed.current = '';
    setFocus(null);
  };

  // ---------- 올리기, 고르기 ----------
  const tip = (label: string, at: Point, sub: boolean, key: string) => ({
    onPointerEnter: (e: RPointerEvent) => {
      setHover({ label, at, sub, key });
      if (e.pointerType !== 'mouse') return;
      window.clearTimeout(waiting.current);
      waiting.current = window.setTimeout(() => setFocus(key), HOVER_WAIT);
    },
    onPointerLeave: () => {
      setHover(null);
      window.clearTimeout(waiting.current);
    },
    onFocus: () => {
      setHover({ label, at, sub, key });
      setFocus(key);
    },
    onBlur: () => setHover(null),
    // 손가락으로는 처음 누르면 고르기만 하고, 고른 것을 한 번 더 누르면 연다
    onClick: (e: RMouseEvent) => {
      if (pointerKind.current === 'mouse' || armed.current === key) return;
      e.preventDefault();
      armed.current = key;
      setFocus(key);
      setHover({ label, at, sub, key });
    },
  });
  /** 노드 안에 넣는 번호와 제목. r = 노드의 반지름 */
  const titled = (at: Point, r: number, label: string, title: string) => {
    const shift = r * 0.14;
    let font = 0;
    let leading = 0;
    let lines: string[] = [];
    for (const f of TITLE_FONTS) {
      font = r * f;
      leading = font * TITLE_LEADING;
      const fitted = wrapInCircle(title, r, font, leading, 3, shift);
      lines = fitted.lines;
      if (!fitted.clipped) break;
    }
    return (
      <>
        <text x={at.x} y={at.y - r * 0.62} dy="0.35em" className="bf-node-num" style={{ fontSize: r * NUM_FONT }}>
          {label}
        </text>
        {lines.map((line, i) =>
          line ? (
            <text key={i} x={at.x} y={at.y + shift + (i - (lines.length - 1) / 2) * leading} dy="0.35em" style={{ fontSize: font }}>
              {line}
            </text>
          ) : null,
        )}
      </>
    );
  };

  // ---------- 고른 챕터의 화살표 ----------
  const focusSpot = focus ? spots.get(focus) : undefined;
  const focusPage = focus ? refs.at.get(focus) : undefined;
  const radiusOf = (s: Spot): number => (s.sub ? radii.sub : radii.chapter);
  const flows = focusSpot
    ? focusLinks
        .filter((l) => l.line)
        .map((l) => {
          const line = l.line!;
          // a 에서 b 로 흐르는가. 들어오는 화살표는 고른 챕터가 끝이고, 나가는 화살표는 고른 챕터가 처음이다
          const forward = mode === 'in' ? l.b === focusSpot : l.a === focusSpot;
          return { key: l.key, pts: (forward ? line : [...line].reverse()).map(T), r: radiusOf(forward ? l.b : l.a) };
        })
    : [];
  /** 고른 챕터와 이어진 쪽들(지금 방향). 지도에 없는 쪽도 들어 있다 */
  const listed = focus && focusPage ? ((mode === 'in' ? refs.into : refs.out).get(focus) ?? []) : [];
  const outside = listed.filter((key) => !spotOf(key));
  let portal: { at: Point; r: number; pts: Point[]; end: number } | null = null;
  if (focusSpot && outside.length > 0) {
    // 화이트홀은 챕터 둘레의 여섯 방향 가운데 다른 노드에서 가장 먼 쪽에 둔다
    const reach = (focusSpot.sub ? CLEAR.sub : CLEAR.chapter) + 34;
    let best = focusSpot.at;
    let room = -Infinity;
    for (let i = 0; i < 6; i++) {
      const c = polar(focusSpot.at, reach, rotate + 30 + 60 * i);
      let gap = Infinity;
      for (const s of spots.values()) if (s !== focusSpot) gap = Math.min(gap, Math.hypot(s.at.x - c.x, s.at.y - c.y) - (s.sub ? SUB_R : CHAPTER_R));
      for (const p of placed) gap = Math.min(gap, Math.hypot(p.at.x - c.x, p.at.y - c.y) - BOOK_R);
      if (gap > room) {
        room = gap;
        best = c;
      }
    }
    const r = PORTAL_R * Math.sqrt(k);
    const hole = T(best);
    const node = T(focusSpot.at);
    portal = mode === 'in' ? { at: hole, r, pts: [hole, node], end: radiusOf(focusSpot) } : { at: hole, r, pts: [node, hole], end: r };
  }
  const flip = (): void => setMode((m) => (m === 'in' ? 'out' : 'in'));
  /** 남겨 둔 줄을 모두 지우고, 고른 챕터도 푼다 */
  const wipe = (): void => {
    armed.current = '';
    setFocus(null);
    setKept(NONE);
    KEPT.delete(mapKey);
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
        // 전체 보기에서는 한 손가락으로 쪽을 위아래로 넘길 수 있게 두고, 확대한 뒤에는 한 손가락이 지도를 끈다
        style={{ maxHeight: fit ?? undefined, touchAction: k > 1 ? 'none' : 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onBackground}
      >
        <defs>
          {/* 화이트홀의 빛: 가운데는 희고, 바깥으로 푸르게 번지다 사라진다(밝은 바탕에서도 보이게) */}
          <radialGradient id={gradient}>
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.3" stopColor="#d6ecff" stopOpacity="0.95" />
            <stop offset="0.62" stopColor="#7fb8ff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#7fb8ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="bf-web-regions">
          {placed.map((p) => (
            <path key={p.book.id} d={p.region.map((loop) => `${path(loop)} Z`).join(' ')} style={{ ['--node' as string]: bookColor(library, p.book) }} />
          ))}
        </g>

        <g className="bf-web-lines">{placed.map((p) => p.fromHub && <path key={`h-${p.book.id}`} d={path(p.fromHub)} />)}</g>

        <g className="bf-web-order">
          {placed.map((p) =>
            p.order.map((o, i) => (
              <g key={`${p.book.id}-${i}`} className={o.sub ? 'is-sub' : undefined}>
                <path d={path(o.line)} />
                <path className="bf-web-arrow" d={arrow(o.line, o.sub ? 4.2 : 5.6)} />
              </g>
            )),
          )}
        </g>

        {/* 지금까지 고른 챕터들의 참조 줄(옅게). 챕터를 고르고 있으면 더 옅어지고, 그 챕터의 화살표만 또렷해진다 */}
        <g className={`bf-web-links${focusSpot ? ' has-focus' : ''}`} transform={`matrix(${k} 0 0 ${k} ${(cx - (cx + view.dx) * k).toFixed(2)} ${(cy - (cy + view.dy) * k).toFixed(2)})`}>
          <LinkLayer links={links} kept={kept} routed={routed} />
        </g>

        <g className={`bf-web-flows is-${mode}`}>
          {flows.map((f) => (
            <Flow key={f.key} pts={f.pts} r={f.r} still={still} />
          ))}
          {portal ? <Flow pts={portal.pts} r={portal.end} still={still} /> : null}
        </g>

        {hub && (
          <g className="bf-web-hub">
            <circle cx={T(hub).x} cy={T(hub).y} r={radii.hub} />
            <text x={T(hub).x} y={T(hub).y} dy="0.35em" style={{ fontSize: HUB_FONT * k }}>
              {books.length}권
            </text>
          </g>
        )}

        {placed.map((p) => {
          const color = bookColor(library, p.book);
          const bookAt = T(p.at);
          const reading = record.status === 'ready';
          return (
            <g key={p.book.id} style={{ ['--node' as string]: color }}>
              {p.chapters.map((c) => {
                const at = T(c.at);
                const key = `${p.book.id}/${c.chapter.id}`;
                const inner = c.innerBook ? p.book.books?.find((b) => b.id === c.innerBook) : undefined;
                const read = reading && (inner ? readOf(inner).complete : record.pages[key]?.done !== undefined);
                return (
                  <g key={c.chapter.id}>
                    {c.subs.map((s) => {
                      const subAt = T(s.at);
                      const subKey = `${p.book.id}/${s.sub.id}`;
                      return (
                        <a
                          key={s.sub.id}
                          href={href({ name: 'read', bookId: p.book.id, chapterId: s.sub.id })}
                          className={`bf-node bf-node-sub${subTitled ? ' is-titled' : ''}${s.sub.draft ? ' is-draft' : ''}${focus === subKey ? ' is-focus' : ''}${reading && record.pages[subKey]?.done !== undefined ? ' is-read' : ''}`}
                          aria-label={`${p.book.title} ${s.label} ${s.sub.title}${s.sub.draft ? ' (준비 중)' : ''}`}
                          {...tip(`${s.label} ${s.sub.title}${s.sub.draft ? ' · 준비 중' : ''}`, s.at, true, subKey)}
                        >
                          <circle cx={subAt.x} cy={subAt.y} r={radii.sub} />
                          {subTitled && titled(subAt, radii.sub, s.label, s.sub.title)}
                        </a>
                      );
                    })}
                    <a
                      href={c.innerBook ? href({ name: 'book', bookId: c.innerBook }) : href({ name: 'read', bookId: p.book.id, chapterId: c.chapter.id })}
                      className={`bf-node bf-node-chapter${chapterTitled ? ' is-titled' : ''}${c.innerBook ? ' is-book' : ''}${c.chapter.draft ? ' is-draft' : ''}${focus === key ? ' is-focus' : ''}${read ? (inner ? ' is-complete' : ' is-read') : ''}`}
                      aria-label={`${p.book.title} ${c.label}. ${c.chapter.title}${c.chapter.draft ? ' (준비 중)' : ''}`}
                      {...tip(`${c.label}. ${c.chapter.title}${c.chapter.draft ? ' · 준비 중' : ''}`, c.at, false, key)}
                    >
                      <circle cx={at.x} cy={at.y} r={radii.chapter} />
                      {chapterTitled ? (
                        titled(at, radii.chapter, c.label, c.chapter.title)
                      ) : (
                        <text x={at.x} y={at.y} dy="0.35em" style={{ fontSize: radii.chapter * CHAPTER_FONT }}>
                          {c.label}
                        </text>
                      )}
                    </a>
                  </g>
                );
              })}
              <a href={href({ name: 'book', bookId: p.book.id })} className={`bf-node bf-node-book${reading && readOf(p.book).complete ? ' is-complete' : ''}`} aria-label={p.book.title}>
                <circle cx={bookAt.x} cy={bookAt.y} r={radii.book} />
                {wrapInCircle(p.book.title, BOOK_R, BOOK_FONT, BOOK_LEADING).lines.map((line, i, all) =>
                  line ? (
                    <text key={i} x={bookAt.x} y={bookAt.y + (i - (all.length - 1) / 2) * BOOK_LEADING * k} dy="0.35em" style={{ fontSize: BOOK_FONT * k }}>
                      {line}
                    </text>
                  ) : null,
                )}
              </a>
            </g>
          );
        })}

        {portal && (
          <g className="bf-web-portal" transform={`translate(${portal.at.x.toFixed(1)} ${portal.at.y.toFixed(1)})`} pointerEvents="none">
            <circle r={portal.r * 2.1} fill={`url(#${gradient})`} />
            <circle className="bf-portal-ring" r={portal.r} />
            <circle className="bf-portal-ring is-inner" r={portal.r * 0.56} />
            <circle className="bf-portal-core" r={portal.r * 0.22} />
            <text y={portal.r * 2.1 + 6 * Math.sqrt(k)} dy="0.35em" style={{ fontSize: 11 * Math.sqrt(k), strokeWidth: 4 * Math.sqrt(k) }}>
              다른 책 {outside.length}쪽
            </text>
          </g>
        )}

        {hover && (
          <g className="bf-web-tip" transform={`translate(${T(hover.at).x} ${T(hover.at).y - (hover.sub ? radii.sub : radii.chapter) - 10 * Math.sqrt(k)})`} pointerEvents="none">
            <text textAnchor="middle" style={{ fontSize: TIP_FONT * Math.sqrt(k), strokeWidth: 5 * Math.sqrt(k) }}>
              {hover.label}
            </text>
          </g>
        )}
      </svg>

      <div className="bf-web-refs">
        {focus && focusPage ? (
          <div className="bf-web-reflist">
            <p className="bf-web-refhead">
              <a href={href({ name: 'read', bookId: focusPage.book.id, chapterId: focusPage.chapter.id })}>
                <span className="bf-num">{focusPage.label}</span>
                {focusPage.chapter.title}
              </a>
              <button
                type="button"
                className="bf-x"
                aria-label="고른 챕터 풀기"
                onClick={() => {
                  armed.current = '';
                  setFocus(null);
                }}
              >
                ×
              </button>
            </p>
            <p className="bf-web-refdir">{mode === 'in' ? `← 이 챕터를 참조하는 쪽 ${listed.length}` : `→ 이 챕터가 참조하는 쪽 ${listed.length}`}</p>
            {listed.length > 0 ? (
              <ul>
                {listed.map((key) => {
                  const t = refs.at.get(key)!;
                  return (
                    <li key={key} className={spotOf(key) ? undefined : 'is-outside'}>
                      <a href={href({ name: 'read', bookId: t.book.id, chapterId: t.chapter.id })}>
                        <span className="bf-num">{t.label}</span>
                        {t.chapter.title}
                        <small>{t.book.title}</small>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div className="bf-web-keys">
          <button type="button" className="bf-web-mode" onClick={flip} aria-pressed={mode === 'out'} title="화살표의 방향을 뒤집습니다">
            <kbd>R</kbd>
            {mode === 'in' ? '챕터가 참조하는 쪽 보기' : '챕터를 참조하는 쪽 보기'}
          </button>
          {kept.size > 0 ? (
            <button type="button" className="bf-web-mode bf-web-wipe" onClick={wipe} title="지금까지 그린 참조 줄을 모두 지웁니다">
              참조관계 지우기
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
