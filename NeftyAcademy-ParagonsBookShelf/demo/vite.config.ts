import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 예시 책. `npm run dev`로 띄우고 `npm run build:demo`로 HTML 한 파일을 만든다(demo/dist/index.html).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
});
