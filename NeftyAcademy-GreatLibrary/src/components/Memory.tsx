/**
 * 메모리 칸을 나란히 그린다. 포인터가 어디를 가리키는지 화살표로 보여 준다.
 *
 *   <Memory cells={[
 *     { addr: '0x1000', name: 'x', value: '42' },
 *     { addr: '0x1008', name: 'p', value: '0x1000', to: '0x1000' },
 *   ]} />
 *
 * to 에 다른 칸의 addr 를 적으면 그 칸으로 화살표가 간다.
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

const W = 104;
const H = 46;
const TOP = 54;

export function Memory({ cells }: { cells: Cell[] }) {
  const width = cells.length * W + 16;
  const x = (i: number) => 8 + i * W;
  const index = (addr: string) => cells.findIndex((c) => c.addr === addr);
  return (
    <svg className="mem" viewBox={`0 0 ${width} ${TOP + H + 30}`} style={{ maxWidth: width }} role="img">
      <defs>
        <marker id="mem-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="mem-arrow-head" />
        </marker>
      </defs>
      {cells.map((c, i) => (
        <g key={c.addr} className={`mem-cell${c.dim ? ' is-dim' : ''}${c.mark ? ' is-mark' : ''}`}>
          <rect x={x(i) + 3} y={TOP} width={W - 6} height={H} rx="7" />
          {c.name ? (
            <text x={x(i) + W / 2} y={TOP - 8} className="mem-name">
              {c.name}
            </text>
          ) : null}
          <text x={x(i) + W / 2} y={TOP + H / 2 + 6} className="mem-value">
            {c.value}
          </text>
          <text x={x(i) + W / 2} y={TOP + H + 18} className="mem-addr">
            {c.addr}
          </text>
        </g>
      ))}
      {cells.map((c, i) => {
        if (!c.to) return null;
        const j = index(c.to);
        if (j < 0) return null;
        const from = x(i) + W / 2;
        const to = x(j) + W / 2 + (j < i ? 14 : -14);
        const lift = Math.min(30, 14 + Math.abs(i - j) * 6);
        return <path key={`a${c.addr}`} className="mem-arrow" d={`M${from} ${TOP - 22} C${from} ${TOP - 22 - lift}, ${to} ${TOP - 22 - lift}, ${to} ${TOP - 22}`} markerEnd="url(#mem-arrow)" />;
      })}
    </svg>
  );
}
