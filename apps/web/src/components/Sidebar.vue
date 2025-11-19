<script setup lang="ts">
import { ref } from 'vue';
import { useTagStore, useSearchStore } from '@dive/core';

const tagStore = useTagStore();
const searchStore = useSearchStore();

const items = ref([
  { name: 'Files', icon: 'folder' },
  { name: 'Notes', icon: 'edit' },
  { name: 'Canvas', icon: 'map' },
]);
</script>

<template>
  <div class="sidebar">
    <h1 class="sidebar__title">Dive</h1>
    
    <div class="sidebar__search">
      <input 
        type="text" 
        v-model="searchStore.query" 
        placeholder="Search..." 
        class="sidebar__search-input"
      />
    </div>

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

    <div class="sidebar__section">
      <h2 class="sidebar__section-title">Tags</h2>
      <div class="sidebar__tags">
        <div
          v-for="tag in tagStore.tags"
          :key="tag.id"
          class="sidebar__tag"
        >
          <span class="sidebar__tag-dot" :style="{ backgroundColor: tag.color }"></span>
          {{ tag.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  padding: 1rem;
}

.sidebar__title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.sidebar__search {
  margin-bottom: 1rem;
}

.sidebar__search-input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
}

.sidebar__search-input:focus {
  outline: 2px solid var(--color-primary);
  border-color: transparent;
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

.sidebar__section {
  margin-top: 2rem;
}

.sidebar__section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.sidebar__tags {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__tag {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar__tag:hover {
  background-color: var(--color-sidebar-hover);
}

.sidebar__tag-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}
</style>
