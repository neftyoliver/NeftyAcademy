/** 전자공학 입문 7장 그림: 장을 화살표 격자로 본다. 전하 두 개의 전기장, 또는 종이를 뚫고 나오는 전류의 자기장. */
import { useState, type ReactElement } from 'react';

type Mode = 'dipole' | 'same' | 'wire';

const W = 360;
const H = 240;
const STEP = 24;

function field(mode: Mode, x: number, y: number): [number, number] {
  if (mode === 'wire') {
    // 가운데를 지나 종이 밖으로 나오는 전류: 시계 반대 방향으로 감는 B, 크기 ∝ 1/r
    const dx = x - W / 2;
    const dy = y - H / 2;
    const r2 = dx * dx + dy * dy;
    return [dy / r2, -dx / r2];
  }
  const charges: [number, number, number][] =
    mode === 'dipole' ? [[W / 2 - 70, H / 2, 1], [W / 2 + 70, H / 2, -1]] : [[W / 2 - 70, H / 2, 1], [W / 2 + 70, H / 2, 1]];
  let ex = 0;
  let ey = 0;
  for (const [cx, cy, q] of charges) {
    const dx = x - cx;
    const dy = y - cy;
    const r2 = dx * dx + dy * dy;
    const r3 = r2 * Math.sqrt(r2);
    ex += (q * dx) / r3;
    ey += (q * dy) / r3;
  }
  return [ex, ey];
}

export function FieldView() {
  const [mode, setMode] = useState<Mode>('dipole');
  const arrows: ReactElement[] = [];
  for (let y = STEP / 2; y < H; y += STEP) {
    for (let x = STEP / 2; x < W; x += STEP) {
      const [fx, fy] = field(mode, x, y);
      const mag = Math.hypot(fx, fy);
      if (!isFinite(mag) || mag === 0) continue;
      const near = mode === 'wire' ? Math.hypot(x - W / 2, y - H / 2) < 14 : false;
      if (near) continue;
      const ux = fx / mag;
      const uy = fy / mag;
      // 세기는 밝기로(로그), 길이는 같게
      const strength = Math.min(1, Math.max(0.15, 0.55 + 0.18 * Math.log10(mag * (mode === 'wire' ? 400 : 4000))));
      const L = 9;
      const x1 = x - ux * L;
      const y1 = y - uy * L;
      const x2 = x + ux * L;
      const y2 = y + uy * L;
      arrows.push(
        <g key={`${x}-${y}`} opacity={strength}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
          <path d={`M${x2} ${y2}L${x2 - ux * 5 - uy * 3} ${y2 - uy * 5 + ux * 3}L${x2 - ux * 5 + uy * 3} ${y2 - uy * 5 - ux * 3}Z`} fill="currentColor" />
        </g>,
      );
    }
  }
  const btn = (on: boolean) => ({
    padding: '4px 10px', margin: '0 4px', borderRadius: 8, border: '1px solid currentColor',
    background: on ? 'var(--node, #e80)' : 'transparent', color: on ? '#fff' : 'inherit', cursor: 'pointer',
  });
  const charge = (x: number, sign: string, color: string) => (
    <g>
      <circle cx={x} cy={H / 2} r={11} fill={color} />
      <text x={x} y={H / 2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={15}>{sign}</text>
    </g>
  );
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <button type="button" style={btn(mode === 'dipole')} onClick={() => setMode('dipole')}>+ 와 −</button>
        <button type="button" style={btn(mode === 'same')} onClick={() => setMode('same')}>+ 와 +</button>
        <button type="button" style={btn(mode === 'wire')} onClick={() => setMode('wire')}>전류의 자기장</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} role="img" aria-label="장을 나타내는 화살표 격자">
        <g stroke="currentColor" strokeWidth={1.4}>{arrows}</g>
        {mode !== 'wire' && charge(W / 2 - 70, '+', '#d33')}
        {mode === 'dipole' && charge(W / 2 + 70, '−', '#36c')}
        {mode === 'same' && charge(W / 2 + 70, '+', '#d33')}
        {mode === 'wire' && (
          <g>
            <circle cx={W / 2} cy={H / 2} r={10} fill="var(--bf-paper)" stroke="currentColor" strokeWidth={2} />
            <circle cx={W / 2} cy={H / 2} r={3} fill="currentColor" />
          </g>
        )}
      </svg>
      <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: 14 }}>
        {mode === 'wire' ? '⊙: 전류가 종이를 뚫고 나온다. 자기장은 둘레를 감아 돈다' : '화살표는 + 전하가 받을 힘의 방향, 진하기는 세기'}
      </p>
    </div>
  );
}
