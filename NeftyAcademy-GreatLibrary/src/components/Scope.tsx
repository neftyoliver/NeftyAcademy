/**
 * 오실로스코프 화면 그림. 가로 10칸, 세로 8칸의 눈금 위에 파형을 그리고, 아래에 칸당 값과 커서의 읽음을 적는다.
 *
 *   <Scope tdiv={1e-3} dt={2e-5} traces={[{ name: 'CH1 입력', data: vin, vdiv: 1 }, { name: 'CH2 출력', data: vout, vdiv: 1, pos: -2 }]}
 *          trigger={{ level: 1.65 }} cursorsT={[1e-3, 2e-3]} />
 *
 *  - data: 같은 간격(dt 초)으로 잰 전압들. 첫 값이 화면 왼쪽 끝(t0, 기본 0)이다
 *  - vdiv: 그 채널의 V/칸. pos: 0V 선을 가운데에서 몇 칸 위에 둘지(음수면 아래)
 *  - trigger: 트리거 레벨 표시(첫 채널 기준). cursorsT/cursorsV: 세로 커서 둘(초), 가로 커서 둘(V, 첫 채널 기준)
 */
type Trace = { name: string; data: number[]; vdiv: number; pos?: number };
type Props = {
  traces: Trace[];
  dt: number;
  tdiv: number;
  t0?: number;
  trigger?: { level: number };
  cursorsT?: [number, number];
  cursorsV?: [number, number];
};

const COLORS = ['#ffe66d', '#6dd3ff', '#ff8fb1', '#9dff8a'];

/** 1.5e-3, 's' → '1.5ms' */
export function eng(value: number, unit: string): string {
  const a = Math.abs(value);
  if (a === 0) return `0${unit}`;
  const steps: [number, string][] = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  for (const [scale, prefix] of steps) {
    if (a >= scale * 0.9995) return `${Number((value / scale).toPrecision(3))}${prefix}${unit}`;
  }
  return `${value.toExponential(2)}${unit}`;
}

export function Scope({ traces, dt, tdiv, t0 = 0, trigger, cursorsT, cursorsV }: Props) {
  const D = 36;
  const W = 10 * D;
  const H = 8 * D;
  const ox = 26;
  const oy = 10;
  const xOf = (t: number) => ox + ((t - t0) / tdiv) * D;
  const yOf = (v: number, tr: Trace) => oy + H / 2 - ((tr.pos ?? 0) + v / tr.vdiv) * D;
  const clampY = (y: number) => Math.max(oy, Math.min(oy + H, y));
  const first = traces[0]!;
  return (
    <div>
      <svg viewBox={`0 0 ${W + ox + 10} ${H + 20}`} style={{ width: '100%', maxWidth: W + ox + 10 }} role="img" aria-label="오실로스코프 화면">
        <rect x={ox} y={oy} width={W} height={H} fill="#10241a" rx={4} />
        <g stroke="#3d6b55" strokeWidth={1}>
          {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={ox + i * D} y1={oy} x2={ox + i * D} y2={oy + H} opacity={i === 5 ? 1 : 0.5} />)}
          {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1={ox} y1={oy + i * D} x2={ox + W} y2={oy + i * D} opacity={i === 4 ? 1 : 0.5} />)}
        </g>
        {traces.map((tr, k) => {
          let d = '';
          tr.data.forEach((v, i) => {
            const x = xOf(t0 + i * dt);
            if (x < ox - 0.01 || x > ox + W + 0.01) return;
            d += `${d ? 'L' : 'M'}${x.toFixed(1)} ${clampY(yOf(v, tr)).toFixed(1)}`;
          });
          const zero = clampY(yOf(0, tr));
          return (
            <g key={tr.name}>
              <path d={d} fill="none" stroke={COLORS[k % COLORS.length]} strokeWidth={1.8} strokeLinejoin="round" />
              <path d={`M${ox - 2} ${zero}l-9 -5v10z`} fill={COLORS[k % COLORS.length]} />
              <text x={ox - 13} y={zero + 4} fontSize={9} textAnchor="end" fill="currentColor">{k + 1}</text>
            </g>
          );
        })}
        {trigger && (
          <g>
            <line x1={ox} y1={clampY(yOf(trigger.level, first))} x2={ox + W} y2={clampY(yOf(trigger.level, first))} stroke="#ffa94d" strokeWidth={1} strokeDasharray="2 5" />
            <text x={ox + W - 3} y={clampY(yOf(trigger.level, first)) - 3} fontSize={10} textAnchor="end" fill="#ffa94d">T</text>
          </g>
        )}
        {cursorsT?.map((t, i) => <line key={`ct${i}`} x1={xOf(t)} y1={oy} x2={xOf(t)} y2={oy + H} stroke="#ffffff" strokeWidth={1} strokeDasharray="6 4" />)}
        {cursorsV?.map((v, i) => <line key={`cv${i}`} x1={ox} y1={clampY(yOf(v, first))} x2={ox + W} y2={clampY(yOf(v, first))} stroke="#ffffff" strokeWidth={1} strokeDasharray="6 4" />)}
      </svg>
      <div style={{ fontSize: 14, lineHeight: 1.7, marginTop: 4 }}>
        {traces.map((tr, k) => (
          <span key={tr.name} style={{ marginRight: 14, whiteSpace: 'nowrap' }}>
            <span style={{ color: COLORS[k % COLORS.length] }}>■</span> {tr.name} {eng(tr.vdiv, 'V')}/칸
          </span>
        ))}
        <span style={{ marginRight: 14, whiteSpace: 'nowrap' }}>가로 {eng(tdiv, 's')}/칸</span>
        {trigger && <span style={{ marginRight: 14, whiteSpace: 'nowrap' }}>트리거 {eng(trigger.level, 'V')}</span>}
        {cursorsT && (
          <span style={{ marginRight: 14, whiteSpace: 'nowrap' }}>
            Δt {eng(Math.abs(cursorsT[1] - cursorsT[0]), 's')} (1/Δt {eng(1 / Math.abs(cursorsT[1] - cursorsT[0]), 'Hz')})
          </span>
        )}
        {cursorsV && <span style={{ whiteSpace: 'nowrap' }}>ΔV {eng(Math.abs(cursorsV[1] - cursorsV[0]), 'V')}</span>}
      </div>
    </div>
  );
}
