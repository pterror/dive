<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { FileObject } from "./types";
import { Button } from "@dive/ui";
import { useSearchStore, useWorkspaceStore } from "@dive/core";

const searchStore = useSearchStore();
const workspaceStore = useWorkspaceStore();
const files = ref<readonly FileObject[]>([]);
const currentFolderId = ref<string | null>(null);
const currentPathName = ref("Root"); // Simple display name for now

// Breadcrumb stack: { id: string | null, name: string }[]
const breadcrumbs = ref<{ id: string | null; name: string }[]>([
  { id: null, name: "Root" },
]);

const filteredFiles = computed(() => {
  if (!searchStore.query) return files.value;
  const q = searchStore.query.toLowerCase();
  return files.value.filter((f) => f.name.toLowerCase().includes(q));
});

async function fetchFiles() {
  try {
    let url = "/api/objects";
    const params = new URLSearchParams();

    if (searchStore.selectedTag) {
      params.append("tag", searchStore.selectedTag);
    } else if (currentFolderId.value) {
      params.append("parent_id", currentFolderId.value);
    }
    // If neither, it fetches root (handled by API)

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      // Map DB objects to FileObjects
      files.value = data.map((obj: any) => ({
        id: obj.id,
        name: obj.name,
        path: obj.path || "", // Fallback
        isDirectory: obj.type === "folder",
        updatedAt: obj.updated_at * 1000,
      }));
    }
  } catch (e) {
    console.error("Failed to fetch files:", e);
  }
}

watch(
  () => searchStore.selectedTag,
  () => {
    // Reset to root when tag changes? Or just filter?
    // If tag is selected, we ignore folder hierarchy and show flat list
    fetchFiles();
  },
);

watch(currentFolderId, () => {
  fetchFiles();
});

onMounted(() => {
  fetchFiles();
});

function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (["md", "markdown"].includes(ext)) return "markdown";
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
  if (["mp4", "webm"].includes(ext)) return "video";
  if (["canvas"].includes(ext)) return "canvas";
  return "text";
}

function navigate(file: FileObject) {
  if (file.isDirectory) {
    currentFolderId.value = file.id;
    breadcrumbs.value.push({ id: file.id, name: file.name });
  } else {
    console.log("Opening file", file.path);
    workspaceStore.openObject({
      id: file.id,
      type: getFileType(file.name), // Or use file.type from DB if we mapped it
      name: file.name,
      path: file.path,
    });
  }
}

function navigateUp() {
  if (breadcrumbs.value.length > 1) {
    breadcrumbs.value.pop(); // Remove current
    const parent = breadcrumbs.value[breadcrumbs.value.length - 1];
    currentFolderId.value = parent.id;
  }
}

function navigateToBreadcrumb(index: number) {
  // Slice breadcrumbs to index + 1
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
  const target = breadcrumbs.value[breadcrumbs.value.length - 1];
  currentFolderId.value = target.id;
}
</script>

<template>
  <div class="file-browser">
    <div class="file-browser__header">
      <div class="file-browser__breadcrumbs">
        <span
          v-for="(crumb, index) in breadcrumbs"
          :key="crumb.id || 'root'"
          class="breadcrumb-item"
          :class="{
            'breadcrumb-item--active': index === breadcrumbs.length - 1,
          }"
          @click="navigateToBreadcrumb(index)"
        >
          {{ crumb.name }}
          <span
            v-if="index < breadcrumbs.length - 1"
            class="breadcrumb-separator"
            >/</span
          >
        </span>
      </div>
      <div class="file-browser__actions">
        <Button variant="secondary">Upload</Button>
        <Button>New Folder</Button>
      </div>
    </div>

    <div class="file-browser__grid">
      <div
        v-for="file in filteredFiles"
        :key="file.id"
        class="file-card"
        @click="navigate(file)"
      >
        <div class="file-card__icon">
          {{ file.isDirectory ? "📁" : "📄" }}
        </div>
        <div class="file-card__name">{{ file.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-browser {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.file-browser__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.file-browser__breadcrumbs {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: var(--color-text);
}

.breadcrumb-item {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.breadcrumb-item--active {
  font-weight: 600;
  cursor: default;
}

.breadcrumb-item--active:hover {
  text-decoration: none;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--color-text-muted);
}

.file-browser__actions {
  display: flex;
  gap: 0.5rem;
}

.file-browser__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  overflow-y: auto;
}

.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-card:hover {
  background-color: var(--color-sidebar-hover);
}

.file-card__icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.file-card__name {
  font-size: 0.875rem;
  text-align: center;
  word-break: break-word;
}
</style>
