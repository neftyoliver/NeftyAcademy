/**
 * 좌표평면에 그리는 그림. 함수의 그래프, 점과 선분, 도형, 벡터를 수학의 좌표로 적으면 SVG 로 그린다.
 * 곡선은 함수를 그대로 넘기고, 그리는 일은 화면에서 한다(값의 표를 따로 만들지 않는다).
 *
 *   <Plane x={[-3, 3]} y={[-1, 5]}>
 *     <Curve f={(x) => x * x} />
 *     <Dot at={[1, 1]} label="(1, 1)" />
 *   </Plane>
 *
 *   <Plane x={[0, 5]} y={[0, 4]} axes={false}>            축 없이 도형만
 *     <Poly pts={[[0, 0], [4, 0], [4, 3]]} fill />
 *     <Seg a={[0, 0]} b={[4, 3]} label="5" />
 *   </Plane>
 *
 * Plane 의 속성
 *  - x, y: 보이는 범위 [작은 값, 큰 값]
 *  - height: 그림의 높이(픽셀). 적지 않으면 가로와 세로의 눈금 길이를 같게 맞춘다
 *  - axes: 축을 그릴지(기본 true). grid: 모눈을 그릴지. ticks: 눈금과 숫자를 그릴지(기본은 axes 와 같다)
 *  - step: 눈금 간격 [가로, 세로]. 적지 않으면 보기 좋게 고른다
 *  - xLabel, yLabel: 축 이름(기본 x, y). origin: 원점에 O 를 적을지(기본 true)
 *  - pad: 그림 둘레의 여백(픽셀). 이름표가 그림 밖으로 나갈 때 넓힌다
 *
 * 안에 넣는 것: Curve, Param, Dot, Seg, Vec, Line, Poly, Rect, Circle, Angle, Area, Label, Guide
 *  - color: 0~3 은 그림의 네 색(주황, 파랑, 초록, 보라). 적지 않으면 글자색
 *  - label 의 글: 한 글자짜리 로마자는 기울여 쓴다. x_1 은 아래첨자, x^2 는 위첨자가 된다
 *  - pos: 이름표를 둘 쪽. n e s w 와 그 사이 ne nw se sw
 */
import { createContext, useContext, useId } from 'react';
import type { ReactNode } from 'react';

export type Pt = [number, number];
type Color = number | string | undefined;
type Pos = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'c';

const COLORS = ['#e8590c', '#1c7ed6', '#2f9e44', '#9c36b5'];
const paint = (c: Color): string => (c === undefined ? 'currentColor' : typeof c === 'number' ? (COLORS[c % COLORS.length] ?? 'currentColor') : c);

interface View {
  sx: (x: number) => number;
  sy: (y: number) => number;
  x: Pt;
  y: Pt;
  clip: string;
}
const ViewContext = createContext<View | null>(null);
function useView(): View {
  const view = useContext(ViewContext);
  if (!view) throw new Error('Plane 안에서만 쓸 수 있다');
  return view;
}

/** lo와 hi 사이를 n칸쯤으로 나누는 보기 좋은 간격(1, 2, 5의 곱) */
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
/** 눈금에 적을 수: 군더더기 0 을 떼고, 빼기 기호는 − 로 */
export function tickText(v: number): string {
  const s = String(Number(v.toFixed(6)));
  return s.replace('-', '−');
}

/** 수와 셈 기호로만 된 글. 수식의 글꼴로 적는다 */
const NUMERIC = /^[\d.,+\-−=()[\] √·×÷<>≤≥≠≈∞/:%°|]+$/u;

/**
 * 이름표의 글을 SVG 의 tspan 들로. 한 글자짜리 로마자와 그리스 소문자는 기울이고, _ 와 ^ 뒤의 것은 첨자로 쓴다.
 * 예) "y = x^2", "a_1", "(x_1, y_1)", "넓이 S"
 */
export function mathLabel(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /([_^])(\{[^}]*\}|.)|([A-Za-z]+)|([^A-Za-z_^]+)/gu;
  let key = 0;
  let shift = 0; // 지금까지 옮긴 높이. 첨자 뒤에 제자리로 돌아오게 한다
  const piece = (s: string, dy: number, small: boolean) => {
    const italic = /^[A-Za-zα-ω]$/u.test(s);
    out.push(
      <tspan key={key++} dy={dy - shift || undefined} fontSize={small ? '0.72em' : undefined} className={italic ? 'pl-var' : NUMERIC.test(s) ? 'pl-num' : undefined}>
        {s}
      </tspan>,
    );
    shift = dy;
  };
  for (const m of text.matchAll(re)) {
    if (m[1]) {
      const body = (m[2] ?? '').replace(/^\{|\}$/g, '');
      const dy = m[1] === '_' ? 4 : -6;
      for (const part of body.match(/[A-Za-zα-ω]|[^A-Za-zα-ω]+/gu) ?? []) piece(part, dy, true);
    } else if (m[3]) {
      // 로마자가 이어지면 낱말이다(sin, cm). 한 글자면 변수다
      if (m[3].length === 1) piece(m[3], 0, false);
      else {
        out.push(
          <tspan key={key++} dy={-shift || undefined}>
            {m[3]}
          </tspan>,
        );
        shift = 0;
      }
    } else if (m[4]) {
      for (const part of m[4].match(/[α-ω]|[^α-ω]+/gu) ?? []) piece(part, 0, false);
    }
  }
  return out;
}

/** 점 (px, py) 옆에 이름표를 놓을 자리와 맞춤 */
function place(px: number, py: number, pos: Pos, gap: number): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  const dx = pos.includes('e') ? gap : pos.includes('w') ? -gap : 0;
  const dy = pos.includes('n') ? -gap : pos.includes('s') ? gap + 9 : 4;
  return { x: px + dx, y: py + dy, anchor: pos.includes('e') ? 'start' : pos.includes('w') ? 'end' : 'middle' };
}

export function Plane({
  x,
  y,
  width = 320,
  height,
  axes = true,
  grid = false,
  ticks,
  step,
  xLabel = 'x',
  yLabel = 'y',
  origin = true,
  pad: padProp,
  children,
}: {
  x: Pt;
  y: Pt;
  width?: number;
  height?: number;
  axes?: boolean;
  grid?: boolean;
  ticks?: boolean;
  step?: [number, number];
  xLabel?: string;
  yLabel?: string;
  origin?: boolean;
  pad?: number;
  children?: ReactNode;
}) {
  const id = useId();
  const pad = padProp ?? (axes ? 16 : 8);
  const innerW = width - pad * 2;
  const innerH = height === undefined ? (innerW * (y[1] - y[0])) / (x[1] - x[0]) : height - pad * 2;
  const H = innerH + pad * 2;
  const sx = (v: number) => pad + ((v - x[0]) / (x[1] - x[0])) * innerW;
  const sy = (v: number) => pad + ((y[1] - v) / (y[1] - y[0])) * innerH;
  const stepX = step?.[0] ?? niceStep(x[0], x[1], innerW / 42);
  const stepY = step?.[1] ?? niceStep(y[0], y[1], innerH / 34);
  const showTicks = ticks ?? axes;
  const xs = multiples(x[0], x[1], stepX);
  const ys = multiples(y[0], y[1], stepY);
  // 축이 범위 밖이면 가장자리에 붙인다
  const ax = Math.min(Math.max(0, x[0]), x[1]);
  const ay = Math.min(Math.max(0, y[0]), y[1]);
  const clip = `pl-clip-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  const view: View = { sx, sy, x, y, clip };
  return (
    <svg className="pl" viewBox={`0 0 ${width} ${H}`} width={width} role="img">
      <defs>
        <clipPath id={clip}>
          <rect x={pad - 1} y={pad - 1} width={innerW + 2} height={innerH + 2} />
        </clipPath>
      </defs>
      {grid ? (
        <g className="pl-grid">
          {xs.map((v) => (
            <line key={`x${v}`} x1={sx(v)} x2={sx(v)} y1={pad} y2={pad + innerH} />
          ))}
          {ys.map((v) => (
            <line key={`y${v}`} y1={sy(v)} y2={sy(v)} x1={pad} x2={pad + innerW} />
          ))}
        </g>
      ) : null}
      {axes ? (
        <g className="pl-axes">
          <line x1={pad - 6} x2={pad + innerW + 8} y1={sy(ay)} y2={sy(ay)} />
          <path d={`M${pad + innerW + 13},${sy(ay)} l-8,-3.4 l0,6.8 z`} className="pl-head" />
          <line y1={pad + innerH + 6} y2={pad - 8} x1={sx(ax)} x2={sx(ax)} />
          <path d={`M${sx(ax)},${pad - 13} l-3.4,8 l6.8,0 z`} className="pl-head" />
          {showTicks
            ? xs
                .filter((v) => Math.abs(v - ax) > stepX / 1e6 && sx(v) < pad + innerW - 4)
                .map((v) => (
                  <g key={`tx${v}`}>
                    <line x1={sx(v)} x2={sx(v)} y1={sy(ay) - 3} y2={sy(ay) + 3} />
                    <text x={sx(v)} y={sy(ay) + 15} textAnchor="middle" className="pl-tick">
                      {tickText(v)}
                    </text>
                  </g>
                ))
            : null}
          {showTicks
            ? ys
                .filter((v) => Math.abs(v - ay) > stepY / 1e6 && sy(v) > pad + 4)
                .map((v) => (
                  <g key={`ty${v}`}>
                    <line y1={sy(v)} y2={sy(v)} x1={sx(ax) - 3} x2={sx(ax) + 3} />
                    <text x={sx(ax) - 6} y={sy(v) + 4} textAnchor="end" className="pl-tick">
                      {tickText(v)}
                    </text>
                  </g>
                ))
            : null}
          <text x={pad + innerW + 12} y={sy(ay) + 16} textAnchor="end" className="pl-name">
            {mathLabel(xLabel)}
          </text>
          <text x={sx(ax) + 8} y={pad - 6} className="pl-name">
            {mathLabel(yLabel)}
          </text>
          {origin && ax === 0 && ay === 0 ? (
            <text x={sx(0) - 6} y={sy(0) + 15} textAnchor="end" className="pl-name pl-origin">
              O
            </text>
          ) : null}
        </g>
      ) : null}
      <ViewContext.Provider value={view}>{children}</ViewContext.Provider>
    </svg>
  );
}

/** 곡선 조각들의 path. 값이 없거나 범위를 크게 벗어나면 끊는다 */
function pathOf(points: Pt[], view: View): string {
  const span = view.y[1] - view.y[0];
  let d = '';
  let pen = false;
  for (const [px, py] of points) {
    const ok = Number.isFinite(px) && Number.isFinite(py) && py > view.y[0] - span * 2 && py < view.y[1] + span * 2;
    if (!ok) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${view.sx(px).toFixed(2)},${view.sy(py).toFixed(2)}`;
    pen = true;
  }
  return d;
}

/** 함수 y = f(x) 의 그래프. from, to 를 적지 않으면 보이는 범위 전체에 그린다 */
export function Curve({ f, from, to, color = 0, dashed, n = 240 }: { f: (x: number) => number; from?: number; to?: number; color?: Color; dashed?: boolean; n?: number }) {
  const view = useView();
  const a = from ?? view.x[0];
  const b = to ?? view.x[1];
  const points: Pt[] = [];
  let prev: number | undefined;
  for (let i = 0; i <= n; i++) {
    const px = a + ((b - a) * i) / n;
    const py = f(px);
    // 한 걸음에 보이는 높이보다 더 뛰면 끊어진 곳(점근선)으로 본다
    if (prev !== undefined && Math.abs(py - prev) > view.y[1] - view.y[0]) points.push([Number.NaN, Number.NaN]);
    points.push([px, py]);
    prev = py;
  }
  return <path d={pathOf(points, view)} className="pl-curve" stroke={paint(color)} strokeDasharray={dashed ? '5 4' : undefined} clipPath={`url(#${view.clip})`} />;
}

/** 매개변수 곡선 t ↦ (x, y) */
export function Param({ f, from, to, color = 0, dashed, n = 240 }: { f: (t: number) => Pt; from: number; to: number; color?: Color; dashed?: boolean; n?: number }) {
  const view = useView();
  const points: Pt[] = [];
  for (let i = 0; i <= n; i++) points.push(f(from + ((to - from) * i) / n));
  return <path d={pathOf(points, view)} className="pl-curve" stroke={paint(color)} strokeDasharray={dashed ? '5 4' : undefined} clipPath={`url(#${view.clip})`} />;
}

/** 곡선 아래(또는 두 곡선 사이)의 넓이를 칠한다. g 를 적지 않으면 x축까지 */
export function Area({ f, g = () => 0, from, to, color = 0, n = 120 }: { f: (x: number) => number; g?: (x: number) => number; from: number; to: number; color?: Color; n?: number }) {
  const view = useView();
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const px = from + ((to - from) * i) / n;
    top.push([px, f(px)]);
    bottom.unshift([px, g(px)]);
  }
  const d = [...top, ...bottom].map(([px, py], i) => `${i ? 'L' : 'M'}${view.sx(px).toFixed(2)},${view.sy(py).toFixed(2)}`).join('');
  return <path d={`${d}Z`} className="pl-area" fill={paint(color)} clipPath={`url(#${view.clip})`} />;
}

function LabelAt({ px, py, pos = 'ne', gap = 7, text, color }: { px: number; py: number; pos?: Pos; gap?: number; text: string; color?: Color }) {
  const at = place(px, py, pos, gap);
  return (
    <text x={at.x} y={at.y} textAnchor={at.anchor} className="pl-label" style={color === undefined ? undefined : { fill: paint(color) }}>
      {mathLabel(text)}
    </text>
  );
}

/** 점. open 이면 속이 빈 점(그 점은 빠진다는 뜻) */
export function Dot({ at, label, pos = 'ne', color, open, r = 3.2 }: { at: Pt; label?: string; pos?: Pos; color?: Color; open?: boolean; r?: number }) {
  const view = useView();
  const px = view.sx(at[0]);
  const py = view.sy(at[1]);
  return (
    <g>
      <circle cx={px} cy={py} r={r} className={open ? 'pl-dot is-open' : 'pl-dot'} fill={open ? undefined : paint(color)} stroke={paint(color)} />
      {label ? <LabelAt px={px} py={py} pos={pos} text={label} color={color} /> : null}
    </g>
  );
}

/** 좌표에 글만 놓는다 */
export function Label({ at, text, pos = 'c', color }: { at: Pt; text: string; pos?: Pos; color?: Color }) {
  const view = useView();
  return <LabelAt px={view.sx(at[0])} py={view.sy(at[1])} pos={pos} gap={pos === 'c' ? 0 : 7} text={text} color={color} />;
}

function arrowHead(x1: number, y1: number, x2: number, y2: number, size = 8): string {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  return `M${x2.toFixed(2)},${y2.toFixed(2)}L${(bx - uy * size * 0.42).toFixed(2)},${(by + ux * size * 0.42).toFixed(2)}L${(bx + uy * size * 0.42).toFixed(2)},${(by - ux * size * 0.42).toFixed(2)}Z`;
}

/** 선분. label 은 가운데 옆에 적는다. arrow: 끝에 화살촉 */
export function Seg({ a, b, label, pos, color, dashed, arrow, bold }: { a: Pt; b: Pt; label?: string; pos?: Pos; color?: Color; dashed?: boolean; arrow?: boolean; bold?: boolean }) {
  const view = useView();
  const x1 = view.sx(a[0]);
  const y1 = view.sy(a[1]);
  const x2 = view.sx(b[0]);
  const y2 = view.sy(b[1]);
  // 이름표는 선분의 왼쪽(걸어가는 방향에서)으로 조금 띄운다
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (y2 - y1) / len;
  const ny = -(x2 - x1) / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const end = arrow ? { x: x2 - ((x2 - x1) / len) * 5, y: y2 - ((y2 - y1) / len) * 5 } : { x: x2, y: y2 };
  return (
    <g>
      <line x1={x1} y1={y1} x2={end.x} y2={end.y} className={bold ? 'pl-seg is-bold' : 'pl-seg'} stroke={paint(color)} strokeDasharray={dashed ? '5 4' : undefined} />
      {arrow ? <path d={arrowHead(x1, y1, x2, y2)} fill={paint(color)} /> : null}
      {label ? pos ? <LabelAt px={mx} py={my} pos={pos} text={label} color={color} /> : (
        <text x={mx + nx * 11} y={my + ny * 11 + 4} textAnchor="middle" className="pl-label" style={color === undefined ? undefined : { fill: paint(color) }}>
          {mathLabel(label)}
        </text>
      ) : null}
    </g>
  );
}

/** 벡터: a 에서 b 로 가는 화살표 */
export function Vec({ a = [0, 0], b, label, pos, color = 1 }: { a?: Pt; b: Pt; label?: string; pos?: Pos; color?: Color }) {
  return <Seg a={a} b={b} label={label} pos={pos} color={color} arrow bold />;
}

/** 두 점을 지나는 직선. 그림의 끝까지 뻗는다 */
export function Line({ a, b, color = 0, dashed }: { a: Pt; b: Pt; color?: Color; dashed?: boolean }) {
  const view = useView();
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const reach = (view.x[1] - view.x[0] + (view.y[1] - view.y[0])) * 2 / (Math.hypot(dx, dy) || 1);
  return (
    <line
      x1={view.sx(a[0] - dx * reach)}
      y1={view.sy(a[1] - dy * reach)}
      x2={view.sx(a[0] + dx * reach)}
      y2={view.sy(a[1] + dy * reach)}
      className="pl-curve"
      stroke={paint(color)}
      strokeDasharray={dashed ? '5 4' : undefined}
      clipPath={`url(#${view.clip})`}
    />
  );
}

/** 다각형. fill 이면 옅게 칠한다 */
export function Poly({ pts, color, fill, dashed }: { pts: Pt[]; color?: Color; fill?: boolean; dashed?: boolean }) {
  const view = useView();
  const points = pts.map(([px, py]) => `${view.sx(px).toFixed(2)},${view.sy(py).toFixed(2)}`).join(' ');
  return <polygon points={points} className={fill ? 'pl-shape is-fill' : 'pl-shape'} stroke={paint(color)} fill={fill ? paint(color ?? 1) : 'none'} strokeDasharray={dashed ? '5 4' : undefined} />;
}

/** 축에 나란한 직사각형. at 은 왼쪽 아래 꼭짓점 */
export function Rect({ at, w, h, color, fill, dashed }: { at: Pt; w: number; h: number; color?: Color; fill?: boolean; dashed?: boolean }) {
  return (
    <Poly
      pts={[
        [at[0], at[1]],
        [at[0] + w, at[1]],
        [at[0] + w, at[1] + h],
        [at[0], at[1] + h],
      ]}
      color={color}
      fill={fill}
      dashed={dashed}
    />
  );
}

/** 원. 가로와 세로의 눈금 길이가 다르면 타원으로 보인다 */
export function Circle({ c, r, color, fill, dashed }: { c: Pt; r: number; color?: Color; fill?: boolean; dashed?: boolean }) {
  const view = useView();
  const rx = Math.abs(view.sx(c[0] + r) - view.sx(c[0]));
  const ry = Math.abs(view.sy(c[1] + r) - view.sy(c[1]));
  return <ellipse cx={view.sx(c[0])} cy={view.sy(c[1])} rx={rx} ry={ry} className={fill ? 'pl-shape is-fill' : 'pl-shape'} stroke={paint(color)} fill={fill ? paint(color ?? 1) : 'none'} strokeDasharray={dashed ? '5 4' : undefined} />;
}

/**
 * 각의 표시. at 이 꼭짓점이고, from 방향에서 to 방향까지 반시계로 호를 그린다(각도는 도).
 * 직각(to − from 이 90)이면 네모로 표시한다.
 */
export function Angle({ at, from, to, label, r = 18, color }: { at: Pt; from: number; to: number; label?: string; r?: number; color?: Color }) {
  const view = useView();
  const px = view.sx(at[0]);
  const py = view.sy(at[1]);
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const point = (deg: number, radius: number): Pt => [px + radius * Math.cos(rad(deg)), py - radius * Math.sin(rad(deg))];
  const right = Math.abs(to - from - 90) < 1e-6;
  const [x1, y1] = point(from, right ? r * 0.62 : r);
  const [x2, y2] = point(to, right ? r * 0.62 : r);
  const [cx, cy] = point((from + to) / 2, right ? r * 0.62 * Math.SQRT2 : r);
  const d = right ? `M${x1.toFixed(2)},${y1.toFixed(2)}L${cx.toFixed(2)},${cy.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}` : `M${x1.toFixed(2)},${y1.toFixed(2)}A${r},${r} 0 ${to - from > 180 ? 1 : 0} 0 ${x2.toFixed(2)},${y2.toFixed(2)}`;
  const [lx, ly] = point((from + to) / 2, r + 11);
  return (
    <g>
      <path d={d} className="pl-angle" stroke={paint(color)} />
      {label ? (
        <text x={lx} y={ly + 4} textAnchor="middle" className="pl-label" style={color === undefined ? undefined : { fill: paint(color) }}>
          {mathLabel(label)}
        </text>
      ) : null}
    </g>
  );
}

/** 점에서 두 축으로 내린 점선. x, y 를 false 로 하면 그쪽은 그리지 않는다 */
export function Guide({ at, x = true, y = true }: { at: Pt; x?: boolean; y?: boolean }) {
  const view = useView();
  const px = view.sx(at[0]);
  const py = view.sy(at[1]);
  return (
    <g className="pl-guide">
      {x ? <line x1={px} y1={py} x2={px} y2={view.sy(0)} /> : null}
      {y ? <line x1={px} y1={py} x2={view.sx(0)} y2={py} /> : null}
    </g>
  );
}
