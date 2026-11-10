import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    // .mdx → React 컴포넌트. remark-gfm은 표·취소선 같은 깃허브식 마크다운을 켠다.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react({ include: /\.(mdx|tsx?)$/ }),
    // 결과물을 dist/index.html 한 파일로(JS·CSS를 안에 넣는다). 메일로 보내거나 USB로 옮겨도 그대로 열린다.
    viteSingleFile(),
  ],
  resolve: {
    // ParagonsBookShelf이 ../ParagonsBookShelf 에 따로 있어서 react가 두 벌 잡히지 않게 한 벌로 모은다.
    dedupe: ['react', 'react-dom'],
  },
});
