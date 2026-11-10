/**
 * 거미줄 보기의 배치 규칙.
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
