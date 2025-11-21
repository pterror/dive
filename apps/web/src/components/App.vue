<script setup lang="ts">
import MainContent from "./MainContent.vue";
import Sidebar from "./Sidebar.vue";
</script>

<template>
  <div class="app">
    <aside class="app__sidebar">
      <Sidebar />
    </aside>
    <main class="app__main">
      <MainContent />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app__sidebar {
  width: 32ch; /* Approx 250px-300px depending on font */
  /* Border removed */
  display: flex;
  flex-direction: column;
  background-color: var(--color-sidebar-bg);
}

.app__main {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
