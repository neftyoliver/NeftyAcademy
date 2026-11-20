import type { Book, Chapter } from '../types';

export interface FlatChapter {
  chapter: Chapter;
  /** "3" 또는 "3.2" */
  label: string;
  depth: 0 | 1;
  parent?: Chapter;
}

/** 챕터와 하위 챕터를 읽는 순서대로 한 줄로 편다. */
export function flatChapters(book: Book): FlatChapter[] {
  const out: FlatChapter[] = [];
  book.chapters.forEach((chapter, i) => {
    const label = chapterNumber(book, i);
    out.push({ chapter, label, depth: 0 });
    chapter.children?.forEach((sub, j) => out.push({ chapter: sub, label: `${label}.${j + 1}`, depth: 1, parent: chapter }));
  });
  return out;
}

export function chapterNumber(book: Book, index: number): string {
  return String((book.firstNumber ?? 1) + index);
}

/** 원 안에 넣을 제목을 띄어쓰기 기준으로 줄당 max 글자 안쪽으로 나눈다(최대 3줄). */
export function wrapTitle(title: string, max = 6): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= max) cur += ` ${w}`;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > 3) return [...lines.slice(0, 2), `${lines.slice(2).join(' ').slice(0, max - 1)}…`];
  return lines;
}

/** 책과 그 안의 모든 책(서가)을 한 줄로 편다. */
export function allBooks(books: Book[]): Book[] {
  return books.flatMap((b) => [b, ...allBooks(b.books ?? [])]);
}

/** 이 책(서가면 안쪽 책까지)의 챕터 수와 그중 쓴 것의 수. */
export function progressOf(book: Book): { written: number; total: number } {
  const own = flatChapters(book);
  let written = own.filter((f) => !f.chapter.draft).length;
  let total = own.length;
  for (const inner of book.books ?? []) {
    const p = progressOf(inner);
    written += p.written;
    total += p.total;
  }
  return { written, total };
}

/** 가장 바깥 책에서 id 인 책까지 내려가는 길. 못 찾으면 빈 배열. */
export function pathToBook(books: Book[], id: string): Book[] {
  for (const b of books) {
    if (b.id === id) return [b];
    const rest = pathToBook(b.books ?? [], id);
    if (rest.length) return [b, ...rest];
  }
  return [];
}
