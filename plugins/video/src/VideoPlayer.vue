<script setup lang="ts">
import { ref } from "vue";

// Mock data
const src = ref(
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
);
</script>

<template>
  <div class="video-player">
    <video :src="src" controls class="video-player__video"></video>
  </div>
</template>

<style scoped>
.video-player {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.video-player__video {
  max-width: 100%;
  max-height: 100%;
}
</style>
