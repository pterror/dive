<script setup lang="ts">
import { computed } from 'vue';
import { useWorkspaceStore, registry } from '@dive/core';
import { FileBrowser } from '@dive/plugin-file-browser';
import { MarkdownEditor } from '@dive/plugin-markdown';
import { Canvas } from '@dive/plugin-canvas';
import { ImageViewer } from '@dive/plugin-image';
import { VideoPlayer } from '@dive/plugin-video';
import { HistoryView } from '@dive/plugin-history';
import { CalendarView } from '@dive/plugin-calendar';
import TagManager from './TagManager.vue';
import PropertiesPanel from './PropertiesPanel.vue';

const workspaceStore = useWorkspaceStore();

const activeView = computed(() => {
  const activeObj = workspaceStore.activeObject;
  if (!activeObj) return FileBrowser; // Default to File Browser

  // Special case for built-in views if we want to treat them as "objects" or just modes
  // For now, let's say if no active object, show file browser.
  // But we also want to be able to switch to "Canvas Mode" or "Calendar Mode".
  // Let's assume we have a "mode" in the store or we treat these as special objects.
  
  // For now, let's look up the view based on the object type.
  const views = registry.getViewsForType(activeObj.type);
  if (views.length > 0) {
    return views[0].component;
  }
  
  return FileBrowser; // Fallback
});

// We need to register the plugins somewhere. 
// Since we are in a Vue component, we can't easily do it in `main.ts` of Astro.
// But we can do it here once or in a separate setup file.
// For now, let's manually map for the "static" tabs we want to keep available?
// Actually, the user wants to "replace the static tabs".
// But we still need a way to get to the File Browser if we are editing a file.
// Maybe a sidebar action or a "Home" tab?
// Let's keep a "Home" / "Files" tab always available, and then open tabs for files.

const activeTab = computed({
  get: () => workspaceStore.activeObject?.id || 'files',
  set: (val) => {
    if (val === 'files') {
      workspaceStore.activeObject = null;
    } else if (val === 'calendar') {
       // TODO: How to represent Calendar as an object?
       // Maybe we just set activeObject to a special "calendar" object
       workspaceStore.activeObject = { id: 'calendar', type: 'calendar', name: 'Calendar' };
    } else if (val === 'history') {
       workspaceStore.activeObject = { id: 'history', type: 'history', name: 'History' };
    } else if (val === 'canvas') {
       workspaceStore.activeObject = { id: 'canvas', type: 'canvas', name: 'Canvas' };
    } else {
      const obj = workspaceStore.openObjects.find(o => o.id === val);
      if (obj) workspaceStore.activeObject = obj;
    }
  }
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
          :class="{ 'main-content__tab--active': workspaceStore.activeObject?.id === obj.id }"
          @click="workspaceStore.openObject(obj)"
        >
          {{ obj.name }}
          <span class="main-content__tab-close" @click.stop="workspaceStore.closeObject(obj.id)">×</span>
        </div>
      </div>
      <div class="main-content__actions">
        <button @click="showInfo = !showInfo" class="main-content__action-btn">
          {{ showInfo ? 'Hide Info' : 'Info' }}
        </button>
      </div>
    </div>

    <div class="main-content__body">
      <div class="main-content__view">
        <div v-if="!workspaceStore.activeObject" class="main-content__empty">
          <p>Select a file to view</p>
        </div>

        <div v-else-if="workspaceStore.activeObject.type === 'folder'" class="main-content__folder">
          <FileBrowser />
        </div>

        <div v-else-if="workspaceStore.activeObject.type === 'canvas'" class="main-content__canvas">
          <Canvas :object-id="workspaceStore.activeObject.id" />
        </div>

        <div v-else class="main-content__preview">
          <div class="preview-placeholder">
            <h3>{{ workspaceStore.activeObject.name }}</h3>
            <p>No preview available for {{ workspaceStore.activeObject.type }}</p>
          </div>
        </div>
      </div>

      <aside v-if="showInfo && workspaceStore.activeObject" class="main-content__info">
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
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding-right: 1rem;
}

.main-content__tabs {
  display: flex;
  overflow-x: auto;
}

.main-content__tab {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-right: 1px solid var(--color-border);
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
  border-left: 1px solid var(--color-border);
  overflow-y: auto;
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-muted);
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

.main-content__action-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
