import type { App } from "vue";
import { createPinia } from "pinia";
import { registry } from "@dive/core";
import { FileBrowserPlugin } from "@dive/plugin-file-browser";
import { MarkdownPlugin } from "@dive/plugin-markdown";
import { CanvasPlugin } from "@dive/plugin-canvas";
import { ImagePlugin } from "@dive/plugin-image";
import { VideoPlugin } from "@dive/plugin-video";
import { HistoryPlugin } from "@dive/plugin-history";
import { CalendarPlugin } from "@dive/plugin-calendar";

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
