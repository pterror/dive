<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  objectId: string;
}>();

const tags = ref<{ id: string; name: string; color: string }[]>([]);
const availableTags = ref<{ id: string; name: string; color: string }[]>([]);
const showAdd = ref(false);
const newTagName = ref("");

async function fetchObjectTags() {
  try {
    const res = await fetch(`/api/objects/${props.objectId}/tags`);
    if (res.ok) {
      tags.value = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch object tags:", e);
  }
}

async function fetchAllTags() {
  try {
    const res = await fetch("/api/tags");
    if (res.ok) {
      availableTags.value = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch all tags:", e);
  }
}

async function addTag(tagId: string) {
  try {
    const res = await fetch(`/api/objects/${props.objectId}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId }),
    });
    if (res.ok) {
      await fetchObjectTags();
      showAdd.value = false;
    }
  } catch (e) {
    console.error("Failed to add tag:", e);
  }
}

async function createAndAddTag() {
  if (!newTagName.value) return;
  try {
    // Create tag
    const createRes = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName.value }),
    });

    if (createRes.ok) {
      const newTag = await createRes.json();
      await addTag(newTag.id);
      newTagName.value = "";
      await fetchAllTags();
    }
  } catch (e) {
    console.error("Failed to create tag:", e);
  }
}

async function removeTag(tagId: string) {
  try {
    const res = await fetch(`/api/objects/${props.objectId}/tags`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId }),
    });
    if (res.ok) {
      await fetchObjectTags();
    }
  } catch (e) {
    console.error("Failed to remove tag:", e);
  }
}

watch(
  () => props.objectId,
  () => {
    fetchObjectTags();
  },
);

onMounted(() => {
  fetchObjectTags();
  fetchAllTags();
});
</script>

<template>
  <div class="tag-manager">
    <div class="tag-manager__header">
      <h3 class="tag-manager__title">Tags</h3>
      <button @click="showAdd = !showAdd" class="tag-manager__add-btn">+</button>
    </div>

    <div v-if="showAdd" class="tag-manager__add-panel">
      <div class="tag-manager__existing">
        <div
          v-for="tag in availableTags"
          :key="tag.id"
          class="tag-manager__option"
          @click="addTag(tag.id)"
        >
          <span class="tag-dot" :style="{ backgroundColor: tag.color }"></span>
          {{ tag.name }}
        </div>
      </div>
      <div class="tag-manager__create">
        <input v-model="newTagName" placeholder="New tag..." @keyup.enter="createAndAddTag" />
        <button @click="createAndAddTag">Create</button>
      </div>
    </div>

    <div class="tag-manager__list">
      <div v-for="tag in tags" :key="tag.id" class="tag-pill">
        <span class="tag-dot" :style="{ backgroundColor: tag.color }"></span>
        {{ tag.name }}
        <span class="tag-remove" @click="removeTag(tag.id)">×</span>
      </div>
      <div v-if="tags.length === 0" class="tag-manager__empty">No tags</div>
    </div>
  </div>
</template>

<style scoped>
.tag-manager {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.tag-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tag-manager__title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.tag-manager__add-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--color-text-muted);
}

.tag-manager__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  display: flex;
  align-items: center;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.tag-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.25rem;
}

.tag-remove {
  margin-left: 0.5rem;
  cursor: pointer;
  color: var(--color-text-muted);
}

.tag-remove:hover {
  color: var(--color-danger);
}

.tag-manager__add-panel {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.tag-manager__option {
  display: flex;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.tag-manager__option:hover {
  background: var(--color-surface-hover);
}

.tag-manager__create {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.tag-manager__create input {
  flex: 1;
  padding: 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

.tag-manager__empty {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
}
</style>
