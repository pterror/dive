<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTagStore, useSearchStore } from "@dive/core";
import { onMounted } from "vue";

const tagStore = useTagStore();
const { tags } = storeToRefs(tagStore);
const searchStore = useSearchStore();

onMounted(() => {
  tagStore.fetchTags();
});

function toggleTag(tag: { id: string; name: string }) {
  searchStore.toggleFilter({
    id: tag.id,
    type: "tag",
    value: tag.id,
    label: tag.name,
  });
}

function isTagSelected(tagId: string) {
  return searchStore.filters.some((f) => f.type === "tag" && f.id === tagId);
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <div class="sidebar__title">Dive</div>
    </div>

    <div class="sidebar__search">
      <input
        type="text"
        class="sidebar__search-input"
        placeholder="Search..."
        v-model="searchStore.query"
      />
    </div>

    <div class="sidebar__section">
      <div class="sidebar__section-title">Tags</div>
      <div class="sidebar__tags">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="sidebar__tag"
          :class="{ 'sidebar__tag--active': isTagSelected(tag.id) }"
          @click="toggleTag(tag)"
        >
          <span
            class="sidebar__tag-color"
            :style="{ backgroundColor: tag.color }"
          ></span>
          <span class="sidebar__tag-name">{{ tag.name }}</span>
        </div>
      </div>
    </div>
  </aside>
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
  color: var(--color-text-muted);
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

.sidebar__tag--active {
  background-color: var(--color-sidebar-hover);
  font-weight: 600;
}

.sidebar__tag-color {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}
</style>
