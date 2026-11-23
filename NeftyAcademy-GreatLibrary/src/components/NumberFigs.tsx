/**
 * 수를 눈으로 보는 그림들. 점의 배열, 짝짓기, 자릿값 블록, 넓이 모형.
 *
 *   <DotGrid rows={3} cols={4} />                         점 3줄 4칸
 *   <DotGrid rows={3} cols={7} cutCol={4} top={['4', '3']} left="3" />     세로로 갈라 색을 나눈다(분배법칙)
 *   <Pairing top={5} bottom={4} topLabel="컵" bottomLabel="받침" />        하나씩 짝짓기. 남는 것이 보인다
 *   <Pairing top={5} bottom={5} marks={['1', '2', '3', '4', '5']} />      아래 칸에 글자를 적는다(세기)
 *   <Base10 n={347} />                                    백 모눈 3, 십 막대 4, 낱개 7
 *   <AreaModel rows={[10, 4]} cols={[20, 3]} />           직사각형을 갈라 곱을 나눠 셈하기
 *   <FigRow>…</FigRow>                                    그림 여럿을 옆으로 나란히(좁으면 아래로 내려간다)
 *
 * 색은 0~3(주황, 파랑, 초록, 보라). 이름표의 글은 Plane 의 mathLabel 규칙을 따른다(한 글자 로마자는 기울인다).
 */
import type { ReactNode } from 'react';
import { mathLabel } from './Plane';

const COLORS = ['#e8590c', '#1c7ed6', '#2f9e44', '#9c36b5'];
const paint = (c: number): string => COLORS[c % COLORS.length] ?? 'currentColor';
const list = (v: string | string[] | undefined): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** 그림 여럿을 옆으로 나란히 */
export function FigRow({ children }: { children?: ReactNode }) {
  return <div className="nf-row">{children}</div>;
}

/**
 * 점(또는 칸)의 배열.
 *  - cutCol, cutRow: 그 칸(줄)부터 색을 달리하고 사이에 점선을 긋는다
 *  - top, left: 위와 왼쪽에 적는 수. 갈랐으면 조각마다 하나씩 적을 수 있다
 *  - shape: 'dot'(기본) 또는 'cell'(네모 칸)
 */
export function DotGrid({
  rows,
  cols,
  cutCol,
  cutRow,
  top,
  left,
  shape = 'dot',
  cell = 20,
  color = 0,
}: {
  rows: number;
  cols: number;
  cutCol?: number;
  cutRow?: number;
  top?: string | string[];
  left?: string | string[];
  shape?: 'dot' | 'cell';
  cell?: number;
  color?: number;
}) {
  const tops = list(top);
  const lefts = list(left);
  const padL = lefts.length ? 26 : 4;
  const padT = tops.length ? 22 : 4;
  const W = padL + cols * cell + 4;
  const H = padT + rows * cell + 4;
  const part = (r: number, c: number) => (cutCol !== undefined && c >= cutCol ? 1 : 0) + (cutRow !== undefined && r >= cutRow ? 2 : 0);
  const marks: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fill = paint(color + part(r, c));
      const x = padL + c * cell;
      const y = padT + r * cell;
      marks.push(
        shape === 'dot' ? (
          <circle key={`${r}-${c}`} cx={x + cell / 2} cy={y + cell / 2} r={cell * 0.3} fill={fill} />
        ) : (
          <rect key={`${r}-${c}`} x={x + 1} y={y + 1} width={cell - 2} height={cell - 2} rx={2} fill={fill} fillOpacity={0.28} stroke={fill} strokeWidth={1.2} />
        ),
      );
    }
  }
  // 위쪽 이름표: 갈랐으면 조각의 가운데에, 아니면 전체의 가운데에
  const colSpans: [number, number][] = cutCol !== undefined && tops.length > 1 ? [[0, cutCol], [cutCol, cols]] : [[0, cols]];
  const rowSpans: [number, number][] = cutRow !== undefined && lefts.length > 1 ? [[0, cutRow], [cutRow, rows]] : [[0, rows]];
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {marks}
      {cutCol !== undefined ? <line x1={padL + cutCol * cell} x2={padL + cutCol * cell} y1={padT - 2} y2={H - 2} className="nf-cut" /> : null}
      {cutRow !== undefined ? <line y1={padT + cutRow * cell} y2={padT + cutRow * cell} x1={padL - 2} x2={W - 2} className="nf-cut" /> : null}
      {colSpans.map(([a, b], i) =>
        tops[i] ? (
          <text key={`t${i}`} x={padL + ((a + b) / 2) * cell} y={padT - 7} textAnchor="middle" className="pl-label">
            {mathLabel(tops[i] ?? '')}
          </text>
        ) : null,
      )}
      {rowSpans.map(([a, b], i) =>
        lefts[i] ? (
          <text key={`l${i}`} x={padL - 8} y={padT + ((a + b) / 2) * cell + 4.5} textAnchor="end" className="pl-label">
            {mathLabel(lefts[i] ?? '')}
          </text>
        ) : null,
      )}
    </svg>
  );
}

/** 두 줄의 것을 하나씩 짝짓는다. 짝이 없는 것은 테두리만 그린다 */
export function Pairing({ top, bottom, topLabel, bottomLabel, marks, gap = 30 }: { top: number; bottom: number; topLabel?: string; bottomLabel?: string; marks?: string[]; gap?: number }) {
  const n = Math.max(top, bottom);
  const pairs = Math.min(top, bottom);
  const padL = topLabel || bottomLabel ? 44 : 10;
  const W = padL + n * gap + 4;
  const H = 86;
  const x = (i: number) => padL + i * gap + gap / 2;
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {Array.from({ length: pairs }, (_, i) => (
        <line key={`p${i}`} x1={x(i)} x2={x(i)} y1={26} y2={60} className="nf-pair" />
      ))}
      {Array.from({ length: top }, (_, i) => (
        <circle key={`a${i}`} cx={x(i)} cy={18} r={8} fill={i < pairs ? paint(0) : 'none'} stroke={paint(0)} strokeWidth={1.6} />
      ))}
      {Array.from({ length: bottom }, (_, i) =>
        marks ? (
          <g key={`b${i}`}>
            <rect x={x(i) - 10} y={58} width={20} height={20} rx={4} fill={paint(1)} fillOpacity={i < pairs ? 0.2 : 0} stroke={paint(1)} strokeWidth={1.4} />
            <text x={x(i)} y={72.5} textAnchor="middle" className="pl-label">
              {mathLabel(marks[i] ?? '')}
            </text>
          </g>
        ) : (
          <rect key={`b${i}`} x={x(i) - 8} y={60} width={16} height={16} rx={3} fill={i < pairs ? paint(1) : 'none'} stroke={paint(1)} strokeWidth={1.6} />
        ),
      )}
      {topLabel ? (
        <text x={padL - 8} y={22.5} textAnchor="end" className="pl-label">
          {topLabel}
        </text>
      ) : null}
      {bottomLabel ? (
        <text x={padL - 8} y={72.5} textAnchor="end" className="pl-label">
          {bottomLabel}
        </text>
      ) : null}
    </svg>
  );
}

/** 자릿값 블록: 백은 10×10 모눈, 십은 막대, 일은 낱개. n 은 999까지 */
export function Base10({ n, labels = true }: { n: number; labels?: boolean }) {
  const h = Math.floor(n / 100) % 10;
  const t = Math.floor(n / 10) % 10;
  const u = n % 10;
  const s = 3.6; // 낱개 하나의 한 변
  const flat = s * 10;
  const perRow = 5;
  const flatRows = Math.ceil(h / perRow) || 1;
  const flatCols = Math.min(h, perRow);
  const gap = 14;
  const wH = flatCols ? flatCols * (flat + 4) - 4 : 0;
  const wT = t ? t * (s + 3.4) - 3.4 : 0;
  const uCols = Math.ceil(u / 5);
  const wU = u ? uCols * (s + 3.4) - 3.4 : 0;
  const groups = [
    { w: wH, name: `백이 ${h}`, show: h > 0 },
    { w: wT, name: `십이 ${t}`, show: t > 0 },
    { w: wU, name: `일이 ${u}`, show: u > 0 },
  ].filter((g) => g.show);
  const minW = 46; // 이름표가 겹치지 않을 만큼
  let x = 6;
  const xs = groups.map((g) => {
    const at = x;
    x += Math.max(g.w, minW) + gap;
    return at;
  });
  const W = x - gap + 6;
  const bodyH = flatRows * (flat + 4) - 4;
  const H = bodyH + (labels ? 30 : 8);
  const body: ReactNode[] = [];
  groups.forEach((g, gi) => {
    const ox = (xs[gi] ?? 0) + (Math.max(g.w, minW) - g.w) / 2;
    if (g.name.startsWith('백')) {
      for (let i = 0; i < h; i++) {
        const fx = ox + (i % perRow) * (flat + 4);
        const fy = 4 + Math.floor(i / perRow) * (flat + 4);
        body.push(
          <g key={`h${i}`}>
            <rect x={fx} y={fy} width={flat} height={flat} fill={paint(1)} fillOpacity={0.22} stroke={paint(1)} strokeWidth={1.1} />
            {Array.from({ length: 9 }, (_, k) => (
              <path key={k} d={`M${fx + (k + 1) * s},${fy}v${flat}M${fx},${fy + (k + 1) * s}h${flat}`} stroke={paint(1)} strokeWidth={0.45} fill="none" />
            ))}
          </g>,
        );
      }
    } else if (g.name.startsWith('십')) {
      for (let i = 0; i < t; i++) {
        const fx = ox + i * (s + 3.4);
        const fy = 4 + bodyH - flat;
        body.push(
          <g key={`t${i}`}>
            <rect x={fx} y={fy} width={s} height={flat} fill={paint(2)} fillOpacity={0.3} stroke={paint(2)} strokeWidth={1} />
            {Array.from({ length: 9 }, (_, k) => (
              <path key={k} d={`M${fx},${fy + (k + 1) * s}h${s}`} stroke={paint(2)} strokeWidth={0.45} />
            ))}
          </g>,
        );
      }
    } else {
      for (let i = 0; i < u; i++) {
        const fx = ox + Math.floor(i / 5) * (s + 3.4);
        const fy = 4 + bodyH - s - (i % 5) * (s + 3.4);
        body.push(<rect key={`u${i}`} x={fx} y={fy} width={s} height={s} fill={paint(0)} fillOpacity={0.45} stroke={paint(0)} strokeWidth={1} />);
      }
    }
    if (labels) {
      body.push(
        <text key={`n${gi}`} x={(xs[gi] ?? 0) + Math.max(g.w, minW) / 2} y={bodyH + 24} textAnchor="middle" className="pl-label">
          {g.name}
        </text>,
      );
    }
  });
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {body}
    </svg>
  );
}

/**
 * 넓이 모형: 직사각형의 가로와 세로를 조각내어 곱을 조각의 넓이로 나눈다.
 *  - rows, cols: 세로와 가로의 조각 길이. 조각이 너무 가늘어지지 않게 길이를 조금 고르게 그린다(비율이 꼭 맞지는 않는다)
 *  - rowLabels, colLabels: 변에 적는 글(기본은 수). cells: 칸에 적는 글(기본은 곱)
 */
export function AreaModel({
  rows,
  cols,
  rowLabels,
  colLabels,
  cells,
  width = 250,
  height = 132,
}: {
  rows: number[];
  cols: number[];
  rowLabels?: string[];
  colLabels?: string[];
  cells?: (string | undefined)[][];
  width?: number;
  height?: number;
}) {
  const share = (parts: number[], total: number, min: number) => {
    const sum = parts.reduce((a, b) => a + b, 0) || 1;
    const rest = Math.max(0, total - min * parts.length);
    return parts.map((p) => min + (rest * p) / sum);
  };
  const ws = share(cols, width, 46);
  const hs = share(rows, height, 32);
  const padL = 40;
  const padT = 24;
  const W = padL + ws.reduce((a, b) => a + b, 0) + 6;
  const H = padT + hs.reduce((a, b) => a + b, 0) + 6;
  const xs = ws.map((_, j) => padL + ws.slice(0, j).reduce((a, b) => a + b, 0));
  const ys = hs.map((_, i) => padT + hs.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {rows.map((r, i) =>
        cols.map((c, j) => (
          <g key={`${i}-${j}`}>
            <rect x={xs[j]} y={ys[i]} width={ws[j]} height={hs[i]} fill={paint(i * cols.length + j)} fillOpacity={0.17} stroke="currentColor" strokeWidth={1.2} />
            <text x={(xs[j] ?? 0) + (ws[j] ?? 0) / 2} y={(ys[i] ?? 0) + (hs[i] ?? 0) / 2 + 4.5} textAnchor="middle" className="pl-label">
              {mathLabel(cells?.[i]?.[j] ?? String(r * c))}
            </text>
          </g>
        )),
      )}
      {cols.map((c, j) => (
        <text key={`c${j}`} x={(xs[j] ?? 0) + (ws[j] ?? 0) / 2} y={padT - 8} textAnchor="middle" className="pl-label">
          {mathLabel(colLabels?.[j] ?? String(c))}
        </text>
      ))}
      {rows.map((r, i) => (
        <text key={`r${i}`} x={padL - 9} y={(ys[i] ?? 0) + (hs[i] ?? 0) / 2 + 4.5} textAnchor="end" className="pl-label">
          {mathLabel(rowLabels?.[i] ?? String(r))}
        </text>
      ))}
    </svg>
  );
}
