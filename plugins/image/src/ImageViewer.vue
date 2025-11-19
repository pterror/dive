<script setup lang="ts">
import { ref } from 'vue';

// Mock data
const src = ref('https://picsum.photos/800/600');
</script>

<template>
  <div class="image-viewer">
    <img :src="src" alt="Preview" class="image-viewer__img" />
  </div>
</template>

<style scoped>
.image-viewer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
}

.image-viewer__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
