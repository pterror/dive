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
  <div class="main-content">
    <div class="tabs">
      <button 
        class="tabs__tab" 
        :class="{ 'tabs__tab--active': activeTab === 'files' }"
        @click="activeTab = 'files'"
      >Files</button>
      
      <button 
        v-for="obj in workspaceStore.openObjects"
        :key="obj.id"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': activeTab === obj.id }"
        @click="activeTab = obj.id"
      >
        {{ obj.name }}
        <span 
          class="tabs__close" 
          @click.stop="workspaceStore.closeObject(obj.id)"
        >&times;</span>
      </button>

      <!-- Permanent Tools -->
      <button 
        class="tabs__tab" 
        :class="{ 'tabs__tab--active': activeTab === 'canvas' }"
        @click="activeTab = 'canvas'"
      >Canvas</button>
      <button 
        class="tabs__tab" 
        :class="{ 'tabs__tab--active': activeTab === 'calendar' }"
        @click="activeTab = 'calendar'"
      >Calendar</button>
      <button 
        class="tabs__tab" 
        :class="{ 'tabs__tab--active': activeTab === 'history' }"
        @click="activeTab = 'history'"
      >History</button>
    </div>

    <div class="content-area">
      <component :is="activeView" />
    </div>
  </div>
</template>

<style scoped>
.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
  overflow-x: auto;
}

.tabs__tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tabs__tab:hover {
  background-color: var(--color-sidebar-hover);
}

.tabs__tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tabs__close {
  opacity: 0.5;
  font-size: 1.1em;
  line-height: 1;
}

.tabs__close:hover {
  opacity: 1;
  color: var(--color-danger, #ef4444);
}

.content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>

