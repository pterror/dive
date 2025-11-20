import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import db from '@astrojs/db';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    vue({
      appEntrypoint: '/src/_app.ts'
    }),
    db()
  ]
});
