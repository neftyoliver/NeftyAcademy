/**
 * 전자공학 입문의 회로도. 한 줄짜리 글(spec)로 소자를 적으면 SVG로 그린다.
 *
 *   <Circuit spec="V 0,2 0,0 9V; R 0,0 2,0 1kΩ; R 2,0 2,2 2kΩ; W 2,2 0,2; G 0,2" />
 *
 * 소자는 `;`로 나누고, 한 소자는 `종류 x1,y1 x2,y2 이름표` 꼴이다. 좌표는 격자 칸(한 칸 = 80px).
 *  V  전압원(둥근 원, 두 번째 점 쪽이 +)        B  전지(긴 선이 +, 두 번째 점 쪽)
 *  I  전류원(화살표가 첫 점 → 두 번째 점)        R  저항(지그재그)
 *  C  축전기                                     L  인덕터(코일)
 *  W  도선                                       S  열린 스위치
 *  G  땅(점 하나: G x,y)                         D  이음점(점 하나)
 *  O  단자(빈 동그라미, 점 하나, 이름표는 오른쪽, ^로 시작하면 위)    T  글자(T x,y 글)
 *  A  전류 화살표(도선 위에 그리는 표시, 첫 점 → 두 번째 점, 이름표 가능)
 *  K  다이오드(첫 점 → 두 번째 점이 순방향)      E  LED(다이오드 + 빛 화살표)
 *  Q  NPN 트랜지스터(첫 점이 컬렉터, 두 번째 점이 이미터). 베이스는 가운데에서 옆으로 반 칸 나온다.
 *     위에서 아래로 그리면 왼쪽, 아래에서 위로 그리면 오른쪽이다
 *  M  N채널 MOSFET(첫 점이 드레인, 두 번째 점이 소스). 게이트가 나오는 쪽은 Q와 같다
 *  U  연산 증폭기(첫 점이 − 입력, 두 번째 점이 출력). + 입력은 출력의 높이를 사이에 두고 맞은편에 있다.
 *     이름표가 +로 시작하면 첫 점이 + 입력이 된다
 */

type Pt = [number, number];
type Part = { kind: string; a: Pt; b: Pt; label: string };

const U = 80;
const PAD = 40;
const PADX = 96; // 세로 소자의 이름표가 오른쪽에 들어갈 자리

function parse(spec: string): Part[] {
  const parts: Part[] = [];
  for (const raw of spec.split(';')) {
    const s = raw.trim();
    if (!s) continue;
    const m = s.match(/^([A-Z])\s+(-?[\d.]+),(-?[\d.]+)(?:\s+(-?[\d.]+),(-?[\d.]+))?\s*(.*)$/);
    if (!m) continue;
    const a: Pt = [Number(m[2]), Number(m[3])];
    const b: Pt = m[4] !== undefined ? [Number(m[4]), Number(m[5])] : a;
    parts.push({ kind: m[1]!, a, b, label: (m[6] ?? '').trim() });
  }
  return parts;
}

/** 소자 몸통: 길이 len인 가로 소자를 (0,0)~(len,0)에 그린다. 나중에 회전한다. */
function body(kind: string, len: number) {
  const mid = len / 2;
  const sw = 2;
  const lead = (h: number) => (
    <>
      <line x1={0} y1={0} x2={mid - h} y2={0} />
      <line x1={mid + h} y1={0} x2={len} y2={0} />
    </>
  );
  switch (kind) {
    case 'R': {
      const h = 24;
      const n = 6;
      let d = `M${mid - h} 0`;
      for (let i = 0; i < n; i++) d += `L${mid - h + ((i + 0.5) * 2 * h) / n} ${i % 2 ? 8 : -8}`;
      d += `L${mid + h} 0`;
      return (
        <>
          {lead(h)}
          <path d={d} fill="none" strokeWidth={sw} strokeLinejoin="round" />
        </>
      );
    }
    case 'V':
      return (
        <>
          {lead(16)}
          <circle cx={mid} cy={0} r={16} fill="var(--bf-paper)" />
        </>
      );
    case 'B':
      return (
        <>
          {lead(5)}
          <line x1={mid - 5} y1={-8} x2={mid - 5} y2={8} strokeWidth={3} />
          <line x1={mid + 5} y1={-16} x2={mid + 5} y2={16} />
        </>
      );
    case 'I':
      return (
        <>
          {lead(16)}
          <circle cx={mid} cy={0} r={16} fill="var(--bf-paper)" />
          <line x1={mid - 9} y1={0} x2={mid + 7} y2={0} />
          <path d={`M${mid + 9} 0L${mid + 2} -5L${mid + 2} 5Z`} fill="currentColor" />
        </>
      );
    case 'C':
      return (
        <>
          {lead(5)}
          <line x1={mid - 5} y1={-14} x2={mid - 5} y2={14} />
          <line x1={mid + 5} y1={-14} x2={mid + 5} y2={14} />
        </>
      );
    case 'L': {
      const h = 24;
      let d = `M${mid - h} 0`;
      for (let i = 0; i < 4; i++) d += `a6 7 0 0 1 12 0`;
      return (
        <>
          {lead(h)}
          <path d={d} fill="none" />
        </>
      );
    }
    case 'S':
      return (
        <>
          {lead(14)}
          <circle cx={mid - 14} cy={0} r={2.5} fill="currentColor" />
          <circle cx={mid + 14} cy={0} r={2.5} fill="currentColor" />
          <line x1={mid - 14} y1={0} x2={mid + 12} y2={-13} />
        </>
      );
    case 'K':
    case 'E':
      return (
        <>
          {lead(10)}
          <path d={`M${mid - 10} -11L${mid + 10} 0L${mid - 10} 11Z`} fill="var(--bf-paper)" />
          <line x1={mid + 10} y1={-11} x2={mid + 10} y2={11} />
          {kind === 'E' && (
            <g strokeWidth={1.5}>
              <line x1={mid - 2} y1={14} x2={mid + 6} y2={24} />
              <path d={`M${mid + 7} 26L${mid + 1} 23L${mid + 5} 19Z`} fill="currentColor" stroke="none" />
              <line x1={mid + 5} y1={12} x2={mid + 13} y2={22} />
              <path d={`M${mid + 14} 24L${mid + 8} 21L${mid + 12} 17Z`} fill="currentColor" stroke="none" />
            </g>
          )}
        </>
      );
    case 'A':
      return <path d={`M${mid + 7} 0L${mid - 5} -6L${mid - 5} 6Z`} fill="currentColor" stroke="none" />;
    case 'Q':
      // 컬렉터(왼쪽)와 이미터(오른쪽)가 축 위에 있고, 베이스의 막대는 축에서 12 떨어져 있다. 베이스 선은 반 칸(40)까지 나간다
      return (
        <>
          <line x1={0} y1={0} x2={mid - 16} y2={0} />
          <line x1={mid + 16} y1={0} x2={len} y2={0} />
          <line x1={mid - 16} y1={0} x2={mid - 6} y2={12} />
          <line x1={mid + 6} y1={12} x2={mid + 16} y2={0} />
          <line x1={mid - 13} y1={12} x2={mid + 13} y2={12} strokeWidth={3} />
          <line x1={mid} y1={12} x2={mid} y2={40} />
          <path d={`M${mid + 16} 0L${mid + 7.8} 3.6L${mid + 13.9} 8.7Z`} fill="currentColor" stroke="none" />
        </>
      );
    case 'M':
      // 드레인(왼쪽)과 소스(오른쪽). 채널의 막대는 축에서 12, 게이트의 막대는 18 떨어져 있다
      return (
        <>
          <line x1={0} y1={0} x2={mid - 11} y2={0} />
          <line x1={mid + 11} y1={0} x2={len} y2={0} />
          <line x1={mid - 11} y1={0} x2={mid - 11} y2={12} />
          <line x1={mid + 11} y1={0} x2={mid + 11} y2={12} />
          <line x1={mid - 15} y1={12} x2={mid + 15} y2={12} strokeWidth={3} />
          <line x1={mid - 13} y1={18} x2={mid + 13} y2={18} />
          <line x1={mid} y1={18} x2={mid} y2={40} />
          <path d={`M${mid + 11} 1L${mid + 7} 9L${mid + 15} 9Z`} fill="currentColor" stroke="none" />
        </>
      );
    default:
      return <line x1={0} y1={0} x2={len} y2={0} />;
  }
}

export function Circuit({ spec, label = '회로도', width }: { spec: string; label?: string; width?: number }) {
  const parts = parse(spec);
  const pts = parts.flatMap((p): Pt[] => {
    if (p.kind === 'U') return [p.a, p.b, [p.a[0], 2 * p.b[1] - p.a[1]]];
    if (p.kind === 'Q' || p.kind === 'M') {
      // 가운데에서 진행 방향의 왼쪽(화면에서는 오른손 쪽)으로 반 칸
      const dx = p.b[0] - p.a[0];
      const dy = p.b[1] - p.a[1];
      const n = Math.hypot(dx, dy) || 1;
      return [p.a, p.b, [(p.a[0] + p.b[0]) / 2 - (dy / n) * 0.5, (p.a[1] + p.b[1]) / 2 + (dx / n) * 0.5]];
    }
    return [p.a, p.b];
  });
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = (Math.max(...xs) - minX) * U + PADX * 2;
  const h = (Math.max(...ys) - minY) * U + PAD * 2;
  const X = (p: Pt) => (p[0] - minX) * U + PADX;
  const Y = (p: Pt) => (p[1] - minY) * U + PAD;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={width ?? w} style={{ maxWidth: '100%', height: 'auto' }} role="img" aria-label={label}>
      <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round">
        {parts.map((p, i) => {
          const x1 = X(p.a);
          const y1 = Y(p.a);
          if (p.kind === 'G') {
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x1} y2={y1 + 12} />
                <line x1={x1 - 12} y1={y1 + 12} x2={x1 + 12} y2={y1 + 12} />
                <line x1={x1 - 7} y1={y1 + 17} x2={x1 + 7} y2={y1 + 17} />
                <line x1={x1 - 2} y1={y1 + 22} x2={x1 + 2} y2={y1 + 22} />
              </g>
            );
          }
          if (p.kind === 'D') return <circle key={i} cx={x1} cy={y1} r={4} fill="currentColor" stroke="none" />;
          if (p.kind === 'O') {
            return (
              <g key={i}>
                <circle cx={x1} cy={y1} r={5} fill="var(--bf-paper)" />
                {p.label && (p.label.startsWith('^') ? (
                  <text x={x1} y={y1 - 14} fontSize={15} textAnchor="middle" stroke="none" fill="currentColor">
                    {p.label.slice(1)}
                  </text>
                ) : (
                  <text x={x1 + 11} y={y1} fontSize={15} textAnchor="start" dominantBaseline="central" stroke="none" fill="currentColor">
                    {p.label}
                  </text>
                ))}
              </g>
            );
          }
          if (p.kind === 'T') {
            return (
              <text key={i} x={x1} y={y1} fontSize={15} textAnchor="middle" dominantBaseline="central" stroke="none" fill="currentColor">
                {p.label}
              </text>
            );
          }
          if (p.kind === 'U') {
            const xo = X(p.b);
            const yo = Y(p.b);
            const yOther = 2 * yo - y1;
            const plusFirst = p.label.startsWith('+');
            const name = plusFirst ? p.label.slice(1) : p.label;
            const top = Math.min(y1, yOther) - 16;
            const bot = Math.max(y1, yOther) + 16;
            const sign = (yy: number, t: string) => (
              <text x={x1 + 26} y={yy} fontSize={14} textAnchor="middle" dominantBaseline="central" stroke="none" fill="currentColor">
                {t}
              </text>
            );
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x1 + 16} y2={y1} />
                <line x1={x1} y1={yOther} x2={x1 + 16} y2={yOther} />
                <line x1={xo - 16} y1={yo} x2={xo} y2={yo} />
                <path d={`M${x1 + 16} ${top}L${xo - 16} ${yo}L${x1 + 16} ${bot}Z`} fill="var(--bf-paper)" strokeLinejoin="round" />
                {sign(y1, plusFirst ? '+' : '−')}
                {sign(yOther, plusFirst ? '−' : '+')}
                {name && (
                  <text x={x1 + 16 + (xo - x1 - 32) * 0.4} y={yo} fontSize={13} textAnchor="middle" dominantBaseline="central" stroke="none" fill="currentColor">
                    {name}
                  </text>
                )}
              </g>
            );
          }
          const x2 = X(p.b);
          const y2 = Y(p.b);
          const len = Math.hypot(x2 - x1, y2 - y1);
          const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
          // 이름표: 가로 소자는 위에, 세로 소자는 오른쪽에
          const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const off = p.kind === 'A' ? 14 : 26;
          return (
            <g key={i}>
              <g transform={`translate(${x1} ${y1}) rotate(${ang})`}>{body(p.kind, len)}</g>
              {p.kind === 'V' &&
                ([['+', 7], ['−', -7]] as const).map(([sym, d]) => (
                  <text
                    key={sym}
                    x={mx + ((x2 - x1) / len) * d}
                    y={my + ((y2 - y1) / len) * d}
                    fontSize={13}
                    textAnchor="middle"
                    dominantBaseline="central"
                    stroke="none"
                    fill="currentColor"
                  >
                    {sym}
                  </text>
                ))}
              {p.label && p.kind !== 'W' && (
                <text
                  x={vertical ? mx + off : mx}
                  y={vertical ? my : my - off}
                  fontSize={15}
                  textAnchor={vertical ? 'start' : 'middle'}
                  dominantBaseline="central"
                  stroke="none"
                  fill="currentColor"
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
