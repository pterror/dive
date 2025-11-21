<script setup lang="ts">
import { MilkdownProvider } from "@milkdown/vue";
import MilkdownEditor from "./MilkdownEditor.vue";
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
</template>

<style scoped>
/* Wrapper styles if needed */
</style>
