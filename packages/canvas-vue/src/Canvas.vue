<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { InfiniteCanvas } from '@dive/canvas';

const canvas = new InfiniteCanvas();
const container = ref<HTMLElement | null>(null);

</script>

<template>
  <div ref="container" class="canvas-container">
    <div class="canvas-placeholder">
      <span class="canvas-placeholder__text">Infinite Canvas Placeholder</span>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  background-color: #f3f4f6; /* gray-100 */
  overflow: hidden;
  position: relative;
}

.canvas-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-placeholder__text {
  color: #9ca3af; /* gray-400 */
}
</style>
