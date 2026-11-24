/**
 * 수학 책의 상자들. 정의, 정리, 증명, 예제, 풀이, 그리고 문제집의 문제, 힌트, 답.
 *
 *   <Def title="유리수">두 정수의 비로 적을 수 있는 수를 유리수라고 합니다.</Def>
 *   <Thm title="소수는 끝없이 많다">…</Thm>            name="보조정리" 처럼 이름을 바꿀 수 있다
 *   <Proof>…</Proof>                                   끝에 ∎ 이 붙는다
 *   <Ex title="분모가 다른 덧셈">…<Sol>…</Sol></Ex>     풀이는 예제 안에 넣는다
 *   <Prob n="3" level="연습">…<Hint>…</Hint><Ans>…</Ans></Prob>    힌트와 답은 눌러야 펼쳐진다
 *
 * 안에 글을 여러 문단 쓰려면 여는 태그와 닫는 태그를 따로 한 줄씩 쓰고 그 사이에 빈 줄을 둔다.
 */
import type { ReactNode } from 'react';

function Box({ kind, cls, title, plain, children, tail }: { kind: string; cls: string; title?: string; plain?: boolean; children?: ReactNode; tail?: ReactNode }) {
  return (
    <div className={plain ? `mb-plain ${cls}` : `mb ${cls}`}>
      <span className="mb-head">
        <span className="mb-kind">{kind}</span>
        {title ? <span className="mb-title">{title}</span> : null}
      </span>
      <div>{children}</div>
      {tail}
    </div>
  );
}

/** 정의 */
export function Def({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Box kind="정의" cls="mb-def" title={title}>
      {children}
    </Box>
  );
}

/** 정리. name 으로 '보조정리', '따름정리', '성질', '공리' 처럼 이름을 바꾼다 */
export function Thm({ title, name = '정리', children }: { title?: string; name?: string; children?: ReactNode }) {
  return (
    <Box kind={name} cls="mb-thm" title={title}>
      {children}
    </Box>
  );
}

/** 증명. name 으로 '증명의 줄거리' 처럼 이름을 바꾼다 */
export function Proof({ name = '증명', children }: { name?: string; children?: ReactNode }) {
  return (
    <Box kind={name} cls="mb-proof" plain tail={<span className="mb-qed" aria-label="증명 끝">∎</span>}>
      {children}
    </Box>
  );
}

/** 예제 */
export function Ex({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <Box kind="예제" cls="mb-ex" title={title}>
      {children}
    </Box>
  );
}

/** 풀이. 예제 안이나 바로 뒤에 쓴다 */
export function Sol({ name = '풀이', children }: { name?: string; children?: ReactNode }) {
  return (
    <Box kind={name} cls="mb-sol" plain>
      {children}
    </Box>
  );
}

/** 문제집의 문제. level: 확인, 연습, 증명, 도전 */
export function Prob({ n, level, children }: { n: string | number; level?: string; children?: ReactNode }) {
  return (
    <Box kind={`문제 ${n}`} cls="mb-prob" title={level}>
      {children}
    </Box>
  );
}

/** 눌러야 펼쳐지는 힌트 */
export function Hint({ children }: { children?: ReactNode }) {
  return (
    <details>
      <summary>힌트</summary>
      <div>{children}</div>
    </details>
  );
}

/** 눌러야 펼쳐지는 답과 풀이 */
export function Ans({ children }: { children?: ReactNode }) {
  return (
    <details>
      <summary>답과 풀이</summary>
      <div>{children}</div>
    </details>
  );
}
