/**
 * 튜링 기계 한 대. 테이프에 적힌 2진수에 1을 더한다.
 * 규칙표에서 "지금 상태 + 읽은 글자"에 맞는 줄 하나를 찾아 쓰고, 옮기고, 상태를 바꾸는 일만 되풀이한다.
 */
import { useState } from 'react';

type Sym = '0' | '1' | ' ';
type State = 'seek' | 'carry' | 'halt';

interface Rule {
  state: State;
  read: Sym;
  write: Sym;
  move: -1 | 0 | 1;
  next: State;
}

const RULES: Rule[] = [
  { state: 'seek', read: '0', write: '0', move: 1, next: 'seek' },
  { state: 'seek', read: '1', write: '1', move: 1, next: 'seek' },
  { state: 'seek', read: ' ', write: ' ', move: -1, next: 'carry' },
  { state: 'carry', read: '1', write: '0', move: -1, next: 'carry' },
  { state: 'carry', read: '0', write: '1', move: 0, next: 'halt' },
  { state: 'carry', read: ' ', write: '1', move: 0, next: 'halt' },
];

const STATE_NAME: Record<State, string> = { seek: '끝 찾기', carry: '올림', halt: '멈춤' };
const MOVE_NAME = { [-1]: '←', 0: '그대로', 1: '→' } as const;
const show = (s: Sym): string => (s === ' ' ? '빈칸' : s);

interface Machine {
  tape: Sym[];
  head: number;
  state: State;
  steps: number;
}

const start = (input: string): Machine => ({ tape: [' ', ...(input.split('') as Sym[]), ' '], head: 1, state: 'seek', steps: 0 });

/** 머리 밑의 글자. 테이프 밖은 빈칸으로 본다 */
const under = (m: Machine): Sym => m.tape[m.head] ?? ' ';

const ruleFor = (m: Machine): Rule | undefined => RULES.find((r) => r.state === m.state && r.read === under(m));

function step(m: Machine): Machine {
  const r = ruleFor(m);
  if (!r) return m;
  const tape = m.tape.slice();
  tape[m.head] = r.write;
  return { tape, head: m.head + r.move, state: r.next, steps: m.steps + 1 };
}

const FIRST = '1011';
const SECOND = '111';

export function TuringStepper() {
  const [input, setInput] = useState(FIRST);
  const [m, setM] = useState<Machine>(() => start(FIRST));
  const rule = ruleFor(m);
  const halted = m.state === 'halt';
  const result = m.tape.join('').trim();
  const other = input === FIRST ? SECOND : FIRST;
  return (
    <div className="tm">
      <div className="tm-tape" role="img" aria-label={`테이프: ${m.tape.map(show).join(' ')}, 머리는 ${m.head + 1}번째 칸`}>
        {m.tape.map((s, i) => (
          <span key={i} className={i === m.head ? 'tm-cell is-head' : 'tm-cell'}>
            {s === ' ' ? ' ' : s}
          </span>
        ))}
      </div>
      <div className="fig-stats fig-stats-3">
        <div>
          <small>상태</small>
          <b>{STATE_NAME[m.state]}</b>
        </div>
        <div>
          <small>머리 밑의 글자</small>
          <b>{show(under(m))}</b>
        </div>
        <div>
          <small>걸음</small>
          <b>{m.steps}</b>
        </div>
      </div>
      <div className="tm-rules">
        <div className="tm-rule tm-rule-head">
          <span>상태</span>
          <span>읽으면</span>
          <span>쓰고</span>
          <span>머리를</span>
          <span>다음 상태</span>
        </div>
        {RULES.map((r, i) => (
          <div key={i} className={r === rule ? 'tm-rule is-on' : 'tm-rule'}>
            <span>{STATE_NAME[r.state]}</span>
            <span>{show(r.read)}</span>
            <span>{show(r.write)}</span>
            <span>{MOVE_NAME[r.move]}</span>
            <span>{STATE_NAME[r.next]}</span>
          </div>
        ))}
      </div>
      <div className="pc-buttons">
        <button type="button" onClick={() => setM(step)} disabled={halted}>
          한 걸음
        </button>
        <button type="button" onClick={() => setM(start(input))}>
          처음부터
        </button>
        <button
          type="button"
          onClick={() => {
            setInput(other);
            setM(start(other));
          }}
        >
          {other}로 해 보기
        </button>
        {halted && (
          <span>
            끝: {input}({parseInt(input, 2)}) + 1 = {result}({parseInt(result, 2)})
          </span>
        )}
      </div>
    </div>
  );
}
