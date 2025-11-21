import db from "@astrojs/db";
import node from "@astrojs/node";
import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  integrations: [vue({ appEntrypoint: "/src/_app.ts" }), db()],
});
