import { Canvas } from "@dive/canvas-vue";
import type { Plugin } from "@dive/core";

export const CanvasPlugin: Plugin = {
  name: "canvas",
  version: "0.0.1",
  views: [
    {
      name: "Infinite Canvas",
      component: Canvas,
      supports: ["canvas", "application/x-canvas"],
    },
  ],
  init() {
    console.log("Canvas Plugin Initialized");
  },
};

export { Canvas };
