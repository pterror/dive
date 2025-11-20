<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTagStore, useSearchStore } from '@dive/core';

const tagStore = useTagStore();
const { tags } = storeToRefs(tagStore);
const searchStore = useSearchStore();

const items = ref([
  { name: 'Files', icon: 'folder' },
  { name: 'Notes', icon: 'edit' },
  { name: 'Canvas', icon: 'map' },
]);
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <h1 class="sidebar__title">Dive</h1>
    </div>
    
    <div class="sidebar__search">
      <input 
        type="text" 
        v-model="searchStore.query" 
        placeholder="Search..." 
        class="input"
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
  /* Width/Height/Bg handled by container (.app__sidebar) */
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  padding: 1rem;
}

.sidebar__header {
  /* Removed border-bottom */
  padding: 0; /* Padding handled by container gap/padding */
}

.sidebar__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.sidebar__search {
  padding: 0; /* Reset padding */
}

/* Input styles moved to global.css (.input) */

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

.sidebar__item--active {
  background-color: var(--color-sidebar-hover);
  font-weight: 600;
}

.sidebar__item--empty {
  margin-top: 1rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  padding: 0 0.75rem;
}

.sidebar__section {
  margin-top: 1rem;
  padding: 0; /* Reset padding */
}

.sidebar__section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 600;
  padding: 0 0.75rem; /* Align with items */
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
