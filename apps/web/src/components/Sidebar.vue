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
      <div class="sidebar__section">
        <h3 class="sidebar__section-title">Tags</h3>
        <ul class="sidebar__list">
          <li 
            v-for="tag in tags" 
            :key="tag.id" 
            class="sidebar__item"
            :class="{ 'sidebar__item--active': searchStore.selectedTag === tag.id }"
            @click="searchStore.toggleTag(tag.id)"
          >
            <span 
              class="sidebar__tag-color" 
              :style="{ backgroundColor: tag.color }"
            ></span>
            {{ tag.name }}
          </li>
          <li v-if="tags.length === 0" class="sidebar__item sidebar__item--empty">
            No tags
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100%;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.sidebar__header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.sidebar__search {
  padding: 1rem;
}

.sidebar__search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background-color: var(--color-background);
  color: var(--color-text);
}

.sidebar__search-input:focus {
  outline: 2px solid var(--color-primary);
  border-color: transparent;
}

.sidebar__nav {
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
  background-color: var(--color-surface-hover);
}

.sidebar__item--active {
  background-color: var(--color-surface-hover);
  font-weight: 600;
}

.sidebar__item--empty {
  margin-top: 2rem;
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
