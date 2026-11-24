/**
 * 지도 보기의 배치 규칙.
 *
 *  지금 지도는 아래쪽의 육각형 규칙(hexSpiral)을 쓴다: 책 한 권을 볼 때의 챕터, 그리고 챕터 둘레의 하위 챕터.
 *  책이 여러 권일 때 책들을 놓는 규칙은 onion.ts 에 있다.
 *  ringAngles·ringPositions 는 예전의 둥근 거미줄 규칙이고, 밖에서 쓰는 곳이 있을 수 있어 남겨 둔다.
 *
 *  - 노드가 5개 이상이면 정n각형의 꼭짓점에 놓는다(첫 노드는 12시 방향, 시계 방향).
 *  - 5개 미만이면 십자가(위·오른쪽·아래·왼쪽) 자리에 차례로 놓는다.
 *    1개 → 위,  2개 → 위·아래가 아니라 왼쪽·오른쪽(가로 화면을 넓게 쓰려고), 3개 → 위·오른쪽·왼쪽, 4개 → 십자가 전부.
 */
export interface Point {
  x: number;
  y: number;
}

const CROSS: Record<number, number[]> = {
  // 각도(도). 0 = 12시, 시계 방향
  1: [0],
  2: [270, 90],
  3: [0, 90, 270],
  4: [0, 90, 180, 270],
};

export function ringAngles(n: number): number[] {
  if (n <= 0) return [];
  const cross = CROSS[n];
  if (cross) return cross;
  return Array.from({ length: n }, (_, i) => (360 / n) * i);
}

/** rotate(도)만큼 전체를 시계 방향으로 돌린다. */
export function ringPositions(n: number, cx: number, cy: number, r: number, rotate = 0): Point[] {
  return ringAngles(n).map((deg) => {
    const t = ((deg + rotate) * Math.PI) / 180;
    return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
  });
}

/** 정n각형에서 이웃한 두 꼭짓점 사이 거리. 위성(챕터) 고리가 서로 겹치지 않게 반지름을 정할 때 쓴다. */
export function neighbourGap(n: number, r: number): number {
  if (n <= 1) return Infinity;
  if (n < 5) return n === 2 ? 2 * r : Math.SQRT2 * r;
  return 2 * r * Math.sin(Math.PI / n);
}

/** 육각형 고리 위의 한 점. ring 은 몇 번째 고리(1부터), last 는 그 고리의 마지막 자리인지. */
export interface HexPoint extends Point {
  ring: number;
  /** 고리 안에서의 순서(0부터) */
  index: number;
}

/** k번째 고리에는 자리가 6k개 있다: 꼭짓점 6개와, 변마다 k-1개의 사이 점. */
export const hexRingSize = (k: number): number => 6 * k;

/** n개를 놓으려면 고리가 몇 겹 필요한가 (6 + 12 + 18 + …) */
export function hexRingsFor(n: number): number {
  let rings = 0;
  for (let left = n; left > 0; left -= hexRingSize(rings)) rings++;
  return rings;
}

/**
 * 육각형을 그려 가며 n개의 자리를 정한다.
 * 가운데(cx, cy)를 둘러싼 첫 고리에 6개, 다음 고리에 12개, 그다음 18개… 순서로 채운다.
 * 각 고리는 12시 방향 꼭짓점에서 시작해 시계 방향으로 돈다. step = 이웃한 자리 사이의 거리.
 * rotate(도)만큼 전체를 시계 방향으로 돌린다.
 */
export function hexSpiral(n: number, cx: number, cy: number, step: number, rotate = 0): HexPoint[] {
  const out: HexPoint[] = [];
  const corner = (k: number, side: number): Point => {
    const t = ((60 * side + rotate) * Math.PI) / 180;
    return { x: cx + k * step * Math.sin(t), y: cy - k * step * Math.cos(t) };
  };
  for (let k = 1; out.length < n; k++) {
    for (let i = 0; i < hexRingSize(k) && out.length < n; i++) {
      const side = Math.floor(i / k);
      const t = (i % k) / k;
      const a = corner(k, side);
      const b = corner(k, side + 1);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, ring: k, index: i });
    }
  }
  return out;
}

/**
 * hexSpiral 로 놓은 점들을 잇는 선(SVG path 의 d). 고리마다 육각형을 그리고, 다 찬 고리는 닫는다.
 * 고리와 고리 사이는 앞 고리의 마지막 점에서 다음 고리의 첫 점으로 잇는다.
 */
export function hexOutline(points: HexPoint[]): string {
  let d = '';
  points.forEach((p, i) => {
    const prev = points[i - 1];
    d += `${!prev ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    const next = points[i + 1];
    const ringEnds = !next || next.ring !== p.ring;
    if (ringEnds && p.index === hexRingSize(p.ring) - 1) {
      // 고리가 다 찼다: 그 고리의 첫 점으로 돌아가 닫는다
      const first = points[i - p.index]!;
      d += `L${first.x.toFixed(1)} ${first.y.toFixed(1)} `;
      if (next) d += `M${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    }
  });
  return d.trim();
}
