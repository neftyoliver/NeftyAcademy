/**
 * `ls -l` 맨 앞의 열 글자(-rwxr-xr--)를 풀어 주는 그림.
 * 글자를 칸에 하나씩 놓고 묶음마다 꺾쇠와 줄로 설명을 잇는다. 글꼴의 폭에 기대지 않으므로 어느 화면에서도 줄이 맞는다.
 *
 *   <Permissions mode="-rwxr-xr--" rest="1 nefty nefty  120  run.sh" />
 */
const CW = 21; // 글자 한 칸의 폭
const X0 = 18;
const TEXT_Y = 34;
const BRACKET_Y = 46;
const ROW_H = 27;
const FIRST_ROW = 80;

const WHAT: Record<string, string> = { r: '읽기', w: '쓰기', x: '실행' };

/** 'r-x' → '읽기·실행', 'r--' → '읽기만', '---' → '아무것도 못 함' */
function describe(bits: string): string {
  const can = [...bits].map((b) => WHAT[b]).filter((v): v is string => Boolean(v));
  if (can.length === 0) return '아무것도 못 함';
  if (can.length === 1) return `${can[0]}만`;
  return can.join('·');
}

export function Permissions({ mode, rest }: { mode: string; rest?: string }) {
  const chars = [...mode.padEnd(10, '-').slice(0, 10)];
  const left = (i: number) => X0 + i * CW;
  const mid = (i: number) => left(i) + CW / 2;
  // 뒤에서부터 한 줄씩: 나머지, 그룹, 주인, 종류
  const groups = [
    { from: 7, to: 9, label: `나머지: ${describe(mode.slice(7, 10))}` },
    { from: 4, to: 6, label: `그룹: ${describe(mode.slice(4, 7))}` },
    { from: 1, to: 3, label: `주인: ${describe(mode.slice(1, 4))}` },
    { from: 0, to: 0, label: '종류: - 파일, d 폴더, l 링크' },
  ];
  // 종류의 글자(-, d, l)는 고정폭 글꼴로: 보통 글꼴에서는 소문자 l 이 대문자 I 와 헷갈린다
  const kinds = (
    <>
      종류: <tspan className="perm-mono">-</tspan> 파일, <tspan className="perm-mono">d</tspan> 폴더, <tspan className="perm-mono">l</tspan> 링크
    </>
  );
  const height = FIRST_ROW + (groups.length - 1) * ROW_H + 16;
  return (
    <svg className="perm" viewBox={`0 0 520 ${height}`} style={{ maxWidth: 520 }} role="img" aria-label={`${mode} 의 뜻`}>
      {/* 묶음의 바탕 */}
      {groups.map((g, k) => (
        <rect key={`b${g.from}`} className={`perm-box perm-box-${k % 2}`} x={left(g.from) + 1.5} y={TEXT_Y - 22} width={(g.to - g.from + 1) * CW - 3} height={30} rx="5" />
      ))}
      {chars.map((c, i) => (
        <text key={i} className="perm-char" x={mid(i)} y={TEXT_Y}>
          {c}
        </text>
      ))}
      {rest ? (
        <text className="perm-rest" x={left(10) + 14} y={TEXT_Y - 1} xmlSpace="preserve">
          {rest}
        </text>
      ) : null}
      {groups.map((g, k) => {
        const y = FIRST_ROW + k * ROW_H; // 설명 글의 높이
        const stem = (mid(g.from) + mid(g.to)) / 2;
        const bracket = g.from === g.to ? `M${stem} ${BRACKET_Y - 4}` : `M${left(g.from) + 4} ${BRACKET_Y - 4} V${BRACKET_Y} H${left(g.to) + CW - 4} V${BRACKET_Y - 4} M${stem} ${BRACKET_Y}`;
        return (
          <g key={`g${g.from}`}>
            <path className="perm-line" d={`${bracket} V${y - 4 - 6} Q${stem} ${y - 4} ${stem + 6} ${y - 4} H${stem + 16}`} />
            <text className="perm-label" x={stem + 22} y={y}>
              {g.from === 0 ? kinds : g.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
