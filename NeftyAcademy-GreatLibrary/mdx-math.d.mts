import type { Plugin } from 'vite';

/** .mdx 글에서 $…$, $$…$$, TEX`…` 로 적은 수식을 MathML 을 담은 JSX 로 바꾼 글을 돌려준다. */
export function mathToJsx(source: string, file?: string): string;

/** 수학 책의 .mdx 에 적은 수식을 MDX 가 읽기 전에 바꾸는 Vite 플러그인. */
export default function mdxMath(options: { include: RegExp }): Plugin;
