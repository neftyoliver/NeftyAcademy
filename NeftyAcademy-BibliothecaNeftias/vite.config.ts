import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import mdxMath from './mdx-math.mjs';
import rehypeTableCells from './rehype-table-cells.mjs';
import remarkChapterLinks from './remark-chapter-links.mjs';
import remarkTermLinks from './remark-term-links.mjs';
import { createTermIndex } from './term-index.mjs';

// 쪽마다 적어 둔 용어(export const terms)를 한 번 모은다. 용어를 고친 뒤에는 dev 서버를 다시 켜야 다른 쪽의 링크가 바뀐다.
const terms = createTermIndex({
  chapters: new URL('./src/chapters/', import.meta.url),
  config: new URL('./src/books/terms.json', import.meta.url),
});

export default defineConfig({
  plugins: [
    // 수학 책(src/chapters/m-…, mh-…)의 .mdx 에 $…$ 로 적은 수식을 MathML 로 바꾼다. MDX 가 읽기 전에 해야 해서 맨 앞에 둔다.
    // 바꾸는 일은 tex2mml.mjs 가 하고, 결과물에는 MathML 만 남는다. 다른 책의 본문에 있는 $ 는 건드리지 않는다.
    mdxMath({ include: /\/src\/chapters\/mh?-[^/]+\/[^/]+\.mdx$/ }),
    // .mdx → React 컴포넌트. remark-gfm은 표·취소선 같은 깃허브식 마크다운을 켠다.
    // remarkTermLinks는 코드에 나온 용어를 그 용어를 설명하는 쪽으로 가는 링크로 만든다(term-index.mjs).
    // remarkChapterLinks는 본문의 챕터 링크(와 용어 링크)를 모아 지도의 줄과 「같이 보기」에 쓸 수 있게 내보낸다.
    // rehypeTableCells는 표에서 글이 긴 칸에 표시를 해 두어, 좁은 화면에서 그 칸이 한 낱말 폭으로 찌그러지지 않게 한다.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm, [remarkTermLinks, { index: terms }], remarkChapterLinks], rehypePlugins: [rehypeTableCells] }) },
    react({ include: /\.(mdx|tsx?)$/ }),
    // 결과물을 dist/index.html 한 파일로(JS·CSS를 안에 넣는다). 메일로 보내거나 USB로 옮겨도 그대로 열린다.
    viteSingleFile(),
  ],
  build: {
    // 결과물을 압축하지 않는다. JS·CSS가 한 줄로 뭉치지 않고 줄내림·들여쓰기가 살아 있어 열어 읽기 쉽다.
    minify: false,
    cssMinify: false,
  },
  resolve: {
    // ParagoniaHEX.js가 ../NeftyAcademy-ParagoniaHEX 에 따로 있어서 react가 두 벌 잡히지 않게 한 벌로 모은다.
    dedupe: ['react', 'react-dom'],
  },
});
