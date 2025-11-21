```vue
<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { FileObject } from "./types";
import { Button } from "@dive/ui";
import { useSearchStore, useWorkspaceStore } from "@dive/core";

const searchStore = useSearchStore();
const workspaceStore = useWorkspaceStore();

// State
const recentFiles = ref<readonly FileObject[]>([]);
const untaggedFiles = ref<readonly FileObject[]>([]);
const filteredFiles = ref<readonly FileObject[]>([]);

const isHomeView = computed(
  () => searchStore.filters.length === 0 && !searchStore.query,
);

// Combined list for search filtering (client-side search on top of server results?)
// Actually, if we have filters, we fetch filtered results.
// If we have query, we might want to search globally.
// For now, let's keep the "Home View" vs "Filtered View" distinction.

async function fetchHomeData() {
  try {
    // Fetch Recent
    const recentRes = await fetch("/api/objects?sort=recent&limit=10");
    if (recentRes.ok) {
      const data = await recentRes.json();
      recentFiles.value = mapFiles(data);
    }

    // Fetch Untagged
    const untaggedRes = await fetch("/api/objects?untagged=true");
    if (untaggedRes.ok) {
      const data = await untaggedRes.json();
      untaggedFiles.value = mapFiles(data);
    }
  } catch (e) {
    console.error("Failed to fetch home data:", e);
  }
}

async function fetchFilteredData() {
  try {
    const params = new URLSearchParams();

    // Serialize filters
    if (searchStore.filters.length > 0) {
      params.append("filters", JSON.stringify(searchStore.filters));
    }

    if (searchStore.query) {
      params.append("q", searchStore.query);
    }

    const res = await fetch(`/api/objects?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      filteredFiles.value = mapFiles(data);
    }
  } catch (e) {
    console.error("Failed to fetch filtered data:", e);
  }
}

function mapFiles(data: any[]): FileObject[] {
  return data.map((obj: any) => ({
    id: obj.id,
    name: obj.name,
    path: obj.content?.path || "", // Read from content.path for external, or empty for internal
    type: obj.type,
    isDirectory: false, // No folders anymore
    updatedAt: obj.updated_at * 1000,
  }));
}

async function refresh() {
  if (isHomeView.value) {
    await fetchHomeData();
  } else {
    await fetchFilteredData();
  }
}

watch(
  () => [searchStore.filters, searchStore.query],
  () => {
    refresh();
  },
  { deep: true },
);

onMounted(() => {
  refresh();
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
  console.log("Opening file", file.name);
  workspaceStore.openObject({
    id: file.id,
    type: file.type || getFileType(file.name),
    name: file.name,
    path: file.path,
  });
}

function removeFilter(id: string) {
  searchStore.removeFilter(id);
}

// Actions
const fileInput = ref<HTMLInputElement | null>(null);

function triggerUpload() {
  fileInput.value?.click();
}

async function handleUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const formData = new FormData();
  formData.append("action", "upload");
  formData.append("file", file);

  try {
    const res = await fetch("/api/objects", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await refresh();
    } else {
      console.error("Upload failed");
    }
  } catch (e) {
    console.error("Upload error:", e);
  } finally {
    // Reset input
    if (fileInput.value) fileInput.value.value = "";
  }
}

async function handleNewItem() {
  const name = prompt("Enter file name:", "Untitled.md");
  if (!name) return;

  const formData = new FormData();
  formData.append("action", "create");
  formData.append("name", name);

  try {
    const res = await fetch("/api/objects", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await refresh();
    } else {
      console.error("Create failed");
    }
  } catch (e) {
    console.error("Create error:", e);
  }
}

async function handleImportUrl() {
  const url = prompt("Enter URL to import:");
  if (!url) return;

  const formData = new FormData();
  formData.append("action", "import");
  formData.append("url", url);

  try {
    const res = await fetch("/api/objects", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      await refresh();
    } else {
      console.error("Import failed");
    }
  } catch (e) {
    console.error("Import error:", e);
  }
}
</script>

<template>
  <div class="file-browser">
    <div class="file-browser__header">
      <div class="file-browser__title-area">
        <div v-if="isHomeView" class="file-browser__title">Home</div>
        <div v-else class="file-browser__filters">
          <div
            v-for="filter in searchStore.filters"
            :key="filter.id"
            class="filter-chip"
          >
            <span class="filter-chip__label">{{ filter.label }}</span>
            <button
              class="filter-chip__remove"
              @click.stop="removeFilter(filter.id)"
            >
              ×
            </button>
          </div>
          <div v-if="searchStore.query" class="filter-chip filter-chip--query">
            "{{ searchStore.query }}"
          </div>
        </div>
      </div>
      <div class="file-browser__actions">
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleUpload"
        />
        <Button variant="secondary" @click="triggerUpload">Upload</Button>
        <Button @click="handleNewItem">New Item</Button>
        <Button variant="secondary" @click="handleImportUrl">Import URL</Button>
      </div>
    </div>

    <div class="file-browser__content">
      <!-- Home View -->
      <div v-if="isHomeView" class="file-browser__sections">
        <section class="file-browser__section">
          <h3 class="section-title">Recent</h3>
          <div class="file-browser__grid">
            <div
              v-for="file in recentFiles"
              :key="file.id"
              class="file-card"
              @click="navigate(file)"
            >
              <div class="file-card__icon">
                {{ "📄" }}
              </div>
              <div class="file-card__name">{{ file.name }}</div>
            </div>
          </div>
        </section>

        <section class="file-browser__section">
          <h3 class="section-title">Untagged</h3>
          <div class="file-browser__grid">
            <div
              v-for="file in untaggedFiles"
              :key="file.id"
              class="file-card"
              @click="navigate(file)"
            >
              <div class="file-card__icon">
                {{ "❓" }}
              </div>
              <div class="file-card__name">{{ file.name }}</div>
            </div>
          </div>
        </section>
      </div>

      <!-- Filtered View -->
      <div v-else class="file-browser__grid">
        <div
          v-for="file in filteredFiles"
          :key="file.id"
          class="file-card"
          @click="navigate(file)"
        >
          <div class="file-card__icon">
            {{ "🏷️" }}
          </div>
          <div class="file-card__name">{{ file.name }}</div>
        </div>
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
  overflow: hidden; /* Contain scroll */
}

.file-browser__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.file-browser__title-area {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.file-browser__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.file-browser__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  display: flex;
  align-items: center;
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-primary-border);
}

.filter-chip--query {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
  border-color: var(--color-border);
}

.filter-chip__remove {
  background: none;
  border: none;
  color: inherit;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
}

.filter-chip__remove:hover {
  opacity: 1;
}

.file-browser__actions {
  display: flex;
  gap: 0.5rem;
}

.file-browser__content {
  flex: 1;
  overflow-y: auto;
}

.file-browser__sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.file-browser__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
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
