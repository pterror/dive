import type { Plugin } from "@dive/core";
import FileBrowser from "./FileBrowser.vue";

export const FileBrowserPlugin: Plugin = {
  name: "file-browser",
  version: "0.0.1",
  views: [
    {
      name: "File Browser",
      component: FileBrowser,
      supports: ["directory"],
    },
  ],
  init(_app) {
    console.log("File Browser Plugin Initialized");
  },
};

export { FileBrowser };
