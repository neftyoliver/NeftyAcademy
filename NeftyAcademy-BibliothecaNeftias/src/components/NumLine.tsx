/**
 * 수직선. 수의 자리, 구간, 수직선 위에서 옮겨 가는 셈(덧셈과 뺄셈)을 그린다.
 *
 *   <NumLine x={[-4, 4]} points={[{ at: -1.5, label: '−3/2' }, { at: 2, label: '2', color: 0 }]} />
 *   <NumLine x={[0, 6]} ranges={[{ from: 1, to: 4, open: [false, true] }]} />        1 ≤ x < 4
 *   <NumLine x={[0, 8]} jumps={[{ from: 3, to: 5, label: '+2' }]} />                 3에서 5로 뛰기
 *
 *  - x: 보이는 범위. step: 숫자를 적는 눈금 간격. minor: 숫자 없는 잔눈금 간격
 *  - labels: false 면 눈금에 숫자를 적지 않는다. only: 숫자를 적을 눈금만 고른다
 *  - points: 점. open 이면 속이 빈 점. label 은 점 위에 적는다(below 면 아래에)
 *  - ranges: 구간. from 이나 to 를 적지 않으면 그쪽으로 끝없이 간다. open 은 [왼쪽, 오른쪽] 끝이 빠지는지
 *  - jumps: 수직선 위의 뜀. 여럿이면 층을 달리해 겹치지 않게 그린다(level 로 층을 고를 수도 있다)
 *  - marks: 눈금이 아닌 자리에 적는 이름(√2 같은 것). 선 아래에 적는다
 *  - arrows: 'right' 면 왼쪽 끝에 화살촉을 달지 않는다(1에서 시작하는 자연수의 수직선)
 */
import { mathLabel, tickText } from './Plane';

type Color = number | string | undefined;
const COLORS = ['#e8590c', '#1c7ed6', '#2f9e44', '#9c36b5'];
const paint = (c: Color): string => (c === undefined ? 'currentColor' : typeof c === 'number' ? (COLORS[c % COLORS.length] ?? 'currentColor') : c);

interface Point {
  at: number;
  label?: string;
  color?: Color;
  open?: boolean;
  below?: boolean;
}
interface Range {
  from?: number;
  to?: number;
  open?: [boolean, boolean];
  color?: Color;
  label?: string;
}
interface Jump {
  from: number;
  to: number;
  label?: string;
  color?: Color;
  level?: number;
}
interface Mark {
  at: number;
  label: string;
}

function niceStep(lo: number, hi: number, n: number): number {
  const raw = (hi - lo) / n;
  if (!(raw > 0)) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw * 0.999) ?? 10 * mag;
}
function multiples(lo: number, hi: number, step: number): number[] {
  const out: number[] = [];
  for (let i = Math.ceil(lo / step - 1e-9); i * step <= hi + step * 1e-9; i++) out.push(i * step);
  return out;
}

export function NumLine({
  x,
  step,
  minor,
  labels = true,
  only,
  points = [],
  ranges = [],
  jumps = [],
  marks = [],
  arrows = 'both',
  width = 320,
}: {
  x: [number, number];
  step?: number;
  minor?: number;
  labels?: boolean;
  only?: number[];
  points?: Point[];
  ranges?: Range[];
  jumps?: Jump[];
  marks?: Mark[];
  arrows?: 'both' | 'right';
  width?: number;
}) {
  const pad = 18;
  const inner = width - pad * 2;
  const sx = (v: number) => pad + ((v - x[0]) / (x[1] - x[0])) * inner;
  const major = step ?? niceStep(x[0], x[1], inner / 34);
  const levels = jumps.map((j, i) => j.level ?? i % 2);
  const top = jumps.length ? Math.max(...levels) : -1;
  const hasTopLabel = points.some((p) => p.label && !p.below) || ranges.some((r) => r.label);
  const above = Math.max(top >= 0 ? 34 + top * 22 : 0, hasTopLabel ? 30 : 12);
  const y = above + 4;
  const hasBelow = marks.length > 0 || points.some((p) => p.label && p.below);
  const H = y + (labels ? 24 : 12) + (hasBelow ? 16 : 0);
  const shown = (v: number) => !only || only.some((o) => Math.abs(o - v) < major / 1e6);
  return (
    <svg className="pl" viewBox={`0 0 ${width} ${H}`} width={width} role="img">
      <g className="pl-axes">
        <line x1={arrows === 'both' ? pad - 8 : pad} x2={pad + inner + 8} y1={y} y2={y} />
        <path d={`M${pad + inner + 14},${y} l-8,-3.4 l0,6.8 z`} className="pl-head" />
        {arrows === 'both' ? <path d={`M${pad - 14},${y} l8,-3.4 l0,6.8 z`} className="pl-head" /> : null}
        {minor ? multiples(x[0], x[1], minor).map((v) => <line key={`m${v}`} x1={sx(v)} x2={sx(v)} y1={y - 2.5} y2={y + 2.5} />) : null}
        {multiples(x[0], x[1], major).map((v) => (
          <g key={`t${v}`}>
            <line x1={sx(v)} x2={sx(v)} y1={y - 4.5} y2={y + 4.5} />
            {labels && shown(v) ? (
              <text x={sx(v)} y={y + 18} textAnchor="middle" className="pl-tick">
                {tickText(v)}
              </text>
            ) : null}
          </g>
        ))}
      </g>
      {marks.map((m) => (
        <g key={`k${m.at}${m.label}`}>
          <line x1={sx(m.at)} x2={sx(m.at)} y1={y - 4.5} y2={y + 4.5} stroke="currentColor" strokeWidth={1.2} />
          <text x={sx(m.at)} y={y + (labels ? 33 : 18)} textAnchor="middle" className="pl-label">
            {mathLabel(m.label)}
          </text>
        </g>
      ))}
      {ranges.map((r, i) => {
        const a = r.from === undefined ? pad - 8 : sx(r.from);
        const b = r.to === undefined ? pad + inner + 8 : sx(r.to);
        const color = paint(r.color ?? 0);
        const open = r.open ?? [false, false];
        return (
          <g key={`r${i}`}>
            <line x1={a} x2={b} y1={y} y2={y} className="nl-range" stroke={color} />
            {r.from !== undefined ? <circle cx={a} cy={y} r={4} className={open[0] ? 'pl-dot is-open' : 'pl-dot'} fill={open[0] ? undefined : color} stroke={color} /> : null}
            {r.to !== undefined ? <circle cx={b} cy={y} r={4} className={open[1] ? 'pl-dot is-open' : 'pl-dot'} fill={open[1] ? undefined : color} stroke={color} /> : null}
            {r.label ? (
              <text x={(a + b) / 2} y={y - 11} textAnchor="middle" className="pl-label" style={{ fill: color }}>
                {mathLabel(r.label)}
              </text>
            ) : null}
          </g>
        );
      })}
      {jumps.map((j, i) => {
        const a = sx(j.from);
        const b = sx(j.to);
        const level = levels[i] ?? 0;
        const h = 20 + level * 22;
        const color = paint(j.color ?? i);
        const dir = b >= a ? 1 : -1;
        // 호의 끝이 수직선 바로 위에 닿게 하고, 화살촉은 내려오는 방향으로 단다
        const y0 = y - 5;
        const d = `M${a},${y0} C${a},${y0 - h * 1.25} ${b},${y0 - h * 1.25} ${b},${y0}`;
        const head = `M${b},${y0 + 1} l${-dir * 5.2},${-7.4} l${dir * 6.6},${1.6} z`;
        return (
          <g key={`j${i}`}>
            <path d={d} className="nl-arc" stroke={color} />
            <path d={head} fill={color} />
            {j.label ? (
              <text x={(a + b) / 2} y={y0 - h * 0.94 - 5} textAnchor="middle" className="pl-label" style={{ fill: color }}>
                {mathLabel(j.label)}
              </text>
            ) : null}
          </g>
        );
      })}
      {points.map((p, i) => {
        const color = paint(p.color ?? 0);
        return (
          <g key={`p${i}`}>
            <circle cx={sx(p.at)} cy={y} r={4} className={p.open ? 'pl-dot is-open' : 'pl-dot'} fill={p.open ? undefined : color} stroke={color} />
            {p.label ? (
              <text x={sx(p.at)} y={p.below ? y + (labels ? 33 : 18) : y - 11} textAnchor="middle" className="pl-label" style={{ fill: color }}>
                {mathLabel(p.label)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
