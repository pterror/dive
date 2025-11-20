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
const taggedFiles = ref<readonly FileObject[]>([]);

const isHomeView = computed(
  () => !searchStore.selectedTag && !searchStore.query,
);

// Combined list for search filtering
const allFiles = computed(() => {
  if (searchStore.selectedTag) return taggedFiles.value;
  // If searching, we might want to search EVERYTHING.
  // But currently our API doesn't support global search easily without fetching all.
  // For now, if query exists, we might need to fetch all?
  // Or just search within what we have?
  // Let's assume global search is handled by the search bar component separately or we fetch all.
  // For this iteration, let's just show what we have.
  return [...recentFiles.value, ...untaggedFiles.value];
});

const filteredFiles = computed(() => {
  if (searchStore.query) {
    const q = searchStore.query.toLowerCase();
    // If searching, we probably want to search across everything we've loaded,
    // or trigger a search API call.
    // Let's just filter the current view for now.
    return allFiles.value.filter((f) => f.name.toLowerCase().includes(q));
  }
  return allFiles.value;
});

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

async function fetchTaggedData(tag: string) {
  try {
    const res = await fetch(`/api/objects?tag=${tag}`);
    if (res.ok) {
      const data = await res.json();
      taggedFiles.value = mapFiles(data);
    }
  } catch (e) {
    console.error("Failed to fetch tagged data:", e);
  }
}

function mapFiles(data: any[]): FileObject[] {
  return data.map((obj: any) => ({
    id: obj.id,
    name: obj.name,
    path: obj.content?.path || "", // Read from content.path for external, or empty for internal
    isDirectory: false, // No folders anymore
    updatedAt: obj.updated_at * 1000,
  }));
}

async function refresh() {
  if (searchStore.selectedTag) {
    await fetchTaggedData(searchStore.selectedTag);
  } else {
    await fetchHomeData();
  }
}

watch(
  () => searchStore.selectedTag,
  () => {
    refresh();
  },
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
    type: getFileType(file.name),
    name: file.name,
    path: file.path,
  });
}
</script>

<template>
  <div class="file-browser">
    <div class="file-browser__header">
      <div class="file-browser__title">
        {{
          searchStore.selectedTag ? `Tag: ${searchStore.selectedTag}` : "Home"
        }}
      </div>
      <div class="file-browser__actions">
        <Button variant="secondary">Upload</Button>
        <Button>New Item</Button>
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

      <!-- Tagged View -->
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

.file-browser__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
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
