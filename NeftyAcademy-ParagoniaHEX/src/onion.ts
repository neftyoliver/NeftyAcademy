/**
 * 책 여러 권(두 권 이상)을 한 장의 지도에 놓는 규칙.
 *
 *  - 지도 전체는 언제나 육각형이다. 가운데를 둘러싼 육각형 고리(거미줄)의 자리마다 노드가 하나씩 놓이고,
 *    자리 사이의 간격은 어느 책에서나 같다.
 *  - 책은 양파 껍질처럼 겹겹이 놓인다. 한 겹에 여섯 권 안팎(다섯~일곱 권)이고, 겹과 겹의 경계는 온전한 육각형 고리다.
 *    책이 11권이면 두 겹(5 + 6), 19권이면 세 겹이 된다. 겹을 어떻게 나누면 육각형이 가장 작아지는지 따져서 고른다.
 *  - 한 겹 안에서는 12시에서 시작해 시계 방향으로, 책의 크기만큼 자리를 차례로 나눠 가진다.
 *    여섯 권의 크기가 같으면 저마다 육각형의 한 변을 낀 삼각형이 되고, 크기가 다르면 큰 책이 모서리를 더 가져간다.
 *  - 겹을 온전한 고리로 맞추느라 남는 자리는 작은 책부터 채워 준다. 그래서 작은 책들의 크기가 서로 비슷해진다.
 *  - 책 안에서는 고리를 하나씩 바깥으로 옮겨 가며 갈지자로 잇는다. 첫 자리가 책이고, 그다음이 챕터 순서대로다.
 *
 * 자리를 먼저 정하고, 책의 영역은 그 자리들을 감싸는 다각형으로 나중에 그린다.
 * 영역의 변은 모두 격자의 세 방향 가운데 하나를 따르는 곧은 선이고, 영역 사이의 틈은 어디서나 같다.
 * 책의 모양은 정해져 있지 않다. 책을 더하거나 빼면 겹과 자리가 다시 계산된다.
 */
import type { Point } from './layout';

export interface OnionOptions {
  /** 자리 사이의 간격 */
  step: number;
  /** 육각형 고리를 돌리는 각도(도). 0 = 12시, 시계 방향 */
  rotate: number;
  /** 영역과 영역 사이의 틈 */
  gap: number;
}

export interface OnionBook {
  /** 자리들. 첫 자리가 책이고, 그다음이 챕터 순서대로다 */
  spots: Point[];
  /** 이 책의 영역. 보통 하나의 다각형이지만, 드물게 여러 조각일 수 있다 */
  region: Point[][];
  /** 몇 번째 겹인가(0 = 가장 안쪽) */
  layer: number;
}

export interface Onion {
  /** 지도 전체를 감싸는 육각형의 꼭짓점들 */
  outline: Point[];
  books: OnionBook[];
}

/** 격자의 여섯 방향(시계 방향). 자리의 좌표는 두 축 (a, b) 로 적는다. */
const DIRS: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [1, -1],
];
type Cell = readonly [number, number];
const keyOf = (a: number, b: number): string => `${a},${b}`;

/** k번째 고리의 j번째 자리(시계 방향, 0번이 첫 모서리) */
function ringCell(k: number, j: number): Cell {
  const i = ((j % (6 * k)) + 6 * k) % (6 * k);
  const side = Math.floor(i / k);
  const t = i % k;
  const corner = DIRS[side]!;
  const along = DIRS[(side + 2) % 6]!;
  return [k * corner[0] + t * along[0], k * corner[1] + t * along[1]];
}

/** n 을 parts 개의 수로 나누는 방법들. 수마다 lo 이상 hi 이하. */
function compositions(n: number, parts: number, lo: number, hi: number): number[][] {
  if (parts === 1) return n >= lo && n <= hi ? [[n]] : [];
  const out: number[][] = [];
  for (let first = lo; first <= hi; first++) for (const rest of compositions(n - first, parts - 1, lo, hi)) out.push([first, ...rest]);
  return out;
}

/** 남는 자리 spare 개를 작은 것부터 채워, 작은 것들의 크기를 맞춘다. */
function levelUp(sizes: number[], spare: number): number[] {
  const out = [...sizes];
  while (spare > 0) {
    const low = Math.min(...out);
    const lows = out.map((v, i) => (v === low ? i : -1)).filter((i) => i >= 0);
    const next = Math.min(...out.filter((v) => v > low), Infinity);
    const each = Math.min(next - low, Math.floor(spare / lows.length));
    if (each >= 1) {
      for (const i of lows) out[i]! += each;
      spare -= each * lows.length;
    } else {
      for (const i of lows.slice(0, spare)) out[i]! += 1;
      spare = 0;
    }
  }
  return out;
}

export function layoutOnion(sizes: number[], opt: OnionOptions): Onion {
  const n = sizes.length;
  const t1 = (opt.rotate * Math.PI) / 180;
  const t2 = ((opt.rotate + 60) * Math.PI) / 180;
  const u1 = { x: Math.sin(t1), y: -Math.cos(t1) };
  const u2 = { x: Math.sin(t2), y: -Math.cos(t2) };
  /** 격자 좌표 → 지도 좌표. scale = 한 칸의 길이 */
  const at = (a: number, b: number, scale: number): Point => ({ x: scale * (a * u1.x + b * u2.x), y: scale * (a * u1.y + b * u2.y) });

  // 1. 겹 나누기: 한 겹에 여섯 권 안팎. 육각형이 가장 작아지고, 남는 자리가 고르게 적은 나눔을 고른다.
  const layers = Math.max(1, Math.round(n / 6));
  const lo = Math.max(1, Math.floor(n / layers) - 1);
  const hi = Math.ceil(n / layers) + 1;
  interface Plan {
    /** 겹마다: 책 번호들, 고리의 범위, 그 고리들의 자리 수 */
    groups: { books: number[]; from: number; to: number; room: number; need: number }[];
    rings: number;
    waste: number;
    uneven: number;
  }
  let plan: Plan | null = null;
  for (const counts of compositions(n, layers, lo, hi)) {
    const groups: Plan['groups'] = [];
    let ring = 0;
    let first = 0;
    let waste = 0;
    for (const count of counts) {
      const books = Array.from({ length: count }, (_, i) => first + i);
      first += count;
      const need = books.reduce((sum, b) => sum + sizes[b]!, 0);
      const from = ring + 1;
      let room = 0;
      while (room < need) room += 6 * ++ring;
      groups.push({ books, from, to: ring, room, need });
      waste += (room - need) ** 2;
    }
    const uneven = counts.reduce((sum, c) => sum + Math.abs(c - 6), 0);
    const better = !plan || ring < plan.rings || (ring === plan.rings && (waste < plan.waste || (waste === plan.waste && uneven < plan.uneven)));
    if (better) plan = { groups, rings: ring, waste, uneven };
  }
  const { groups, rings } = plan!;

  // 2. 자리 나누기: 겹마다, 고리마다 책들이 차지할 호를 정한다
  const owner = new Map<string, number>();
  /** 책마다, 안쪽 고리부터 차례로 그 고리에서 차지한 자리들(시계 방향) */
  const arcsOf: Cell[][][] = sizes.map(() => []);
  const layerOf: number[] = [];
  groups.forEach((group, layer) => {
    const padded = levelUp(group.books.map((b) => sizes[b]!), group.room - group.need);
    const ks = Array.from({ length: group.to - group.from + 1 }, (_, i) => group.from + i);
    // 고리마다 지금까지 나눠 준 곳(그 겹이 시작하는 선에서 시계 방향으로 센 자리 수).
    // 첫 책은 12시 쪽 변에서 시작한다(다섯 번째 모서리).
    let prev = ks.map(() => 0);
    let given = 0;
    /**
     * 경계선 from 과 to 사이의 자리들이 한 덩어리로 이어지는가.
     * 고리 k 의 자리 r(그 변의 t번째)의 바깥 이웃은 고리 k+1 의 r + (변 번호), r + (변 번호) + 1 이다(모서리 자리는 하나 더).
     */
    const joined = (from: number[], to: number[]): boolean => {
      let last = -1;
      for (let r = 0; r < ks.length; r++) {
        if (to[r]! <= from[r]!) continue;
        if (last >= 0) {
          if (last !== r - 1) return false; // 빈 고리가 가운데에 끼었다
          const k = ks[last]!;
          const a = from[last]!;
          const b = to[last]! - 1;
          const low = a + Math.floor(a / k) - (a % k === 0 ? 1 : 0);
          const high = b + Math.floor(b / k) + 1;
          if (low > to[r]! - 1 || high < from[r]!) return false;
        }
        last = r;
      }
      return true;
    };
    group.books.forEach((book, i) => {
      layerOf[book] = layer;
      given += padded[i]!;
      let next = ks.map((k) => 6 * k);
      if (i < group.books.length - 1) {
        // 이 책과 다음 책 사이의 경계선을 긋는다. 가운데에서 곧게 뻗은 선(ideal)에 가장 가까우면서,
        // 자리 수가 정확히 맞고, 이 책의 자리들이 한 덩어리로 이어지는 선을 고른다.
        const ideal = ks.map((k) => (given / group.room) * 6 * k);
        const end = ks.map((k) => 6 * k);
        const lastCut = i === group.books.length - 2;
        let best: number[] | null = null;
        let bestErr = Infinity;
        const line: number[] = [];
        const walk = (r: number, sum: number, err: number): void => {
          if (r === ks.length) {
            if (sum !== given || !joined(prev, line) || (lastCut && !joined(line, end))) return;
            best = [...line];
            bestErr = err;
            return;
          }
          const base = Math.floor(ideal[r]!);
          for (let v = Math.max(prev[r]!, base - 1); v <= Math.min(6 * ks[r]!, base + 2); v++) {
            const e = err + (v - ideal[r]!) ** 2;
            if (sum + v > given || e >= bestErr) continue;
            line[r] = v;
            walk(r + 1, sum + v, e);
          }
          line.length = r;
        };
        walk(0, 0, 0);
        if (best) {
          next = best;
        } else {
          // 그런 선이 없으면(아주 작은 책이 여럿 몰린 드문 경우) 자리 수만 맞춘다
          const left = ks.map((k, r) => 6 * k - prev[r]!);
          const len = ks.map((_, r) => Math.min(left[r]!, Math.max(0, Math.floor(ideal[r]! + 1e-9) - prev[r]!)));
          let total = len.reduce((x, y) => x + y, 0);
          const lag = (r: number): number => ideal[r]! - (prev[r]! + len[r]!);
          while (total < padded[i]!) {
            let pick = -1;
            for (let r = 0; r < ks.length; r++) if (len[r]! < left[r]! && (pick < 0 || lag(r) > lag(pick))) pick = r;
            len[pick]!++;
            total++;
          }
          while (total > padded[i]!) {
            let pick = -1;
            for (let r = 0; r < ks.length; r++) if (len[r]! > 0 && (pick < 0 || lag(r) < lag(pick))) pick = r;
            len[pick]!--;
            total--;
          }
          next = prev.map((v, r) => v + len[r]!);
        }
      }
      ks.forEach((k, r) => {
        const arc: Cell[] = [];
        for (let j = prev[r]!; j < next[r]!; j++) {
          const cell = ringCell(k, 5 * k + j);
          arc.push(cell);
          owner.set(keyOf(cell[0], cell[1]), book);
        }
        if (arc.length) arcsOf[book]!.push(arc);
      });
      prev = next;
    });
  });

  // 3. 책 안에서 잇기: 고리를 하나씩 바깥으로 옮겨 가며 갈지자로. 고리마다 어느 쪽 끝에서 시작할지는
  //    고리에서 고리로 건너가는 거리를 모두 더한 값이 가장 작아지게 정한다.
  const spotsOf = sizes.map((size, book): Point[] => {
    const arcs = arcsOf[book]!;
    const pos = (c: Cell): Point => at(c[0], c[1], opt.step);
    const gapTo = (p: Cell, q: Cell): number => Math.hypot(pos(q).x - pos(p).x, pos(q).y - pos(p).y);
    const ends = arcs.map((arc) => [arc[0]!, arc[arc.length - 1]!] as const);
    const cost: number[][] = [];
    const came: number[][] = [];
    for (let i = 0; i < arcs.length; i++) {
      cost.push([0, 0]);
      came.push([0, 0]);
      if (i === 0) continue;
      for (let o = 0; o < 2; o++) {
        let best = Infinity;
        for (let before = 0; before < 2; before++) {
          const c = cost[i - 1]![before]! + gapTo(ends[i - 1]![1 - before]!, ends[i]![o]!);
          if (c < best) {
            best = c;
            came[i]![o] = before;
          }
        }
        cost[i]![o] = best;
      }
    }
    const turn: number[] = [];
    for (let i = arcs.length - 1, o = arcs.length > 0 && cost[i]![1]! < cost[i]![0]! ? 1 : 0; i >= 0; o = came[i]![o]!, i--) turn[i] = o;
    const chain = arcs.flatMap((arc, i) => (turn[i] === 1 ? [...arc].reverse() : arc));
    // 남는 자리는 줄의 끝에 비워 둔다
    return chain.slice(0, size).map(pos);
  });

  // 4. 영역 그리기. 자리마다 그 둘레의 작은 육각형(이웃 자리와의 한가운데를 꼭짓점으로 하는)을 주고,
  //    세 자리 사이에 남는 작은 삼각형은 그 셋 가운데 둘 이상이 속한 책에 준다.
  //    그러면 같은 책의 자리들이 나란히 놓인 곳에서는 경계가 곧은 선이 된다.
  //    세 자리의 임자가 모두 다른 삼각형은 한가운데에서 셋으로 갈라 가까운 책에 준다(세 영역이 Y자로 만난다).
  const ownerOf = (c: Cell): number => owner.get(keyOf(c[0], c[1])) ?? -1;
  // 점은 12배로 늘린 격자 좌표로 적는다(자리 사이의 한가운데, 삼각형의 한가운데가 모두 정수가 되게).
  type Node = readonly [number, number];
  const mid = (p: Cell, q: Cell): Node => [6 * (p[0] + q[0]), 6 * (p[1] + q[1])];
  /** 책마다, 영역의 테두리가 될 변들: '시작점' → 끝점들. 같은 책의 조각끼리 맞닿은 변은 서로 지워진다. */
  const edges: Map<string, Set<string>>[] = sizes.map(() => new Map());
  const addPiece = (book: number, piece: Node[]): void => {
    // 도는 방향을 하나로 맞춘다
    let area = 0;
    for (let i = 0; i < piece.length; i++) {
      const p = at(piece[i]![0], piece[i]![1], 1);
      const q = at(piece[(i + 1) % piece.length]![0], piece[(i + 1) % piece.length]![1], 1);
      area += p.x * q.y - q.x * p.y;
    }
    const ordered = area > 0 ? piece : [...piece].reverse();
    const map = edges[book]!;
    for (let i = 0; i < ordered.length; i++) {
      const from = keyOf(ordered[i]![0], ordered[i]![1]);
      const to = keyOf(ordered[(i + 1) % ordered.length]![0], ordered[(i + 1) % ordered.length]![1]);
      if (map.get(to)?.delete(from)) continue; // 이웃 조각과 맞닿은 변
      if (!map.has(from)) map.set(from, new Set());
      map.get(from)!.add(to);
    }
  };
  // 가운데 표시와 지도 바깥의 한 겹까지 훑는다(그 자리를 낀 삼각형이 책의 것일 수 있다)
  for (let k = 0; k <= rings + 1; k++)
    for (let j = 0; j < Math.max(1, 6 * k); j++) {
      const p: Cell = k === 0 ? [0, 0] : ringCell(k, j);
      const mine = ownerOf(p);
      if (mine >= 0) addPiece(mine, DIRS.map((d) => mid(p, [p[0] + d[0], p[1] + d[1]])));
      // 이 자리를 첫 꼭짓점으로 하는 삼각형 둘(격자의 모든 삼각형이 한 번씩 나온다)
      for (let i = 0; i < 2; i++) {
        const corners: Cell[] = [p, [p[0] + DIRS[i]![0], p[1] + DIRS[i]![1]], [p[0] + DIRS[i + 1]![0], p[1] + DIRS[i + 1]![1]]];
        const o = corners.map(ownerOf);
        const major = o[0] === o[1] || o[0] === o[2] ? o[0]! : o[1] === o[2] ? o[1]! : -2;
        if (major !== -2) {
          if (major >= 0) addPiece(major, [mid(corners[0]!, corners[1]!), mid(corners[1]!, corners[2]!), mid(corners[2]!, corners[0]!)]);
          continue;
        }
        const centre: Node = [4 * (corners[0]![0] + corners[1]![0] + corners[2]![0]), 4 * (corners[0]![1] + corners[1]![1] + corners[2]![1])];
        for (let c = 0; c < 3; c++) {
          const x = corners[c]!;
          const y = corners[(c + 1) % 3]!;
          const z = corners[(c + 2) % 3]!;
          if (o[c]! >= 0) {
            addPiece(o[c]!, [mid(x, y), mid(x, z), centre]);
          } else {
            // 책이 아닌 곳(가운데 표시, 지도 바깥)과 맞닿은 몫은 두 책이 반씩 가진다. 경계가 테두리에 곧게 닿는다.
            const foot: Node = [12 * x[0] + 3 * (y[0] - x[0] + z[0] - x[0]), 12 * x[1] + 3 * (y[1] - x[1] + z[1] - x[1])];
            addPiece(o[(c + 1) % 3]!, [mid(x, y), foot, centre]);
            addPiece(o[(c + 2) % 3]!, [foot, mid(x, z), centre]);
          }
        }
      }
    }

  const unit = opt.step / 12;
  const regionOf = (book: number): Point[][] => {
    const map = edges[book]!;
    const loops: Point[][] = [];
    const parse = (key: string): [number, number] => key.split(',').map(Number) as [number, number];
    const where = (key: string): Point => at(parse(key)[0], parse(key)[1], unit);
    for (;;) {
      let first: string | undefined;
      for (const [from, tos] of map)
        if (tos.size) {
          first = from;
          break;
        }
      if (first === undefined) break;
      const loop: Point[] = [];
      let from = first;
      let to: string = map.get(from)!.values().next().value!;
      for (let guard = 0; guard < 100000; guard++) {
        map.get(from)!.delete(to);
        loop.push(where(from));
        if (to === first) break; // 한 바퀴 돌았다
        const nexts = [...(map.get(to) ?? [])];
        if (nexts.length === 0) break;
        // 한 점에서 갈림길이면 가장 오른쪽으로 꺾이는 변을 따라간다
        const p0 = where(from);
        const p1 = where(to);
        const heading = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        let pick = nexts[0]!;
        let pickTurn = -Infinity;
        for (const cand of nexts) {
          const p2 = where(cand);
          let turnBy = Math.atan2(p2.y - p1.y, p2.x - p1.x) - heading;
          while (turnBy <= -Math.PI) turnBy += 2 * Math.PI;
          while (turnBy > Math.PI) turnBy -= 2 * Math.PI;
          if (turnBy > pickTurn) {
            pickTurn = turnBy;
            pick = cand;
          }
        }
        from = to;
        to = pick;
      }
      // 한 줄로 이어진 점은 지우고 꺾이는 점만 남긴다
      const corners = loop.filter((p, i) => {
        const q = loop[(i + loop.length - 1) % loop.length]!;
        const r = loop[(i + 1) % loop.length]!;
        return Math.abs((p.x - q.x) * (r.y - p.y) - (p.y - q.y) * (r.x - p.x)) > 1e-6;
      });
      if (corners.length >= 3) loops.push(inset(corners, opt.gap / 2));
    }
    return loops;
  };

  const outline = DIRS.map((d) => at(d[0], d[1], (rings + 0.5) * opt.step));
  return { outline, books: sizes.map((_, book) => ({ spots: spotsOf[book]!, region: regionOf(book), layer: layerOf[book]! })) };
}

/** 다각형의 변을 모두 안쪽으로 d 만큼 민다. */
function inset(poly: Point[], d: number): Point[] {
  const m = poly.length;
  let area = 0;
  for (let i = 0; i < m; i++) {
    const p = poly[i]!;
    const q = poly[(i + 1) % m]!;
    area += p.x * q.y - q.x * p.y;
  }
  const sign = area > 0 ? 1 : -1; // 도는 방향에 따라 안쪽이 어느 쪽인지가 달라진다
  // 변마다: 안쪽으로 민 선의 한 점과 방향
  const lines = poly.map((p, i) => {
    const q = poly[(i + 1) % m]!;
    const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const dx = (q.x - p.x) / len;
    const dy = (q.y - p.y) / len;
    return { x: p.x - dy * d * sign, y: p.y + dx * d * sign, dx, dy };
  });
  return poly.map((_, i) => {
    const a = lines[(i + m - 1) % m]!;
    const b = lines[i]!;
    const det = a.dx * b.dy - a.dy * b.dx;
    if (Math.abs(det) < 1e-9) return { x: b.x, y: b.y };
    const t = ((b.x - a.x) * b.dy - (b.y - a.y) * b.dx) / det;
    return { x: a.x + a.dx * t, y: a.y + a.dy * t };
  });
}
