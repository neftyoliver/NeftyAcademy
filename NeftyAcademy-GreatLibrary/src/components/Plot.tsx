/**
 * 가로와 세로가 모두 값인 곡선 그림. DC 훑기의 곡선, 보드 선도, 값을 바꿔 가며 돌린 결과에 쓴다.
 *
 *   <Plot x={vcc} xUnit="V" xName="전원 전압" yUnit="A" yName="LED 전류"
 *         series={[{ name: '330Ω', data: i330 }, { name: '1kΩ', data: i1k }]} vmarks={[{ at: 3.3, label: '3.3V' }]} />
 *   <Plot logX x={freq} xUnit="Hz" xName="주파수" yUnit="dB" yName="크기"
 *         series={[{ name: 'out', data: db }]} hmarks={[{ at: -3, label: '−3dB' }]} />
 *
 *  - x: 가로 값들. series[].data는 x와 길이가 같다
 *  - logX: 가로를 로그 눈금으로 그린다(주파수). 이때 x는 모두 0보다 커야 한다
 *  - yMin, yMax: 세로 범위. 없으면 값에서 정한다
 *  - vmarks: 세로 점선과 이름표. hmarks: 가로 점선과 이름표
 */
import { eng } from './Scope';

type Series = { name: string; data: number[] };
type Mark = { at: number; label?: string };
type Props = {
  x: number[];
  series: Series[];
  xUnit?: string;
  yUnit?: string;
  xName?: string;
  yName?: string;
  logX?: boolean;
  yMin?: number;
  yMax?: number;
  vmarks?: Mark[];
  hmarks?: Mark[];
};

const COLORS = ['#e8590c', '#1c7ed6', '#2f9e44', '#9c36b5'];

/** lo와 hi 사이를 n칸쯤으로 나누는 보기 좋은 간격(1, 2, 5의 곱) */
function niceStep(lo: number, hi: number, n: number): number {
  const raw = (hi - lo) / n;
  if (!(raw > 0)) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw * 0.999) ?? 10 * mag;
}

/** step의 배수 가운데 lo와 hi 사이에 드는 것들 */
function ticksOf(lo: number, hi: number, step: number): number[] {
  const out: number[] = [];
  for (let i = Math.ceil(lo / step - 1e-9); i * step <= hi + step * 1e-9; i++) out.push(i * step);
  return out;
}

export function Plot({ x, series, xUnit = '', yUnit = '', xName, yName, logX = false, yMin, yMax, vmarks, hmarks }: Props) {
  const W = 310;
  const H = 200;
  const ox = 58;
  const oy = 12;
  const tx = (v: number) => (logX ? Math.log10(v) : v);
  const xLo = Math.min(...x);
  const xHi = Math.max(...x);
  const all = series.flatMap((s) => s.data);
  const dLo = Math.min(...all);
  const dHi = Math.max(...all);
  const yStep = niceStep(yMin ?? dLo, yMax ?? dHi, 5);
  const yLo = yMin ?? Math.floor(dLo / yStep + 1e-9) * yStep;
  const yHi = yMax ?? Math.ceil(dHi / yStep - 1e-9) * yStep;
  const xOf = (v: number) => ox + ((tx(v) - tx(xLo)) / (tx(xHi) - tx(xLo) || 1)) * W;
  const yOf = (v: number) => oy + H - ((Math.max(yLo, Math.min(yHi, v)) - yLo) / (yHi - yLo || 1)) * H;

  const yTicks = ticksOf(yLo, yHi, yStep);
  let xTicks: number[];
  let xMinor: number[] = [];
  if (logX) {
    xTicks = [];
    for (let k = Math.ceil(Math.log10(xLo) - 1e-9); k <= Math.floor(Math.log10(xHi) + 1e-9); k++) xTicks.push(10 ** k);
    for (let k = Math.floor(Math.log10(xLo)); k <= Math.floor(Math.log10(xHi)); k++) {
      for (let m = 2; m <= 9; m++) {
        const v = m * 10 ** k;
        if (v > xLo && v < xHi) xMinor.push(v);
      }
    }
  } else {
    xTicks = ticksOf(xLo, xHi, niceStep(xLo, xHi, 5));
  }
  const clean = (v: number, step: number) => (Math.abs(v) < step * 1e-6 ? 0 : v);

  return (
    <div>
      <svg viewBox={`0 0 ${ox + W + 16} ${oy + H + 24}`} style={{ width: '100%', maxWidth: ox + W + 16 }} role="img" aria-label={`${xName ?? '가로'}에 따른 ${yName ?? '값'}의 곡선`}>
        <rect x={ox} y={oy} width={W} height={H} fill="var(--bf-paper)" stroke="currentColor" strokeOpacity={0.45} rx={3} />
        <g stroke="currentColor" strokeWidth={1}>
          {xMinor.map((v) => <line key={`xm${v}`} x1={xOf(v)} y1={oy} x2={xOf(v)} y2={oy + H} strokeOpacity={0.07} />)}
          {xTicks.map((v) => <line key={`xt${v}`} x1={xOf(v)} y1={oy} x2={xOf(v)} y2={oy + H} strokeOpacity={0.16} />)}
          {yTicks.map((v) => <line key={`yt${v}`} x1={ox} y1={yOf(v)} x2={ox + W} y2={yOf(v)} strokeOpacity={0.16} />)}
        </g>
        <g fontSize={10} fill="currentColor">
          {xTicks.map((v) => <text key={`xl${v}`} x={xOf(v)} y={oy + H + 14} textAnchor="middle">{eng(clean(v, xHi - xLo), xUnit)}</text>)}
          {yTicks.map((v) => <text key={`yl${v}`} x={ox - 5} y={yOf(v) + 3.5} textAnchor="end">{eng(clean(v, yStep), yUnit)}</text>)}
        </g>
        {vmarks?.map((m) => (
          <g key={`vm${m.at}`}>
            <line x1={xOf(m.at)} y1={oy} x2={xOf(m.at)} y2={oy + H} stroke="currentColor" strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.7} />
            {m.label && <text x={xOf(m.at) + 4} y={oy + 12} fontSize={10} fill="currentColor">{m.label}</text>}
          </g>
        ))}
        {hmarks?.map((m) => (
          <g key={`hm${m.at}`}>
            <line x1={ox} y1={yOf(m.at)} x2={ox + W} y2={yOf(m.at)} stroke="currentColor" strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.7} />
            {m.label && <text x={ox + W - 4} y={yOf(m.at) - 4} fontSize={10} textAnchor="end" fill="currentColor">{m.label}</text>}
          </g>
        ))}
        {series.map((s, k) => {
          let d = '';
          s.data.forEach((v, i) => {
            const xv = x[i];
            if (xv === undefined || !Number.isFinite(v)) return;
            d += `${d ? 'L' : 'M'}${xOf(xv).toFixed(1)} ${yOf(v).toFixed(1)}`;
          });
          return <path key={s.name} d={d} fill="none" stroke={COLORS[k % COLORS.length]} strokeWidth={2} strokeLinejoin="round" />;
        })}
      </svg>
      <div style={{ fontSize: 14, lineHeight: 1.7, marginTop: 4 }}>
        {series.map((s, k) => (
          <span key={s.name} style={{ marginRight: 14, whiteSpace: 'nowrap' }}>
            <span style={{ color: COLORS[k % COLORS.length] }}>■</span> {s.name}
          </span>
        ))}
        {xName && <span style={{ marginRight: 14, whiteSpace: 'nowrap' }}>가로 {xName}</span>}
        {yName && <span style={{ whiteSpace: 'nowrap' }}>세로 {yName}</span>}
      </div>
    </div>
  );
}
