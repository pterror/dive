import { defineConfig, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const config: UserConfig = defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "DivePluginCanvas",
      fileName: (format) => `dive-plugin-canvas.${format}.js`,
    },
  },
});

export default config;
