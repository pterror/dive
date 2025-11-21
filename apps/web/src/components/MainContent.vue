<script setup lang="ts">
import { ref, computed } from "vue";
import { useWorkspaceStore, registry } from "@dive/core";
import { FileBrowser } from "@dive/plugin-file-browser";
import TagManager from "./TagManager.vue";
import PropertiesPanel from "./PropertiesPanel.vue";

const workspaceStore = useWorkspaceStore();
const showInfo = ref(false);

const activeView = computed(() => {
  const activeObj = workspaceStore.activeObject;
  if (!activeObj) return FileBrowser;

  const views = registry.getViewsForType(activeObj.type);
  if (views.length > 0) {
    return views[0].component;
  }

  return FileBrowser; // Fallback
});

const activeTab = computed({
  get: () => workspaceStore.activeObject?.id || "files",
  set: (val) => {
    if (val === "files") {
      workspaceStore.activeObject = null;
    } else if (val === "calendar") {
      workspaceStore.activeObject = {
        id: "calendar",
        type: "calendar",
        name: "Calendar",
      };
    } else if (val === "history") {
      workspaceStore.activeObject = {
        id: "history",
        type: "history",
        name: "History",
      };
    } else if (val === "canvas") {
      workspaceStore.activeObject = {
        id: "canvas",
        type: "canvas",
        name: "Canvas",
      };
    } else {
      const obj = workspaceStore.openObjects.find((o) => o.id === val);
      if (obj) workspaceStore.activeObject = obj;
    }
  },
});
</script>

<template>
  <main class="main-content">
    <div class="main-content__header">
      <div class="main-content__tabs">
        <div
          v-for="obj in workspaceStore.openObjects"
          :key="obj.id"
          class="main-content__tab"
          :class="{
            'main-content__tab--active':
              workspaceStore.activeObject?.id === obj.id,
          }"
          @click="workspaceStore.openObject(obj)"
        >
          {{ obj.name }}
          <span
            class="main-content__tab-close"
            @click.stop="workspaceStore.closeObject(obj.id)"
            >×</span
          >
        </div>
      </div>
      <div class="main-content__actions" v-if="workspaceStore.activeObject">
        <button @click="showInfo = !showInfo">
          {{ showInfo ? "Hide Info" : "Info" }}
        </button>
      </div>
    </div>

    <div class="main-content__body">
      <div class="main-content__view">
        <component
          :is="activeView"
          v-if="workspaceStore.activeObject"
          :object-id="workspaceStore.activeObject.id"
        />
        <FileBrowser v-else />
      </div>

      <aside
        v-if="showInfo && workspaceStore.activeObject"
        class="main-content__info"
      >
        <div class="info-panel">
          <div class="info-panel__header">
            <h3>Details</h3>
          </div>
          <div class="info-panel__content">
            <p><strong>Name:</strong> {{ workspaceStore.activeObject.name }}</p>
            <p><strong>Type:</strong> {{ workspaceStore.activeObject.type }}</p>
            <p><strong>Path:</strong> {{ workspaceStore.activeObject.path }}</p>
          </div>
          <PropertiesPanel :object-id="workspaceStore.activeObject.id" />
          <TagManager :object-id="workspaceStore.activeObject.id" />
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  overflow: hidden;
}

.main-content__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Border removed */
  padding: 0.5rem 1.5rem 0.5rem 0;
}

.main-content__tabs {
  display: flex;
  overflow-x: auto;
  min-height: 44px; /* Height of a tab (padding + font size + gap) */
}

.main-content__tab {
  padding: 0.75rem 1rem;
  cursor: pointer;
  /* Border removed */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  background-color: var(--color-surface);
  color: var(--color-text-muted);
}

.main-content__tab:hover {
  background-color: var(--color-surface-hover);
}

.main-content__tab--active {
  background-color: var(--color-background);
  color: var(--color-primary);
  font-weight: 500;
  border-bottom: 2px solid var(--color-primary);
}

.main-content__tab-close {
  font-size: 1.25rem;
  line-height: 0.5;
  opacity: 0.5;
}

.main-content__tab-close:hover {
  opacity: 1;
}

.main-content__body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content__view {
  flex: 1;
  overflow: auto;
  position: relative;
}

.main-content__info {
  width: 300px;
  background-color: var(--color-surface);
  /* Border removed, using shadow/bg for separation */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
  overflow-y: auto;
  margin: 1rem 1rem 1rem 0;
}

.info-panel__header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.info-panel__header h3 {
  margin: 0;
  font-size: 1rem;
}

.info-panel__content {
  padding: 1rem;
}

.info-panel__content p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.main-content__empty {
  height: 100%;
  /* Removed centering to allow FileBrowser to fill space */
}

.main-content__folder,
.main-content__canvas,
.main-content__preview {
  height: 100%;
}

.preview-placeholder {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

/* Action btn styles moved to global.css (.btn-icon) */
</style>
