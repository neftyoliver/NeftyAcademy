/**
 * 책 여러 권(두 권 이상)을 한 장의 지도에 놓는 규칙.
 *
 *  - 지도 전체는 책의 수만큼 모서리가 있는 정다각형이다(9권이면 정9각형. 2권은 정사각형).
 *  - 가운데에서 테두리까지 그은 경계선이 다각형을 책의 수만큼 조각으로 나눈다. 조각 하나가 책 한 권의 자리다.
 *    조각 사이의 틈은 어디서나 같다.
 *  - 조각의 너비(각도)는 책의 크기에 맞춘다. 모든 책이 딱 들어가면서 다각형이 가장 작아지는 각도를 찾는다.
 *    크기가 비슷한 책들이면 똑같이 나눈다.
 *  - 노드는 가운데를 둘러싼 육각형 고리(거미줄) 위에 놓인다. 가운데에서 가장 가까운 자리가 책이고,
 *    챕터는 고리를 하나씩 바깥으로 옮겨 가며 갈지자로 채운다.
 *
 * 책의 모양은 정해져 있지 않다. 조각의 모양에 따라 부채꼴도, 길쭉한 띠도 된다.
 * 책을 더하거나 빼면 다각형의 모서리 수와 조각이 다시 계산된다.
 */
import { hexRingSize, type Point } from './layout';

/** 책 한 권이 지도에서 필요로 하는 것 */
export interface PieNeed {
  /** 이 책의 자리 사이 간격 */
  step: number;
  /**
   * 자리마다, 그 가운데에서 조각의 테두리까지 비워야 하는 거리. 첫 값이 책이고 그다음이 챕터 순서대로다.
   * 하위 챕터가 많은 챕터는 크게, 없는 챕터는 작게 준다. 작은 것은 테두리 가까이에도 놓인다.
   */
  clears: number[];
}

export interface PieOptions {
  /** 육각형 고리를 돌리는 각도(도). 0 = 12시, 시계 방향 */
  rotate: number;
  /** 조각과 조각 사이의 틈 */
  gap: number;
  /** 가운데 표시 둘레로 비워 두는 반지름. 조각은 여기서부터 시작한다 */
  hubRadius: number;
}

export interface PieBook {
  /** 이 책의 조각(꼭짓점들) */
  cell: Point[];
  /** 자리들. 첫 자리가 책이고, 그다음이 챕터 순서대로다 */
  spots: Point[];
}

export interface Pie {
  /** 다각형의 꼭짓점들 */
  outline: Point[];
  books: PieBook[];
}

interface RingPoint extends Point {
  /** 가운데에서 본 방향(도, 0 = 12시, 시계 방향) */
  ang: number;
  /** 가운데에서의 거리 */
  len: number;
}

const RAD = Math.PI / 180;
const mod360 = (deg: number): number => ((deg % 360) + 360) % 360;
const dir = (deg: number): Point => ({ x: Math.sin(deg * RAD), y: -Math.cos(deg * RAD) });

/** 가운데를 둘러싼 k번째 육각형 고리의 자리들(시계 방향). layout.ts 의 hexSpiral 과 같은 자리다. */
function makeRing(step: number, k: number, rotate: number): RingPoint[] {
  const out: RingPoint[] = [];
  for (let i = 0; i < hexRingSize(k); i++) {
    const side = Math.floor(i / k);
    const t = (i % k) / k;
    const a = dir(60 * side + rotate);
    const b = dir(60 * (side + 1) + rotate);
    const x = k * step * (a.x + (b.x - a.x) * t);
    const y = k * step * (a.y + (b.y - a.y) * t);
    out.push({ x, y, ang: mod360(Math.atan2(x, -y) / RAD), len: Math.hypot(x, y) });
  }
  return out;
}

/** 경계 반직선까지의 거리. rel = 그 반직선에서 벌어진 각도(도) */
const fromRay = (len: number, rel: number): number => (rel < 90 ? len * Math.sin(rel * RAD) : len);

export function layoutPie(needs: PieNeed[], opt: PieOptions): Pie {
  const n = needs.length;
  const sides = n >= 3 ? n : 4;
  // 짝수각형은 윗변이 평평하게, 홀수각형은 꼭짓점이 위로 오게 놓는다
  const turn = sides % 2 === 0 ? 180 / sides : 0;
  const cosHalf = Math.cos(Math.PI / sides);
  /** 변의 바깥쪽 방향들 */
  const normals = Array.from({ length: sides }, (_, j) => dir(turn + (360 * (j + 0.5)) / sides));

  const rings = new Map<string, RingPoint[]>();
  const ringOf = (step: number, k: number): RingPoint[] => {
    const key = `${step}/${k}`;
    let ring = rings.get(key);
    if (!ring) rings.set(key, (ring = makeRing(step, k, opt.rotate)));
    return ring;
  };

  /**
   * 반지름 R 인 다각형에서, start 도에서 시작해 span 도만큼 벌어진 조각에 책 한 권을 놓아 본다.
   * 자리가 모자라면 null.
   */
  const fill = (need: PieNeed, start: number, span: number, R: number): Point[] | null => {
    const { step, clears } = need;
    const apothem = R * cosHalf;
    const least = Math.min(...clears);
    if (apothem <= least) return null;
    const half = opt.gap / 2;
    let book: RingPoint | null = null;
    /** 고리마다, 쓸 수 있는 자리들과 그 자리에서 테두리까지의 여유 */
    const arcs: { p: RingPoint; rel: number; room: number }[][] = [];
    for (let k = 1; k * step * 0.866 <= R; k++) {
      const arc: { p: RingPoint; rel: number; room: number }[] = [];
      for (const p of ringOf(step, k)) {
        const rel = mod360(p.ang - start);
        if (rel <= 0 || rel >= span) continue;
        let room = Math.min(p.len - opt.hubRadius, fromRay(p.len, rel) - half, fromRay(p.len, span - rel) - half);
        if (room < least) continue;
        for (const m of normals) room = Math.min(room, apothem - (p.x * m.x + p.y * m.y));
        if (room < least) continue;
        arc.push({ p, rel, room });
      }
      if (arc.length === 0) continue;
      arc.sort((a, b) => a.rel - b.rel);
      if (!book) {
        // 책이 들어갈 만한 자리가 있는 가장 안쪽 고리에서, 조각의 한가운데에 가장 가까운 자리가 책이다
        const fits = arc.filter((s) => s.room >= clears[0]!);
        if (fits.length) book = fits.reduce((best, s) => (Math.abs(s.rel - span / 2) < Math.abs(best.rel - span / 2) ? s : best)).p;
        continue;
      }
      arcs.push(arc);
    }
    if (!book) return null;

    // 고리를 하나씩 바깥으로 옮겨 가며 갈지자로 잇는다. 고리마다 어느 쪽 끝에서 시작할지는,
    // 고리에서 고리로 건너가는 거리를 모두 더한 값이 가장 작아지게 정한다.
    let left = clears.length - 1;
    let used = 0;
    while (used < arcs.length && left > 0) left -= arcs[used++]!.length;
    const gapTo = (from: Point, to: Point): number => Math.hypot(to.x - from.x, to.y - from.y);
    const ends = arcs.map((arc) => [arc[0]!.p, arc[arc.length - 1]!.p] as const);
    // cost[i][o] = i번째 고리를 o 방향(0 = 시계 방향, 1 = 반대)으로 돌 때, 거기까지 건너간 거리의 합
    const cost: number[][] = [];
    const came: number[][] = [];
    for (let i = 0; i < used; i++) {
      cost.push([0, 0]);
      came.push([0, 0]);
      for (let o = 0; o < 2; o++) {
        const first = ends[i]![o]!;
        if (i === 0) {
          // 책에서 첫 챕터로 가는 줄은 짧은 쪽을 더 쳐 준다
          cost[i]![o] = gapTo(book, first) * 2;
          continue;
        }
        let bestCost = Infinity;
        for (let prev = 0; prev < 2; prev++) {
          const c = cost[i - 1]![prev]! + gapTo(ends[i - 1]![1 - prev]!, first);
          if (c < bestCost) {
            bestCost = c;
            came[i]![o] = prev;
          }
        }
        cost[i]![o] = bestCost;
      }
    }
    const turnOf: number[] = [];
    for (let i = used - 1, o = used > 0 && cost[i]![1]! < cost[i]![0]! ? 1 : 0; i >= 0; o = came[i]![o]!, i--) turnOf[i] = o;

    // 자리의 여유가 지금 놓을 챕터에 모자라면 그 자리는 비워 두고 넘어간다.
    const spots: Point[] = [{ x: book.x, y: book.y }];
    let last: Point = book;
    arcs.forEach((arc, n) => {
      if (spots.length >= clears.length) return;
      // 미리 정해 두지 않은 바깥 고리는 지금 끝난 곳에서 가까운 쪽부터 돈다
      const backward = n < used ? turnOf[n] === 1 : gapTo(last, ends[n]![0]) > gapTo(last, ends[n]![1]);
      for (let i = 0; i < arc.length && spots.length < clears.length; i++) {
        const s = arc[backward ? arc.length - 1 - i : i]!;
        if (s.room < clears[spots.length]!) continue;
        spots.push({ x: s.p.x, y: s.p.y });
        last = s.p;
      }
    });
    return spots.length >= clears.length ? spots : null;
  };

  /** 조각들이 시작하는 각도. 첫 책은 12시의 왼쪽에서 끝나고, 그 뒤로 시계 방향으로 돈다. */
  const startsOf = (spans: number[]): number[] => {
    const starts: number[] = [];
    let at = -spans[0]!;
    for (const s of spans) {
      starts.push(at);
      at += s;
    }
    return starts;
  };

  /** 이 조각에 이 책이 들어가는 가장 작은 다각형 반지름 */
  const smallest = (need: PieNeed, start: number, span: number): number => {
    let hi = need.step * 3;
    while (!fill(need, start, span, hi)) {
      hi *= 1.4;
      if (hi > 1e6) return hi;
    }
    let lo = hi / 1.4;
    while (hi - lo > 3) {
      const mid = (lo + hi) / 2;
      if (fill(need, start, span, mid)) hi = mid;
      else lo = mid;
    }
    return hi;
  };

  /** 조각의 각도가 spans 일 때 모든 책이 들어가는 다각형 반지름과, 책마다 필요한 반지름 */
  const solve = (spans: number[]): { R: number; each: number[]; spans: number[] } => {
    const starts = startsOf(spans);
    const each = needs.map((need, i) => smallest(need, starts[i]!, spans[i]!));
    let R = Math.max(...each);
    // 격자에 맞물리는 사정으로 조금 더 큰 반지름에서 오히려 안 들어가는 책이 있을 수 있다
    for (let tries = 0; tries < 2000 && needs.some((need, i) => !fill(need, starts[i]!, spans[i]!, R)); tries++) R = R * 1.005 + 2;
    return { R, each, spans };
  };
  const normalized = (raw: number[]): number[] => {
    const floor = Math.min(8, 180 / n);
    let spans = raw.map((s) => Math.max(s, 1e-6));
    // 가장 좁은 조각도 floor 도는 되게 한다
    for (let pass = 0; pass < 4; pass++) {
      const total = spans.reduce((a, b) => a + b, 0);
      spans = spans.map((s) => Math.max((s / total) * 360, floor));
    }
    const total = spans.reduce((a, b) => a + b, 0);
    return spans.map((s) => (s / total) * 360);
  };

  // 책이 차지할 넓이에 비례하는 각도에서 시작해, 여유가 있는 책의 조각을 좁히고 빠듯한 책의 조각을 넓혀 간다
  const even = solve(needs.map(() => 360 / n));
  let best = even;
  if (n > 1) {
    let cur = solve(normalized(needs.map((need) => need.clears.length * need.step * need.step)));
    if (cur.R < best.R) best = cur;
    // 책이 많으면 한 번 풀 때마다 오래 걸리므로 횟수를 줄인다
    const rounds = Math.max(8, Math.min(24, Math.round(160 / n)));
    for (let round = 0; round < rounds; round++) {
      cur = solve(normalized(cur.spans.map((s, i) => s * (cur.each[i]! / cur.R) ** 1.5)));
      if (cur.R < best.R) best = cur;
    }
    // 똑같이 나눠도 거의 같은 크기면 똑같이 나눈다
    if (even.R <= best.R * 1.1) best = even;
  }

  const { R, spans } = best;
  const starts = startsOf(spans);
  const outline = Array.from({ length: sides }, (_, j) => {
    const d = dir(turn + (360 * j) / sides);
    return { x: d.x * R, y: d.y * R };
  });
  const apothem = R * cosHalf;
  /** p 에서 d 방향으로 나아가 다각형의 테두리에 닿는 점 */
  const exit = (p: Point, d: Point): Point => {
    let t = Infinity;
    for (const m of normals) {
      const along = d.x * m.x + d.y * m.y;
      if (along > 1e-9) t = Math.min(t, (apothem - (p.x * m.x + p.y * m.y)) / along);
    }
    return { x: p.x + d.x * t, y: p.y + d.y * t };
  };
  const half = opt.gap / 2;
  const r0 = opt.hubRadius;

  const books = needs.map((need, i): PieBook => {
    const start = starts[i]!;
    const span = spans[i]!;
    const end = start + span;
    // 두 경계선을 조각 안쪽으로 틈의 절반만큼 민 선
    const a = dir(start);
    const b = dir(end);
    const na = dir(start + 90);
    const nb = dir(end - 90);
    const cell: Point[] = [];
    const lift = Math.asin(Math.min(1, half / r0)) / RAD; // 반지름 r0 에서 민 선이 경계선과 벌어진 각도
    const reach = Math.sqrt(Math.max(0, r0 * r0 - half * half));
    const pointed = span < 180 && half / Math.sin((span / 2) * RAD) >= r0;
    let fromA: Point;
    let fromB: Point;
    if (pointed) {
      // 조각이 좁아서 두 선이 가운데 표시 바깥에서 만난다
      const d = dir(start + span / 2);
      const far = half / Math.sin((span / 2) * RAD);
      fromA = fromB = { x: d.x * far, y: d.y * far };
      cell.push(fromA);
    } else {
      fromA = { x: a.x * reach + na.x * half, y: a.y * reach + na.y * half };
      fromB = { x: b.x * reach + nb.x * half, y: b.y * reach + nb.y * half };
      cell.push(fromA);
    }
    const outA = exit(fromA, a);
    const outB = exit(fromB, b);
    cell.push(outA);
    // 두 점 사이에 놓인 다각형의 꼭짓점들
    const relOf = (p: Point): number => mod360(Math.atan2(p.x, -p.y) / RAD - start);
    const lo = relOf(outA);
    const hi = relOf(outB);
    outline
      .map((v) => ({ v, rel: relOf(v) }))
      .filter((c) => c.rel > lo && c.rel < hi)
      .sort((p, q) => p.rel - q.rel)
      .forEach((c) => cell.push(c.v));
    cell.push(outB);
    if (!pointed) {
      cell.push(fromB);
      // 가운데 표시 둘레를 따라 돌아온다
      const arcFrom = end - lift;
      const arcTo = start + lift;
      const pieces = Math.max(1, Math.ceil((arcFrom - arcTo) / 12));
      for (let s = 1; s < pieces; s++) {
        const d = dir(arcFrom + ((arcTo - arcFrom) * s) / pieces);
        cell.push({ x: d.x * r0, y: d.y * r0 });
      }
    }
    return { cell, spots: fill(need, start, span, R) ?? [] };
  });

  return { outline, books };
}
