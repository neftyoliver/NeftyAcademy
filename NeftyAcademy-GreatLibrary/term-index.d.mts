/** 용어 색인. 쪽이 `export const terms = [...]` 로 적은 낱말을 모아, 코드에서 그 낱말을 찾아 준다. */
export interface TermFamilies {
  /** 갈래 id → 그 갈래의 책(별표 가능), 더 찾아볼 갈래, 링크를 걸 코드 블록의 언어(없으면 text 를 뺀 전부), 이 갈래의 책에서만 걸리는 이름 */
  families?: Record<string, { books: string[]; sees?: string[]; langs?: string[]; local?: string[] }>;
  /** 폴더와 다른 책에 실린 쪽: { '폴더/챕터 id': '책 id/챕터 id' } */
  pages?: Record<string, string>;
}
export interface TermView {
  tables: Map<string, { target: string; kind: 'plain' | 'prose' | 'call' }>[];
  langs: Set<string> | null;
}
export interface TermIndex {
  /** .mdx 파일의 경로 → '책 id/챕터 id'. 쪽이 아니면 null */
  keyOf(path: string): string | null;
  viewOf(pageKey: string): TermView;
  claims: { family: string; term: string; target: string }[];
  size: number;
}
/** chapters: src/chapters 폴더, config: 갈래를 적은 JSON 파일(TermFamilies 꼴) */
export function createTermIndex(options: { chapters: URL | string; config?: URL | string }): TermIndex;
export function parseTerm(raw: string): { chain: string; kind: 'plain' | 'prose' | 'call' };
export function termsIn(source: string): string[];
export function notermsIn(source: string): string[];
export function findTerms(text: string, view: TermView, inline: boolean): { start: number; end: number; target: string }[];
