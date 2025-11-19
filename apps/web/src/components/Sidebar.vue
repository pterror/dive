<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  { name: 'Files', icon: 'folder' },
  { name: 'Notes', icon: 'edit' },
  { name: 'Canvas', icon: 'map' },
]);
</script>

<template>
  <div class="sidebar">
    <h1 class="sidebar__title">Dive</h1>
    <nav class="sidebar__nav">
      <a
        v-for="item in items"
        :key="item.name"
        href="#"
        class="sidebar__item"
      >
        <span>{{ item.name }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  padding: 1rem;
}

.sidebar__title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s;
}

.sidebar__item:hover {
  background-color: var(--color-sidebar-hover);
}
</style>
