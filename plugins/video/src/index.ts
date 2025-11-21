import type { Plugin } from "@dive/core";
import VideoPlayer from "./VideoPlayer.vue";

export const VideoPlugin: Plugin = {
  name: "video",
  version: "0.0.1",
  views: [
    {
      name: "Video Player",
      component: VideoPlayer,
      supports: ["video", "video/mp4", "video/webm"],
    },
  ],
  init() {
    console.log("Video Plugin Initialized");
  },
};

export { VideoPlayer };
