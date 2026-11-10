/**
 * 0강: CPU는 "프로그램 카운터(PC)가 가리키는 명령 하나 실행 → PC를 다음으로" 를 되풀이할 뿐이다.
 * 점프 명령은 PC를 다른 번호로 바꿔서 반복과 분기를 만든다.
 */
import { useState } from 'react';

type Op = ['mov', 'r0' | 'r1', number] | ['add', 'r0', 'r1'] | ['sub', 'r1', number] | ['jnz', 'r1', number] | ['halt'];

const PROGRAM: { op: Op; note: string }[] = [
  { op: ['mov', 'r0', 0], note: '합을 0으로' },
  { op: ['mov', 'r1', 3], note: '셀 수를 3으로' },
  { op: ['add', 'r0', 'r1'], note: '합 += 셀 수' },
  { op: ['sub', 'r1', 1], note: '셀 수 -= 1' },
  { op: ['jnz', 'r1', 2], note: '셀 수가 0이 아니면 2번으로' },
  { op: ['halt'], note: '멈춤' },
];

interface Cpu {
  pc: number;
  r0: number;
  r1: number;
  steps: number;
  halted: boolean;
}

const START: Cpu = { pc: 0, r0: 0, r1: 0, steps: 0, halted: false };

function step(c: Cpu): Cpu {
  const ins = PROGRAM[c.pc];
  if (!ins || c.halted) return { ...c, halted: true };
  const op = ins.op;
  const n = { ...c, pc: c.pc + 1, steps: c.steps + 1 };
  switch (op[0]) {
    case 'mov':
      n[op[1]] = op[2];
      break;
    case 'add':
      n.r0 = c.r0 + c.r1;
      break;
    case 'sub':
      n.r1 = c.r1 - op[2];
      break;
    case 'jnz':
      if (c.r1 !== 0) n.pc = op[2];
      break;
    case 'halt':
      return { ...c, halted: true, steps: c.steps + 1 };
  }
  return n;
}

const fmt = (op: Op): string => op.join(' ').replace(/ (\S+) /, ' $1, ');

export function PcStepper() {
  const [cpu, setCpu] = useState<Cpu>(START);
  return (
    <div className="pc-stepper">
      <ol className="pc-program" start={0}>
        {PROGRAM.map((ins, i) => (
          <li key={i} className={i === cpu.pc && !cpu.halted ? 'is-pc' : undefined}>
            <code>{fmt(ins.op)}</code>
            <span>{ins.note}</span>
          </li>
        ))}
      </ol>
      <div className="pc-regs">
        <div>
          <small>PC</small>
          <b>{cpu.halted ? '—' : cpu.pc}</b>
        </div>
        <div>
          <small>r0 (합)</small>
          <b>{cpu.r0}</b>
        </div>
        <div>
          <small>r1 (셀 수)</small>
          <b>{cpu.r1}</b>
        </div>
        <div>
          <small>실행한 명령</small>
          <b>{cpu.steps}</b>
        </div>
      </div>
      <div className="pc-buttons">
        <button type="button" onClick={() => setCpu(step)} disabled={cpu.halted}>
          한 걸음
        </button>
        <button type="button" onClick={() => setCpu(START)}>
          처음부터
        </button>
        {cpu.halted && <span>끝: 3 + 2 + 1 = {cpu.r0}</span>}
      </div>
    </div>
  );
}
