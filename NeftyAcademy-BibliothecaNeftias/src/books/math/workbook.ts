/**
 * 기본서 옆에 놓는 문제집을 만든다. 차례는 기본서의 것을 그대로 따른다.
 *
 *   workbook(mNumbers)   → id 'm-numbers-w', 제목 '수의 체계 문제집'
 *
 *  - 쪽의 id 와 제목은 기본서와 같다. 기본서의 #/read/m-numbers/nat-count 옆에 #/read/m-numbers-w/nat-count 가 있다
 *  - 쓴 쪽은 src/chapters/<기본서 id>-w/ 에서 저절로 모은다(파일 이름의 규칙은 기본서와 같다)
 *  - 문제는 확인, 연습, 증명, 도전의 차례로 놓고, 힌트와 풀이를 접어 둔다
 */
import type { Book, Chapter } from 'paragoniahex';
import { writtenIn } from '../written';

export function workbook(text: Book): Book {
  const id = `${text.id}-w`;
  const written = writtenIn(id);
  const seen = new Set<string>();
  const copy = (c: Chapter): Chapter => {
    seen.add(c.id);
    const done = written[c.id];
    const out: Chapter = done ? { id: c.id, title: c.title, Content: done[0], summary: done[1], links: done[2] } : { id: c.id, title: c.title, draft: true };
    if (c.children) {
      out.children = c.children.map(copy);
      if (out.children.some((ch) => !ch.draft)) out.draft = false;
    }
    return out;
  };
  const chapters = text.chapters.map(copy);
  for (const page of Object.keys(written)) if (!seen.has(page)) throw new Error(`기본서의 차례에 없는 쪽을 문제집에 썼습니다: ${id}/${page}`);
  return {
    id,
    title: `${text.title} 문제집`,
    subtitle: `「${text.title}」의 차례를 따라 푸는 문제. 확인, 연습, 증명, 도전`,
    category: text.category,
    chapters,
  };
}
