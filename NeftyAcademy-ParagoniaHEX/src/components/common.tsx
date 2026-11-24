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

/** 글자의 폭을 한글 한 자 = 1 로 어림한다. 로마자와 숫자는 그 절반 남짓이다 */
function glyph(ch: string): number {
  const c = ch.codePointAt(0) ?? 0;
  if (c >= 0x1100) return 1; // 한글, 한자, 전각 기호
  if (ch === ' ') return 0.3;
  if (/[A-Z@%&#MW]/.test(ch)) return 0.7;
  if (/[.,:;'`|!ilIjt()[\]]/.test(ch)) return 0.32;
  return 0.56;
}
export const textWidth = (text: string): number => Array.from(text).reduce((w, ch) => w + glyph(ch), 0);

/** 폭 max 를 넘는 글을 넘지 않을 만큼 자르고 줄임표를 붙인다 */
function clip(text: string, max: number): string {
  if (textWidth(text) <= max) return text;
  let out = '';
  for (const ch of Array.from(text)) {
    if (textWidth(out + ch) > max - 0.6) break;
    out += ch;
  }
  return `${out}…`;
}

/** 낱말을 더 잘게: 띄어쓰기로 나누고, 긴 식별자는 `_`와 `::` 뒤에서도 끊을 수 있게 한다 */
function pieces(title: string): { text: string; glue: boolean }[] {
  const out: { text: string; glue: boolean }[] = [];
  for (const word of title.split(/\s+/).filter(Boolean)) {
    const parts = word.split(/(?<=_|::)/).filter(Boolean);
    parts.forEach((text, i) => out.push({ text, glue: i > 0 }));
  }
  return out;
}

/** 노드 모양이 높이 y(가운데에서 위나 아래로 잰 거리)에서 글에 내줄 수 있는 폭의 절반 */
export type HalfWidth = (y: number) => number;

/**
 * 반지름 r 인 원 안에 넣을 제목을 줄로 나눈다(최대 lines 줄). 글자 크기 font, 줄 사이 leading.
 * 줄마다 그 높이에서의 원의 폭(현의 길이)을 넘지 않게 채우고, 끝내 넘치면 마지막 줄을 줄임표로 자른다(clipped).
 * shift = 줄 묶음의 가운데가 원의 가운데에서 아래로 내려간 거리(위에 번호가 있을 때).
 * 돌려주는 줄은 i번째 줄을 가운데에서 shift + (i - (줄 수 - 1) / 2) * leading 만큼 내려 그린다고 보고 나눈 것이다.
 * 뒤쪽 줄이 비어 있을 수 있다(그 자리를 비워 두어야 앞의 줄들이 원 안에 들어간다).
 */
export function wrapInCircle(title: string, r: number, font: number, leading: number, lines = 3, shift = 0): { lines: string[]; clipped: boolean } {
  return wrapInShape(title, (y) => Math.sqrt(Math.max(0, (r * 0.94) ** 2 - y * y)), font, leading, lines, shift);
}

/** wrapInCircle 과 같되, 원 대신 아무 모양(높이마다의 폭의 절반 half)에 맞춘다. 육각형과 사각형 노드가 쓴다 */
export function wrapInShape(title: string, half: HalfWidth, font: number, leading: number, lines = 3, shift = 0): { lines: string[]; clipped: boolean } {
  const words = pieces(title);
  const room = (i: number, n: number): number => {
    const y = Math.abs(shift + (i - (n - 1) / 2) * leading) + font * 0.45;
    return (2 * Math.max(0, half(y))) / font;
  };
  for (let n = 1; n <= lines; n++) {
    const out: string[] = [];
    let cur = '';
    let fits = true;
    for (const w of words) {
      const next = cur ? (w.glue ? cur + w.text : `${cur} ${w.text}`) : w.text;
      if (textWidth(next) <= room(out.length, n)) cur = next;
      else if (!cur) {
        fits = false;
        break;
      } else {
        out.push(cur);
        cur = w.text;
        if (out.length >= n || textWidth(cur) > room(out.length, n)) {
          fits = false;
          break;
        }
      }
    }
    if (fits) return { lines: Array.from({ length: n }, (_, i) => [...out, cur][i] ?? ''), clipped: false };
  }
  // 다 들어가지 않는다: 줄 수를 다 쓰고, 마지막 줄에 남은 것을 모두 붙인 뒤 넘치는 줄은 자른다
  const out: string[] = [];
  const push = (text: string): void => void out.push(clip(text, room(out.length, lines)));
  let cur = '';
  for (const w of words) {
    const next = cur ? (w.glue ? cur + w.text : `${cur} ${w.text}`) : w.text;
    if (!cur || out.length === lines - 1 || textWidth(next) <= room(out.length, lines)) cur = next;
    else {
      push(cur);
      cur = w.text;
    }
  }
  if (cur) push(cur);
  return { lines: out, clipped: true };
}

/** 이 책(서가면 안쪽 책까지)에서 읽을 수 있는 쪽들의 '책id/챕터id'. 본문이 있는 챕터만 센다 */
export function readablePages(book: Book): string[] {
  const own = flatChapters(book)
    .filter((f) => f.chapter.Content && !f.chapter.draft)
    .map((f) => `${book.id}/${f.chapter.id}`);
  return [...own, ...(book.books ?? []).flatMap(readablePages)];
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
