/**
 * 차례를 글로 적어 챕터 목록으로 바꾼다. 챕터가 수백 개인 책의 뼈대를 한눈에 보고 고치기 위한 도구.
 *
 *   outline(`
 *   hello        첫 프로그램
 *     hello-main   main 함수
 *     hello-io     iostream
 *   types        타입
 *   `)
 *
 *  - 한 줄에 챕터 하나: 맨 앞 낱말이 id, 그 뒤가 제목
 *  - 두 칸 들여 쓰면 바로 위 챕터의 하위 챕터
 *  - 빈 줄과 #으로 시작하는 줄은 건너뛴다
 *  - id는 주소와 북마크에 쓰이므로 한번 정하면 바꾸지 않는다. 한 권 안에서 겹치면 오류가 난다
 *
 * 챕터를 쓰면 둘째 인자에 { id: [본문, '한 줄 요약', 본문이 가리키는 챕터들] }을 넣는다. 거기 없는 챕터는 "준비 중"으로 보인다.
 * 손으로 적을 필요는 없다: written.ts 의 writtenIn('폴더')가 src/chapters/폴더/ 의 .mdx 를 모아 이 모양으로 만들어 준다.
 */
import type { Book, Chapter } from 'neftyacademy-paragons-bookshelf';
import type { ComponentType } from 'react';

export type Written = Record<string, [Content: ComponentType, summary?: string, links?: string[]]>;

export function outline(text: string, written: Written = {}): Chapter[] {
  const top: Chapter[] = [];
  const seen = new Set<string>();
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.length - raw.trimStart().length;
    const m = /^(\S+)\s+(.+)$/.exec(raw.trim());
    if (!m) throw new Error(`차례 줄을 읽을 수 없습니다: "${raw}"`);
    const [, id, title] = m as unknown as [string, string, string];
    if (seen.has(id)) throw new Error(`챕터 id가 겹칩니다: ${id}`);
    seen.add(id);
    const done = written[id];
    const chapter: Chapter = done ? { id, title: title.trim(), Content: done[0], summary: done[1], links: done[2] } : { id, title: title.trim(), draft: true };
    if (indent === 0) top.push(chapter);
    else {
      const parent = top.at(-1);
      if (!parent) throw new Error(`하위 챕터 앞에 챕터가 없습니다: "${raw}"`);
      (parent.children ??= []).push(chapter);
    }
  }
  // 하위 챕터 가운데 쓴 것이 하나라도 있으면 묶음에서 "준비 중" 딱지를 뗀다
  for (const ch of top) if (ch.children?.some((c) => !c.draft)) ch.draft = false;
  for (const id of Object.keys(written)) if (!seen.has(id)) throw new Error(`차례에 없는 챕터를 썼다고 적었습니다: ${id}`);
  return top;
}

/** 책 한 권을 짧게 적는 도우미. */
export function book(id: string, title: string, subtitle: string, category: string, text: string, written: Written = {}): Book {
  return { id, title, subtitle, category, chapters: outline(text, written) };
}
