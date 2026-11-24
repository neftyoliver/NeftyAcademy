/**
 * 수를 눈으로 보는 그림들. 점의 배열, 짝짓기, 자릿값 블록, 넓이 모형.
 *
 *   <DotGrid rows={3} cols={4} />                         점 3줄 4칸
 *   <DotGrid rows={3} cols={7} cutCol={4} top={['4', '3']} left="3" />     세로로 갈라 색을 나눈다(분배법칙)
 *   <Pairing top={5} bottom={4} topLabel="컵" bottomLabel="받침" />        하나씩 짝짓기. 남는 것이 보인다
 *   <Pairing top={5} bottom={5} marks={['1', '2', '3', '4', '5']} />      아래 칸에 글자를 적는다(세기). tops 는 위 칸의 글자
 *   <Nest sets={[{ label: 'ℕ', items: ['1', '2'] }, { label: 'ℤ', items: ['0', '−1'] }]} />   안쪽부터 적는 겹친 모임
 *   <Base10 n={347} />                                    백 모눈 3, 십 막대 4, 낱개 7
 *   <AreaModel rows={[10, 4]} cols={[20, 3]} />           직사각형을 갈라 곱을 나눠 셈하기
 *   <FigRow>…</FigRow>                                    그림 여럿을 옆으로 나란히(좁으면 아래로 내려간다)
 *   <DotGrid rows={3} cols={5} extra={2} />                5개씩 3줄을 채우고 2개가 남는다(몫과 나머지)
 *   <Pairs n={7} />                                       둘씩 짝지은 점. 홀수면 하나가 남는다
 *   <Checker removed={[[0, 0], [7, 7]]} />                체스판. 뗀 칸은 점선으로
 *   <Sieve />                                             에라토스테네스의 체(1부터 100까지)
 *   <FactorTree n={360} />                                소인수분해 나무. splits 로 쪼개는 방법을 고른다
 *   <EuclidRect a={21} b={15} />                          직사각형을 정사각형으로 채워 가는 호제법
 *   <FracBar parts={4} shade={3} label="3/4" />           넷으로 나눈 띠에서 셋을 칠한다. 여럿을 이어 쓰면 아래로 쌓인다
 *   <FracBar parts={4} shade={7} wholes={2} />            1보다 큰 분수는 띠를 여럿 놓는다
 *   <FracArea rows={[2, 3]} cols={[4, 5]} />              분수의 곱: 정사각형을 가로세로로 나눠 겹치는 곳을 본다
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
 *  - extra: 줄을 다 채우고 남은 점의 수. 아래에 한 줄 띄워 다른 색으로 그린다(나머지)
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
  extra = 0,
}: {
  rows: number;
  cols: number;
  extra?: number;
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
  const H = padT + (rows + (extra ? 1 : 0)) * cell + (extra ? 6 : 0) + 4;
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
  // 묶고 남은 것: 한 줄 띄워 다른 색으로
  for (let c = 0; c < extra; c++) {
    marks.push(<circle key={`x${c}`} cx={padL + c * cell + cell / 2} cy={padT + rows * cell + 6 + cell / 2} r={cell * 0.3} fill={paint(color + 1)} />);
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
export function Pairing({ top, bottom, topLabel, bottomLabel, marks, tops, gap = 30 }: { top: number; bottom: number; topLabel?: string; bottomLabel?: string; marks?: string[]; tops?: string[]; gap?: number }) {
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
      {Array.from({ length: top }, (_, i) =>
        tops ? (
          <g key={`a${i}`}>
            <rect x={x(i) - 12} y={6} width={24} height={20} rx={10} fill={paint(0)} fillOpacity={i < pairs ? 0.2 : 0} stroke={paint(0)} strokeWidth={1.4} />
            <text x={x(i)} y={20.5} textAnchor="middle" className="pl-label">
              {mathLabel(tops[i] ?? '')}
            </text>
          </g>
        ) : (
          <circle key={`a${i}`} cx={x(i)} cy={18} r={8} fill={i < pairs ? paint(0) : 'none'} stroke={paint(0)} strokeWidth={1.6} />
        ),
      )}
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

/** 점 n개를 둘씩 짝짓는다. 홀수면 짝 없는 점 하나가 남는다 */
export function Pairs({ n, cell = 22 }: { n: number; cell?: number }) {
  const cols = Math.ceil(n / 2);
  const W = cols * cell + 8;
  const H = 2 * cell + 8;
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {Array.from({ length: cols }, (_, c) => {
        const single = n % 2 === 1 && c === cols - 1;
        const x = 4 + c * cell;
        return (
          <g key={c}>
            {single ? null : <rect x={x + 2} y={6} width={cell - 4} height={2 * cell - 4} rx={(cell - 4) / 2} className="nf-pairbox" />}
            <circle cx={x + cell / 2} cy={4 + cell / 2} r={cell * 0.27} fill={paint(single ? 0 : 1)} />
            {single ? null : <circle cx={x + cell / 2} cy={4 + cell * 1.5} r={cell * 0.27} fill={paint(1)} />}
          </g>
        );
      })}
    </svg>
  );
}

/** 체스판. removed 의 [줄, 칸](0부터, 왼쪽 위가 [0, 0])은 떼어 낸 칸으로 그린다 */
export function Checker({ size = 8, removed = [], cell = 24 }: { size?: number; removed?: [number, number][]; cell?: number }) {
  const W = size * cell + 8;
  const gone = (r: number, c: number) => removed.some(([rr, cc]) => rr === r && cc === c);
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${W}`} width={W} role="img">
      {Array.from({ length: size * size }, (_, i) => {
        const r = Math.floor(i / size);
        const c = i % size;
        const x = 4 + c * cell;
        const y = 4 + r * cell;
        if (gone(r, c)) return <rect key={i} x={x + 2} y={y + 2} width={cell - 4} height={cell - 4} className="nf-gone" />;
        return <rect key={i} x={x} y={y} width={cell} height={cell} className={(r + c) % 2 ? 'nf-dark' : 'nf-light'} />;
      })}
    </svg>
  );
}

function smallestPrime(v: number): number {
  for (let p = 2; p * p <= v; p++) if (v % p === 0) return p;
  return v;
}

/** 에라토스테네스의 체. 소수는 굵은 글자와 테두리로, 합성수는 가장 작은 소인수의 색으로 칠한다 */
export function Sieve({ n = 100, cols = 10, cell = 28 }: { n?: number; cols?: number; cell?: number }) {
  const rows = Math.ceil(n / cols);
  const W = cols * cell + 8;
  const legend = [2, 3, 5, 7];
  const H = rows * cell + 8 + 26;
  const colorOf = (p: number) => (p === 2 ? paint(1) : p === 3 ? paint(2) : p === 5 ? paint(0) : p === 7 ? paint(3) : 'currentColor');
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {Array.from({ length: n }, (_, i) => {
        const v = i + 1;
        const x = 4 + (i % cols) * cell;
        const y = 4 + Math.floor(i / cols) * cell;
        const p = v === 1 ? 0 : smallestPrime(v);
        const prime = v > 1 && p === v;
        return (
          <g key={v}>
            <rect x={x + 1} y={y + 1} width={cell - 2} height={cell - 2} rx={4} fill={v === 1 || prime ? 'none' : colorOf(p)} fillOpacity={0.2} stroke={prime ? 'currentColor' : 'none'} strokeWidth={1.3} />
            <text x={x + cell / 2} y={y + cell / 2 + 4.3} textAnchor="middle" className={prime ? 'nf-prime' : 'nf-comp'}>
              {v}
            </text>
          </g>
        );
      })}
      {legend.map((p, i) => (
        <g key={`l${p}`}>
          <rect x={6 + i * 68} y={rows * cell + 14} width={12} height={12} rx={3} fill={colorOf(p)} fillOpacity={0.3} />
          <text x={22 + i * 68} y={rows * cell + 24.5} className="nf-legend">{`${p}의 배수`}</text>
        </g>
      ))}
    </svg>
  );
}

interface TreeNode {
  v: number;
  kids?: [TreeNode, TreeNode];
  x: number;
  depth: number;
}

/**
 * 소인수분해 나무. 합성수는 두 수의 곱으로 쪼개고, 소수는 동그라미를 친다.
 *  - splits: 쪼개는 방법을 고른다. { 360: [36, 10] } 이면 360을 36 × 10 으로 쪼갠다. 적지 않은 수는 가장 작은 소인수로 쪼갠다
 */
export function FactorTree({ n, splits = {}, gap = 34 }: { n: number; splits?: Record<number, [number, number]>; gap?: number }) {
  let leaf = 0;
  let deepest = 0;
  const build = (v: number, depth: number): TreeNode => {
    deepest = Math.max(deepest, depth);
    const p = smallestPrime(v);
    if (p === v) return { v, x: leaf++, depth };
    const [a, b] = splits[v] ?? [p, v / p];
    const kids: [TreeNode, TreeNode] = [build(a, depth + 1), build(b, depth + 1)];
    return { v, kids, x: (kids[0].x + kids[1].x) / 2, depth };
  };
  const root = build(n, 0);
  const level = 40;
  const W = Math.max(leaf, 2) * gap + 16;
  const H = (deepest + 1) * level + 8;
  const px = (node: TreeNode) => 8 + gap / 2 + node.x * gap;
  const py = (node: TreeNode) => 20 + node.depth * level;
  const lines: ReactNode[] = [];
  const nodes: ReactNode[] = [];
  const walk = (node: TreeNode) => {
    const key = `${node.v}-${node.x}-${node.depth}`;
    if (node.kids) {
      for (const kid of node.kids) {
        lines.push(<line key={`l${key}-${kid.x}`} x1={px(node)} y1={py(node) + 8} x2={px(kid)} y2={py(kid) - 13} className="nf-branch" />);
        walk(kid);
      }
      nodes.push(
        <text key={`n${key}`} x={px(node)} y={py(node) + 4.5} textAnchor="middle" className="nf-comp-node">
          {node.v}
        </text>,
      );
    } else {
      nodes.push(
        <g key={`n${key}`}>
          <circle cx={px(node)} cy={py(node)} r={12.5} fill={paint(0)} fillOpacity={0.16} stroke={paint(0)} strokeWidth={1.4} />
          <text x={px(node)} y={py(node) + 4.5} textAnchor="middle" className="nf-prime">
            {node.v}
          </text>
        </g>,
      );
    }
  };
  walk(root);
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {lines}
      {nodes}
    </svg>
  );
}

/** 가로 a, 세로 b 인 직사각형을 넣을 수 있는 가장 큰 정사각형으로 거듭 채운다(유클리드 호제법). 마지막 정사각형의 변이 최대공약수다 */
export function EuclidRect({ a, b, width = 252 }: { a: number; b: number; width?: number }) {
  const unit = Math.min(14, width / a);
  const padL = 26;
  const padT = 22;
  const squares: { x: number; y: number; s: number; step: number }[] = [];
  let x = 0;
  let y = 0;
  let w = a;
  let h = b;
  let step = 0;
  while (w > 0 && h > 0) {
    if (w >= h) {
      const k = Math.floor(w / h);
      for (let i = 0; i < k; i++) squares.push({ x: x + i * h, y, s: h, step });
      x += k * h;
      w -= k * h;
    } else {
      const k = Math.floor(h / w);
      for (let i = 0; i < k; i++) squares.push({ x, y: y + i * w, s: w, step });
      y += k * w;
      h -= k * w;
    }
    step++;
  }
  const W = padL + a * unit + 6;
  const H = padT + b * unit + 6;
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {squares.map((q, i) => (
        <g key={i}>
          <rect x={padL + q.x * unit} y={padT + q.y * unit} width={q.s * unit} height={q.s * unit} fill={paint(q.step + 1)} fillOpacity={0.2} stroke="currentColor" strokeWidth={1.1} />
          {q.s * unit >= 17 ? (
            <text x={padL + (q.x + q.s / 2) * unit} y={padT + (q.y + q.s / 2) * unit + 4.5} textAnchor="middle" className="pl-label">
              {mathLabel(String(q.s))}
            </text>
          ) : null}
        </g>
      ))}
      <text x={padL + (a * unit) / 2} y={padT - 7} textAnchor="middle" className="pl-label">
        {mathLabel(String(a))}
      </text>
      <text x={padL - 8} y={padT + (b * unit) / 2 + 4.5} textAnchor="end" className="pl-label">
        {mathLabel(String(b))}
      </text>
    </svg>
  );
}

/**
 * 분수의 띠. 띠 하나가 1이다. parts 조각으로 나누고 왼쪽부터 shade 조각을 칠한다.
 *  - wholes: 띠의 수(1보다 큰 분수). sub: 조각 하나를 다시 몇으로 잘게 나누는지(점선)
 *  - label: 오른쪽에 적는 글. 3/4 처럼 적는다
 */
export function FracBar({ parts, shade, wholes = 1, sub = 1, label, color = 0, width = 236 }: { parts: number; shade: number; wholes?: number; sub?: number; label?: string; color?: number; width?: number }) {
  const gap = 8;
  const bar = (width - gap * (wholes - 1)) / wholes;
  const piece = bar / parts;
  const h = 26;
  const W = width + 4 + (label ? 52 : 0);
  const body: ReactNode[] = [];
  for (let w = 0; w < wholes; w++) {
    const ox = 2 + w * (bar + gap);
    for (let i = 0; i < parts; i++) {
      const on = w * parts + i < shade;
      body.push(<rect key={`${w}-${i}`} x={ox + i * piece} y={3} width={piece} height={h} fill={on ? paint(color) : 'none'} fillOpacity={0.34} stroke="currentColor" strokeWidth={1.1} />);
      for (let k = 1; k < sub; k++) body.push(<line key={`${w}-${i}-${k}`} x1={ox + i * piece + (k * piece) / sub} x2={ox + i * piece + (k * piece) / sub} y1={3} y2={3 + h} className="nf-cut" />);
    }
  }
  return (
    <svg className="pl nf nf-bar" viewBox={`0 0 ${W} ${h + 6}`} width={W} role="img">
      {body}
      {label ? (
        <text x={width + 12} y={3 + h / 2 + 4.5} className="pl-label">
          {mathLabel(label)}
        </text>
      ) : null}
    </svg>
  );
}

/**
 * 분수의 곱을 넓이로. 한 변이 1인 정사각형을 세로로 rows[1]줄, 가로로 cols[1]칸으로 나누고,
 * 위에서 rows[0]줄과 왼쪽에서 cols[0]칸을 칠한다. 둘이 겹치는 곳이 곱이다.
 */
export function FracArea({ rows, cols, size = 150 }: { rows: [number, number]; cols: [number, number]; size?: number }) {
  const [rn, rd] = rows;
  const [cn, cd] = cols;
  const padL = 40;
  const padT = 24;
  const cw = size / cd;
  const ch = size / rd;
  const W = padL + size + 6;
  const H = padT + size + 6;
  const cells: ReactNode[] = [];
  for (let r = 0; r < rd; r++) {
    for (let c = 0; c < cd; c++) {
      const inRow = r < rn;
      const inCol = c < cn;
      const fill = inRow && inCol ? paint(3) : inRow ? paint(1) : inCol ? paint(0) : 'none';
      cells.push(<rect key={`${r}-${c}`} x={padL + c * cw} y={padT + r * ch} width={cw} height={ch} fill={fill} fillOpacity={inRow && inCol ? 0.5 : 0.16} stroke="currentColor" strokeWidth={0.9} />);
    }
  }
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {cells}
      <rect x={padL} y={padT} width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <text x={padL + (cn * cw) / 2} y={padT - 8} textAnchor="middle" className="pl-label" style={{ fill: paint(0) }}>
        {mathLabel(`${cn}/${cd}`)}
      </text>
      <text x={padL - 8} y={padT + (rn * ch) / 2 + 4.5} textAnchor="end" className="pl-label" style={{ fill: paint(1) }}>
        {mathLabel(`${rn}/${rd}`)}
      </text>
    </svg>
  );
}

/**
 * 겹쳐 있는 모임. sets 는 가장 안쪽 것부터 적는다. 모임마다 이름(label)과, 그 모임에서 처음 나오는 수(items)를 적는다.
 * 안쪽 모임의 수는 바깥 모임에도 든다는 것이 상자의 겹침으로 보인다.
 */
export function Nest({ sets, band = 58 }: { sets: { label: string; items: string[] }[]; band?: number }) {
  const n = sets.length;
  const m = 7; // 상자 사이의 틈
  const head = 20; // 이름 줄의 높이
  const line = 19; // 수 한 줄의 높이
  const rowsMax = Math.max(...sets.map((s) => s.items.length), 1);
  const innerW = band + 6;
  const innerH = head + rowsMax * line + 6;
  const W = 2 + (n - 1) * m + innerW + (n - 1) * (band + m) + 2;
  const H = 2 + (n - 1) * (m + head) + innerH + (n - 1) * m + 2;
  const body: ReactNode[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const k = n - 1 - i; // 바깥에서 몇 번째인가
    const left = 2 + k * m;
    const top = 2 + k * (m + head);
    const right = 2 + (n - 1) * m + innerW + i * (band + m);
    const bottom = 2 + (n - 1) * (m + head) + innerH + i * m;
    const set = sets[i];
    if (!set) continue;
    body.push(<rect key={`r${i}`} x={left} y={top} width={right - left} height={bottom - top} rx={9} fill={paint(i)} fillOpacity={0.09} stroke={paint(i)} strokeWidth={1.4} />);
    body.push(
      <text key={`l${i}`} x={left + 9} y={top + 15} className="pl-label nf-setname" style={{ fill: paint(i) }}>
        {set.label}
      </text>,
    );
    // 이 모임에서 처음 나오는 수: 안쪽 상자의 오른쪽 띠(가장 안쪽은 상자 안)에 세로로 적는다
    const cx = i === 0 ? left + innerW / 2 : right - (band + m) / 2;
    const baseY = 2 + (n - 1) * (m + head) + head + 13;
    set.items.forEach((item, j) => {
      body.push(
        <text key={`i${i}-${j}`} x={cx} y={baseY + j * line} textAnchor="middle" className="pl-label">
          {mathLabel(item)}
        </text>,
      );
    });
  }
  return (
    <svg className="pl nf" viewBox={`0 0 ${W} ${H}`} width={W} role="img">
      {body}
    </svg>
  );
}
