/**
 * 지도 위의 줄을 육각형 결(60도 간격의 세 방향)에 맞춰 긋기 위한 길 찾기.
 *
 *  지도의 모든 노드는 한 장의 삼각 격자 위에 놓인다(간격 GRID, 방향은 책 육각형과 같다).
 *  노드는 짝수 칸에만 놓이므로, 노드와 노드 사이에는 언제나 빈 격자점이 있다.
 *  줄은 이 격자점만 밟고 지나가고, 노드가 차지한 격자점은 밟지 못한다.
 *  그래서 줄은 육각형 결을 따라 꺾이고, 노드를 뚫지 않는다.
 */
import type { Point } from './layout';

/** 격자점 사이의 거리. 하위 챕터 간격(27)의 절반이다. */
export const GRID = 13.5;

/** 격자의 두 축(60도). 0도 = 12시, 시계 방향. */
export interface HexAxes {
  /** 지도 좌표 → 격자 좌표(소수) */
  toAxial: (p: Point) => { a: number; b: number };
  toPoint: (a: number, b: number) => Point;
  /** 가장 가까운 "노드 자리"(두 좌표가 모두 짝수인 격자점)로 옮긴다 */
  snap: (p: Point) => Point;
}

export function hexAxes(rotate: number): HexAxes {
  const t1 = (rotate * Math.PI) / 180;
  const t2 = ((rotate + 60) * Math.PI) / 180;
  const e1 = { x: GRID * Math.sin(t1), y: -GRID * Math.cos(t1) };
  const e2 = { x: GRID * Math.sin(t2), y: -GRID * Math.cos(t2) };
  const det = e1.x * e2.y - e1.y * e2.x;
  const toAxial = (p: Point) => ({ a: (p.x * e2.y - p.y * e2.x) / det, b: (e1.x * p.y - e1.y * p.x) / det });
  const toPoint = (a: number, b: number): Point => ({ x: a * e1.x + b * e2.x, y: a * e1.y + b * e2.y });
  const snap = (p: Point): Point => {
    const { a, b } = toAxial(p);
    return toPoint(Math.round(a / 2) * 2, Math.round(b / 2) * 2);
  };
  return { toAxial, toPoint, snap };
}

const DIRS: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [1, -1],
];
/** 꺾는 값: 그대로 0, 60도 0.7, 120도 1.6. 되돌아가기는 없다. */
const TURN = [0, 0.7, 1.6];
/** 다른 줄이 이미 지나간 격자점을 또 밟는 값. 줄들이 한 길에 겹치지 않고 옆으로 벌어지게 한다. */
const SHARED = 1.2;
/** 출발지도 도착지도 아닌 책의 영역을 지나가는 값 */
const FOREIGN = 4;

/** 작은 값이 먼저 나오는 더미 */
class Heap {
  private keys: number[] = [];
  private vals: number[] = [];
  get size(): number {
    return this.keys.length;
  }
  push(key: number, val: number): void {
    const { keys, vals } = this;
    let i = keys.length;
    keys.push(key);
    vals.push(val);
    while (i > 0) {
      const up = (i - 1) >> 1;
      if (keys[up]! <= key) break;
      keys[i] = keys[up]!;
      vals[i] = vals[up]!;
      i = up;
    }
    keys[i] = key;
    vals[i] = val;
  }
  pop(): number {
    const { keys, vals } = this;
    const top = vals[0]!;
    const key = keys.pop()!;
    const val = vals.pop()!;
    const n = keys.length;
    if (n > 0) {
      let i = 0;
      for (;;) {
        let child = 2 * i + 1;
        if (child >= n) break;
        if (child + 1 < n && keys[child + 1]! < keys[child]!) child++;
        if (keys[child]! >= key) break;
        keys[i] = keys[child]!;
        vals[i] = vals[child]!;
        i = child;
      }
      keys[i] = key;
      vals[i] = val;
    }
    return top;
  }
}

/** 노드와 책 영역을 올려놓고 길을 찾는 격자 한 장. */
export class HexGrid {
  readonly axes: HexAxes;
  private readonly a0: number;
  private readonly b0: number;
  private readonly w: number;
  private readonly h: number;
  /** 0 = 빈 자리, n > 0 = 노드 n-1 하나가 차지, -1 = 여러 노드가 차지 */
  private readonly blocker: Int32Array;
  /** 이 격자점이 들어 있는 책 영역(번호 + 1). 0 = 어느 영역도 아님 */
  private readonly region: Int16Array;
  private readonly used: Uint8Array;
  private readonly nodes: number[] = [];
  private readonly cost: Float32Array;
  private readonly from: Int32Array;
  private readonly seen: Uint32Array;
  private round = 0;

  /** bounds = 지도에 놓일 것들을 모두 감싸는 점들. 그 둘레로 pad 칸의 여유를 둔다. */
  constructor(rotate: number, bounds: Point[], pad = 6) {
    this.axes = hexAxes(rotate);
    let minA = Infinity, minB = Infinity, maxA = -Infinity, maxB = -Infinity;
    for (const p of bounds) {
      const { a, b } = this.axes.toAxial(p);
      minA = Math.min(minA, a);
      minB = Math.min(minB, b);
      maxA = Math.max(maxA, a);
      maxB = Math.max(maxB, b);
    }
    this.a0 = Math.floor(minA) - pad;
    this.b0 = Math.floor(minB) - pad;
    this.w = Math.ceil(maxA) + pad - this.a0 + 1;
    this.h = Math.ceil(maxB) + pad - this.b0 + 1;
    const size = this.w * this.h;
    this.blocker = new Int32Array(size);
    this.region = new Int16Array(size);
    this.used = new Uint8Array(size);
    this.cost = new Float32Array(size * 7);
    this.from = new Int32Array(size * 7);
    this.seen = new Uint32Array(size * 7);
  }

  private index(a: number, b: number): number {
    const i = a - this.a0;
    const j = b - this.b0;
    return i < 0 || j < 0 || i >= this.w || j >= this.h ? -1 : j * this.w + i;
  }

  /** 노드를 놓는다. clear = 줄이 이 노드의 가운데에 이보다 가까이 오지 못하는 거리. 돌려주는 값이 노드 번호다. */
  addNode(at: Point, clear: number): number {
    const id = this.nodes.length;
    const { a, b } = this.axes.toAxial(at);
    const ca = Math.round(a);
    const cb = Math.round(b);
    this.nodes.push(this.index(ca, cb));
    const reach = Math.ceil(clear / (GRID * 0.866)) + 1;
    const limit = (clear / GRID) ** 2;
    for (let db = -reach; db <= reach; db++)
      for (let da = -reach; da <= reach; da++) {
        if (da * da + db * db + da * db >= limit) continue;
        const v = this.index(ca + da, cb + db);
        if (v < 0) continue;
        this.blocker[v] = this.blocker[v] === 0 ? id + 1 : -1;
      }
    return id;
  }

  /** 책 영역을 올린다. 영역은 가운데 center 에서 normals[k] 방향으로 reach[k] 만큼 떨어진 변 여섯 개로 둘러싸인 볼록 육각형이다. */
  addRegion(book: number, center: Point, normals: Point[], reach: number[]): void {
    const far = Math.max(...reach) * 1.2;
    const c = this.axes.toAxial(center);
    const span = Math.ceil(far / (GRID * 0.866)) + 1;
    for (let db = -span; db <= span; db++)
      for (let da = -span; da <= span; da++) {
        const a = Math.round(c.a) + da;
        const b = Math.round(c.b) + db;
        const v = this.index(a, b);
        if (v < 0) continue;
        const p = this.axes.toPoint(a, b);
        const x = p.x - center.x;
        const y = p.y - center.y;
        if (normals.every((n, k) => x * n.x + y * n.y <= reach[k]!)) this.region[v] = book + 1;
      }
  }

  /**
   * 노드 from 에서 노드 to 까지, 육각형 결을 따라 꺾이는 길. 꺾이는 점만 돌려준다(양 끝은 두 노드의 가운데).
   * home = 지나가도 되는 책 영역들(보통 두 노드가 속한 책). 그 밖의 영역은 되도록 피한다.
   * 길이 없으면 null.
   */
  route(from: number, to: number, home: number[] = []): Point[] | null {
    const start = this.nodes[from]!;
    const goal = this.nodes[to]!;
    if (start < 0 || goal < 0) return null;
    if (start === goal) return [];
    const { w, cost, seen, blocker, region, used } = this;
    const round = ++this.round;
    const ga = goal % w;
    const gb = (goal - ga) / w;
    const guess = (v: number): number => {
      const da = (v % w) - ga;
      const db = ((v - (v % w)) / w) - gb;
      return ((Math.abs(da) + Math.abs(db) + Math.abs(da + db)) / 2) * 1.0005;
    };
    const open = (v: number): boolean => {
      const by = blocker[v]!;
      return by === 0 || by === from + 1 || by === to + 1;
    };
    const heap = new Heap();
    const first = start * 7 + 6;
    cost[first] = 0;
    seen[first] = round;
    this.from[first] = -1;
    heap.push(guess(start), first);
    let end = -1;
    for (let spent = 0; heap.size > 0 && spent < 400000; spent++) {
      const s = heap.pop();
      const v = (s - (s % 7)) / 7;
      if (v === goal) {
        end = s;
        break;
      }
      const dir = s % 7;
      const base = cost[s]!;
      const a = v % w;
      const b = (v - a) / w;
      for (let d = 0; d < 6; d++) {
        let turn = 0;
        if (dir < 6) {
          turn = Math.abs(d - dir);
          if (turn > 3) turn = 6 - turn;
          if (turn === 3) continue;
        }
        const na = a + DIRS[d]![0];
        const nb = b + DIRS[d]![1];
        if (na < 0 || nb < 0 || na >= w || nb >= this.h) continue;
        const nv = nb * w + na;
        if (!open(nv)) continue;
        const r = region[nv]!;
        const c = base + 1 + TURN[turn]! + Math.min(used[nv]!, 2) * SHARED + (r !== 0 && !home.includes(r - 1) ? FOREIGN : 0);
        const ns = nv * 7 + d;
        if (seen[ns] === round && cost[ns]! <= c) continue;
        seen[ns] = round;
        cost[ns] = c;
        this.from[ns] = s;
        heap.push(c + guess(nv), ns);
      }
    }
    if (end < 0) return null;

    // 거슬러 올라가며 꺾이는 점만 남긴다
    const corners: Point[] = [];
    let dirAfter = -1;
    for (let s = end; s >= 0; s = this.from[s]!) {
      const v = (s - (s % 7)) / 7;
      const dir = s % 7;
      if (v !== goal && v !== start) used[v] = Math.min(used[v]! + 1, 250);
      if (v === goal || v === start || dir !== dirAfter) {
        const a = v % w;
        corners.push(this.axes.toPoint(a + this.a0, (v - a) / w + this.b0));
      }
      // 이 점에서 나가는 방향 = 다음 점(거슬러 올라갈 때는 앞서 본 점)으로 들어간 방향
      dirAfter = dir;
    }
    return corners.reverse();
  }
}
