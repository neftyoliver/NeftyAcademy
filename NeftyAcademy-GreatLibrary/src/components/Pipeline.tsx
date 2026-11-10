/** 0강 그림: 소스 파일이 실행 파일이 되기까지. 단계를 누르면 그 단계의 명령과 설명이 아래에 뜬다. */
import { useState } from 'react';

const STAGES = [
  { file: 'hello.c', tool: '', cmd: '', note: '사람이 쓴 C 소스.' },
  { file: 'hello.i', tool: '전처리', cmd: 'gcc -E hello.c -o hello.i', note: '#include를 펼치고 #define을 바꿔 넣은, 여전히 C인 글.' },
  { file: 'hello.s', tool: '컴파일', cmd: 'gcc -S hello.i -o hello.s', note: 'CPU 명령을 글자로 적은 어셈블리.' },
  { file: 'hello.o', tool: '어셈블', cmd: 'gcc -c hello.s -o hello.o', note: '기계어 조각(목적 파일). printf 같은 남의 함수는 아직 "빈칸".' },
  { file: 'hello', tool: '링크', cmd: 'gcc hello.o -o hello', note: '빈칸을 libc 등과 이어 붙인 실행 파일.' },
];

export function Pipeline() {
  const [sel, setSel] = useState(4);
  const W = 128;
  const GAP = 34;
  const width = STAGES.length * W + (STAGES.length - 1) * GAP;
  const s = STAGES[sel]!;
  return (
    <div>
      <svg viewBox={`0 0 ${width} 92`} width={width} role="img" aria-label="전처리, 컴파일, 어셈블, 링크 네 단계">
        <defs>
          <marker id="pl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="currentColor" />
          </marker>
        </defs>
        {STAGES.map((st, i) => {
          const x = i * (W + GAP);
          const on = i === sel;
          return (
            <g key={st.file} style={{ cursor: 'pointer' }} onClick={() => setSel(i)}>
              {i > 0 && (
                <>
                  <line x1={x - GAP + 2} y1={58} x2={x - 3} y2={58} stroke="currentColor" strokeWidth={1.5} markerEnd="url(#pl-arrow)" opacity={0.6} />
                  <text x={x - GAP / 2} y={22} textAnchor="middle" fontSize={12} fill="currentColor" opacity={i <= sel ? 1 : 0.45}>
                    {st.tool}
                  </text>
                </>
              )}
              <rect
                x={x}
                y={36}
                width={W}
                height={44}
                rx={9}
                fill={on ? 'var(--node)' : 'transparent'}
                stroke="var(--node)"
                strokeWidth={1.8}
                opacity={i <= sel ? 1 : 0.45}
              />
              <text x={x + W / 2} y={63} textAnchor="middle" fontSize={15} fontFamily="var(--bf-mono)" fill={on ? '#fff' : 'currentColor'}>
                {st.file}
              </text>
            </g>
          );
        })}
      </svg>
      <p style={{ margin: '12px 0 0', textAlign: 'center' }}>
        {s.cmd ? <code>{s.cmd}</code> : <em>시작점</em>} — {s.note}
      </p>
    </div>
  );
}
