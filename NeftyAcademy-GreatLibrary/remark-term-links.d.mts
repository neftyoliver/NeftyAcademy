import type { TermIndex } from './term-index.mjs';

/** 코드에 나온 용어를, 그 용어를 설명하는 쪽으로 가는 링크로 만드는 remark 플러그인. */
export default function remarkTermLinks(options: { index: TermIndex }): (tree: unknown, file: unknown) => void;
