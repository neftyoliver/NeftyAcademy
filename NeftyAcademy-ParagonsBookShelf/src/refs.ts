/**
 * 참조 관계. 챕터의 links(이 챕터가 가리키는 챕터들)를 도서관 전체에서 모아,
 * "이 쪽이 가리키는 쪽"과 "이 쪽을 가리키는 쪽"을 양쪽에서 찾을 수 있게 한다.
 * 지도의 화살표와 본문 아래의 "같이 보기"가 이것을 쓴다.
 */
import { allBooks, flatChapters } from './components/common';
import type { Book, Chapter, Library } from './types';

export interface RefTarget {
  book: Book;
  chapter: Chapter;
  /** "3" 또는 "3.2" */
  label: string;
}

export interface RefIndex {
  /** '책/챕터' → 이 쪽이 가리키는 쪽들. 없는 쪽과 자기 자신은 빠지고, 같은 쪽은 한 번만 들어 있다 */
  out: Map<string, string[]>;
  /** '책/챕터' → 이 쪽을 가리키는 쪽들 */
  into: Map<string, string[]>;
  /** '책/챕터' → 그 쪽 */
  at: Map<string, RefTarget>;
}

export function buildRefs(library: Library): RefIndex {
  const out = new Map<string, string[]>();
  const into = new Map<string, string[]>();
  const at = new Map<string, RefTarget>();
  const every = allBooks(library.books);
  for (const book of every) for (const f of flatChapters(book)) at.set(`${book.id}/${f.chapter.id}`, { book, chapter: f.chapter, label: f.label });
  for (const book of every)
    for (const { chapter } of flatChapters(book)) {
      const from = `${book.id}/${chapter.id}`;
      const seen = new Set<string>();
      for (const raw of chapter.links ?? []) {
        const to = raw.includes('/') ? raw : `${book.id}/${raw}`;
        if (to === from || seen.has(to) || !at.has(to)) continue;
        seen.add(to);
        (out.get(from) ?? out.set(from, []).get(from)!).push(to);
        (into.get(to) ?? into.set(to, []).get(to)!).push(from);
      }
    }
  return { out, into, at };
}
