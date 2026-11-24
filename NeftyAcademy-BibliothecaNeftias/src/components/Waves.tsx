/** 전자공학 입문 1.2 그림: 함수 발생기의 세 파형과 진폭·Vpp·주기·오프셋. 버튼으로 파형과 오프셋을 바꾼다. */
import { useState } from 'react';

const KINDS = {
  sine: { name: '사인파', f: (t: number) => Math.sin(2 * Math.PI * t) },
  square: { name: '네모파', f: (t: number) => (t % 1 < 0.5 ? 1 : -1) },
  triangle: { name: '세모파', f: (t: number) => { const u = t % 1; return u < 0.5 ? 4 * u - 1 : 3 - 4 * u; } },
} as const;

type Kind = keyof typeof KINDS;

export function Waves() {
  const [kind, setKind] = useState<Kind>('sine');
  const [offset, setOffset] = useState(0);
  const W = 420;
  const H = 220;
  const mid = H / 2;
  const S = 60; // 1V = 60px
  const left = 46;
  const per = 160; // 한 주기 = 160px
  const f = KINDS[kind].f;
  let d = '';
  for (let x = 0; x <= W - left - 76; x++) {
    const v = f(x / per) + offset;
    d += `${x === 0 ? 'M' : 'L'}${left + x} ${mid - v * S}`;
  }
  const yv = (v: number) => mid - v * S;
  const btn = (on: boolean) => ({
    padding: '4px 10px', margin: '0 4px', borderRadius: 8, border: '1px solid currentColor',
    background: on ? 'var(--node, #e80)' : 'transparent', color: on ? '#fff' : 'inherit', cursor: 'pointer',
  });
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        {(Object.keys(KINDS) as Kind[]).map((k) => (
          <button key={k} type="button" style={btn(k === kind)} onClick={() => setKind(k)}>{KINDS[k].name}</button>
        ))}
        <button type="button" style={btn(offset !== 0)} onClick={() => setOffset(offset ? 0 : 0.5)}>오프셋 {offset ? '+0.5V' : '0V'}</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} role="img" aria-label={`${KINDS[kind].name}, 진폭 1V`}>
        <g stroke="currentColor" strokeWidth={1} opacity={0.35}>
          <line x1={left} y1={yv(0)} x2={W - 6} y2={yv(0)} />
          <line x1={left} y1={10} x2={left} y2={H - 10} />
        </g>
        <g stroke="currentColor" strokeDasharray="4 4" opacity={0.5}>
          <line x1={left} y1={yv(1 + offset)} x2={W - 70} y2={yv(1 + offset)} />
          <line x1={left} y1={yv(-1 + offset)} x2={W - 70} y2={yv(-1 + offset)} />
        </g>
        <path d={d} fill="none" stroke="var(--node, #e80)" strokeWidth={2.5} />
        <g fontSize={12} fill="currentColor">
          <text x={left - 6} y={yv(0)} textAnchor="end" dominantBaseline="central">0V</text>
          <text x={left - 6} y={yv(1 + offset)} textAnchor="end" dominantBaseline="central">{(1 + offset).toFixed(1)}</text>
          <text x={left - 6} y={yv(-1 + offset)} textAnchor="end" dominantBaseline="central">{(-1 + offset).toFixed(1)}</text>
        </g>
        <g stroke="currentColor" fill="currentColor" fontSize={12}>
          <line x1={W - 62} y1={yv(1 + offset)} x2={W - 62} y2={yv(-1 + offset)} />
          <text x={W - 56} y={yv(offset)} textAnchor="start" dominantBaseline="central" stroke="none">Vpp 2V</text>
          <line x1={left} y1={H - 16} x2={left + per} y2={H - 16} />
          <text x={left + per / 2} y={H - 4} textAnchor="middle" stroke="none">한 주기 T</text>
        </g>
      </svg>
    </div>
  );
}
