import { registry } from "@dive/core";
import { CalendarPlugin } from "@dive/plugin-calendar";
import { CanvasPlugin } from "@dive/plugin-canvas";
import { FileBrowserPlugin } from "@dive/plugin-file-browser";
import { HistoryPlugin } from "@dive/plugin-history";
import { ImagePlugin } from "@dive/plugin-image";
import { MarkdownPlugin } from "@dive/plugin-markdown";
import { VideoPlugin } from "@dive/plugin-video";
import { createPinia } from "pinia";
import type { App } from "vue";

export default (app: App) => {
  const pinia = createPinia();
  app.use(pinia);

  // Register Plugins
  registry.register(FileBrowserPlugin);
  registry.register(MarkdownPlugin);
  registry.register(CanvasPlugin);
  registry.register(ImagePlugin);
  registry.register(VideoPlugin);
  registry.register(HistoryPlugin);
  registry.register(CalendarPlugin);

  // Initialize Plugins
  registry.initAll(app);
};
