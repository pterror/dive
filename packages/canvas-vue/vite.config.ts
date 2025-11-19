import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'DiveCanvasVue',
      fileName: (format) => `dive-canvas-vue.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@dive/canvas'],
      output: {
        globals: {
          vue: 'Vue',
          '@dive/canvas': 'DiveCanvas'
        }
      }
    }
  }
});
