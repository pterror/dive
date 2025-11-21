import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig, type UserConfig } from "vite";

const config: UserConfig = defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "DivePluginMarkdown",
      fileName: (format) => `dive-plugin-markdown.${format}.js`,
    },
  },
});

export default config;
