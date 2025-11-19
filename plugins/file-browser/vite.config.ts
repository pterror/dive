import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'DivePluginFileBrowser',
      fileName: (format) => `dive-plugin-file-browser.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@dive/core', '@dive/ui'],
      output: {
        globals: {
          vue: 'Vue',
          '@dive/core': 'DiveCore',
          '@dive/ui': 'DiveUI'
        }
      }
    }
  }
});
