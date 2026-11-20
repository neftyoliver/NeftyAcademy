/**
 * 메모리 칸을 나란히 그린다. 포인터가 어디를 가리키는지 화살표로 보여 준다.
 *
 *   <Memory cells={[
 *     { addr: '0x1000', name: 'x', value: '42' },
 *     { addr: '0x1008', name: 'p', value: '0x1000', to: '0x1000' },
 *   ]} />
 *
 * to 에 다른 칸의 addr 를 적으면 그 칸으로 화살표가 간다.
 *
 * 화살표는 칸 위로 곧게 올라가서, 가로로 건너가, 곧게 내려온다. 그래서 화살촉은 늘 똑바로 아래를 보고
 * 줄의 끝과 방향이 맞는다. 한 칸에 화살표가 여럿 닿으면 닿는 자리를 옆으로 나누고,
 * 가로 구간이 겹치는 화살표는 높이를 달리해서 서로 겹치지 않게 한다.
 */
export interface Cell {
  addr: string;
  name?: string;
  value: string;
  /** 이 칸이 가리키는 칸의 addr */
  to?: string;
  /** 흐리게 (해제된 메모리, 안 쓰는 칸) */
  dim?: boolean;
  /** 강조 */
  mark?: boolean;
}

const W = 104; // 칸 하나의 폭(틈 포함)
const H = 46;
const PAD = 8;
const NAME_H = 26; // 이름표가 차지하는 높이
const PORT_GAP = 22; // 한 칸에 화살표가 여럿 닿을 때 그 사이
const LEVEL_H = 11; // 겹치는 화살표끼리의 높이 차
const RISE = 26; // 화살표가 칸 위로 올라가는 최소 높이(화살촉 길이 포함)
const HEAD = 9; // 화살촉 길이
const HEAD_W = 5; // 화살촉 반폭

interface Arrow {
  from: number;
  to: number;
  /** 줄이 떠나는 x, 닿는 x */
  sx: number;
  tx: number;
  level: number;
}

function arrowsOf(cells: Cell[], centre: (i: number) => number): Arrow[] {
  const list: Arrow[] = [];
  cells.forEach((c, i) => {
    if (!c.to) return;
    const j = cells.findIndex((o) => o.addr === c.to);
    if (j >= 0 && j !== i) list.push({ from: i, to: j, sx: 0, tx: 0, level: 0 });
  });

  // 칸마다 닿는 화살표들을 "반대쪽 끝이 어디 있나" 순서로 늘어놓아 자리를 나눈다. 하나뿐이면 한가운데.
  cells.forEach((_, i) => {
    const ends = list.flatMap((a) => (a.from === i ? [{ a, other: a.to, out: true }] : a.to === i ? [{ a, other: a.from, out: false }] : []));
    ends.sort((p, q) => p.other - q.other);
    ends.forEach((e, k) => {
      const x = centre(i) + (k - (ends.length - 1) / 2) * PORT_GAP;
      if (e.out) e.a.sx = x;
      else e.a.tx = x;
    });
  });

  // 짧은 화살표부터 낮은 높이에. 가로 구간이 겹치면 한 단 위로.
  const placed: Arrow[] = [];
  for (const a of [...list].sort((p, q) => Math.abs(p.sx - p.tx) - Math.abs(q.sx - q.tx))) {
    const lo = Math.min(a.sx, a.tx);
    const hi = Math.max(a.sx, a.tx);
    let level = 0;
    while (placed.some((b) => b.level === level && Math.min(b.sx, b.tx) < hi + 6 && Math.max(b.sx, b.tx) > lo - 6)) level++;
    a.level = level;
    placed.push(a);
  }
  return list;
}

export function Memory({ cells }: { cells: Cell[] }) {
  const width = cells.length * W + PAD * 2;
  const x = (i: number) => PAD + i * W;
  const centre = (i: number) => x(i) + W / 2;
  const arrows = arrowsOf(cells, centre);
  const levels = arrows.reduce((m, a) => Math.max(m, a.level), 0);
  const nameH = cells.some((c) => c.name) ? NAME_H : 0;
  const arrowH = arrows.length ? RISE + levels * LEVEL_H : 0;
  const top = PAD + arrowH + nameH + (nameH || arrowH ? 0 : 2); // 칸의 윗변
  const tip = top - nameH - 3; // 화살촉의 끝: 이름표 바로 위(이름표가 없으면 칸 바로 위)

  return (
    <svg className="mem" viewBox={`0 0 ${width} ${top + H + 30}`} style={{ maxWidth: width }} role="img">
      {cells.map((c, i) => (
        <g key={c.addr} className={`mem-cell${c.dim ? ' is-dim' : ''}${c.mark ? ' is-mark' : ''}`}>
          <rect x={x(i) + 3} y={top} width={W - 6} height={H} rx="7" />
          {c.name ? (
            <text x={centre(i)} y={top - 9} className="mem-name">
              {c.name}
            </text>
          ) : null}
          <text x={centre(i)} y={top + H / 2 + 5} className="mem-value">
            {c.value}
          </text>
          <text x={centre(i)} y={top + H + 18} className="mem-addr">
            {c.addr}
          </text>
        </g>
      ))}
      {arrows.map((a) => {
        const y = tip - RISE - a.level * LEVEL_H + 2; // 가로 구간의 높이
        const dir = a.tx > a.sx ? 1 : -1;
        const r = Math.min(8, Math.abs(a.tx - a.sx) / 2);
        const d = [
          `M${a.sx} ${tip - 2}`,
          `V${y + r}`,
          `Q${a.sx} ${y} ${a.sx + dir * r} ${y}`,
          `H${a.tx - dir * r}`,
          `Q${a.tx} ${y} ${a.tx} ${y + r}`,
          `V${tip - HEAD + 1}`,
        ].join(' ');
        return (
          <g key={`${a.from}-${a.to}`} className="mem-arrow">
            <path d={d} />
            <circle cx={a.sx} cy={tip - 2} r="2.6" />
            <path className="mem-arrow-head" d={`M${a.tx} ${tip} L${a.tx - HEAD_W} ${tip - HEAD} L${a.tx + HEAD_W} ${tip - HEAD} z`} />
          </g>
        );
      })}
    </svg>
  );
}
