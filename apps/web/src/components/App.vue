<script setup lang="ts">
import Sidebar from './Sidebar.vue';
import MainContent from './MainContent.vue';
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
  width: 250px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  background-color: var(--color-sidebar-bg);
}

.app__main {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
