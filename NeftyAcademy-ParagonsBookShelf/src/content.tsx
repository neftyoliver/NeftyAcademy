/**
 * 본문에서 쓰는 작은 조각들. MDX에서 import 해서 쓰면 된다.
 *
 *   import { Note, Figure, Term } from 'neftyacademy-paragons-bookshelf';
 *   <Note kind="warn">sudo는 조심해서</Note>
 */
import type { ReactNode } from 'react';

export function Note({ kind = 'info', title, children }: { kind?: 'info' | 'tip' | 'warn'; title?: string; children: ReactNode }) {
  const label = title ?? { info: '참고', tip: '요령', warn: '주의' }[kind];
  return (
    <aside className={`bf-note bf-note-${kind}`}>
      <strong className="bf-note-title">{label}</strong>
      <div>{children}</div>
    </aside>
  );
}

/** 그림 + 설명. 그림은 SVG 같은 HTML 요소로. */
export function Figure({ caption, children, wide }: { caption?: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={`bf-figure${wide ? ' is-wide' : ''}`}>
      <div className="bf-figure-body">{children}</div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** 용어. 마우스를 올리면 짧은 풀이가 뜬다. */
export function Term({ children, tip }: { children: ReactNode; tip: string }) {
  return (
    <abbr className="bf-term" title={tip}>
      {children}
    </abbr>
  );
}

/** 명령어 한 줄과 그 뜻을 나란히. */
export function Cmd({ children, means }: { children: ReactNode; means: ReactNode }) {
  return (
    <div className="bf-cmd">
      <code>{children}</code>
      <span>{means}</span>
    </div>
  );
}
