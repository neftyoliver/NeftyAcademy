/** 전자공학 입문 1.3 그림: 오실로스코프 화면. 1kHz, 1.6Vpp 사인파를 V/칸과 시간/칸을 바꿔 가며 본다. */
import { useState } from 'react';

const V_STEPS = [0.2, 0.5, 1, 2];
const T_STEPS = [0.1e-3, 0.25e-3, 0.5e-3, 1e-3];
const VPP = 1.6;
const FREQ = 1000;

export function OscScreen() {
  const [vi, setVi] = useState(1);
  const [ti, setTi] = useState(1);
  const vdiv = V_STEPS[vi]!;
  const tdiv = T_STEPS[ti]!;
  const D = 36; // 한 칸
  const W = 10 * D;
  const H = 8 * D;
  const ox = 10;
  const oy = 10;
  let d = '';
  for (let x = 0; x <= W; x++) {
    const t = (x / D) * tdiv;
    const v = (VPP / 2) * Math.sin(2 * Math.PI * FREQ * t);
    const y = Math.max(0, Math.min(H, H / 2 - (v / vdiv) * D));
    d += `${x === 0 ? 'M' : 'L'}${ox + x} ${oy + y}`;
  }
  const btn = { padding: '3px 9px', margin: '0 3px', borderRadius: 8, border: '1px solid currentColor', background: 'transparent', color: 'inherit', cursor: 'pointer' };
  const fmtT = (s: number) => (s >= 1e-3 ? `${s * 1e3}ms` : `${s * 1e6}µs`);
  return (
    <div>
      <svg viewBox={`0 0 ${W + 20} ${H + 20}`} width={W + 20} role="img" aria-label="오실로스코프 화면의 사인파">
        <rect x={ox} y={oy} width={W} height={H} fill="#10241a" rx={4} />
        <g stroke="#3d6b55" strokeWidth={1}>
          {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={ox + i * D} y1={oy} x2={ox + i * D} y2={oy + H} opacity={i === 5 ? 1 : 0.5} />)}
          {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1={ox} y1={oy + i * D} x2={ox + W} y2={oy + i * D} opacity={i === 4 ? 1 : 0.5} />)}
        </g>
        <path d={d} fill="none" stroke="#7dffb0" strokeWidth={2} />
        <path d={`M${ox} ${oy + H / 2}l-8 -5v10z`} fill="#ffcc55" />
      </svg>
      <div style={{ textAlign: 'center', marginTop: 8, lineHeight: 2 }}>
        <span>세로 {vdiv} V/칸</span>
        <button type="button" style={btn} onClick={() => setVi(Math.max(0, vi - 1))}>−</button>
        <button type="button" style={btn} onClick={() => setVi(Math.min(V_STEPS.length - 1, vi + 1))}>+</button>
        <span style={{ marginLeft: 14 }}>가로 {fmtT(tdiv)}/칸</span>
        <button type="button" style={btn} onClick={() => setTi(Math.max(0, ti - 1))}>−</button>
        <button type="button" style={btn} onClick={() => setTi(Math.min(T_STEPS.length - 1, ti + 1))}>+</button>
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          봉우리~골 {(VPP / vdiv).toFixed(1)}칸, 한 주기 {(1 / FREQ / tdiv).toFixed(1)}칸
        </div>
      </div>
    </div>
  );
}
