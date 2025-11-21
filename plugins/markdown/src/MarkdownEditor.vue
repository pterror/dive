<script setup lang="ts">
import { MilkdownProvider } from "@milkdown/vue";
import MilkdownEditor from "./MilkdownEditor.vue";

defineProps<{
  objectId: string;
}>();
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor :key="objectId" :object-id="objectId" />
  </MilkdownProvider>
</template>

<style scoped>
/* Wrapper styles if needed */
</style>
