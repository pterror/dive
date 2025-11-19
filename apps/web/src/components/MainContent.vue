<script setup lang="ts">
import { ref } from 'vue';
import { FileBrowser } from '@dive/plugin-file-browser';
import { MarkdownEditor } from '@dive/plugin-markdown';
import { Canvas } from '@dive/plugin-canvas';

const activeTab = ref('files');
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
        class="tabs__tab" 
        :class="{ 'tabs__tab--active': activeTab === 'markdown' }"
        @click="activeTab = 'markdown'"
      >Markdown</button>
      <button 
        class="tabs__tab" 
        :class="{ 'tabs__tab--active': activeTab === 'canvas' }"
        @click="activeTab = 'canvas'"
      >Canvas</button>
    </div>

    <div class="content-area">
      <div v-if="activeTab === 'files'" class="content-area__pane">
        <FileBrowser />
      </div>
      <div v-if="activeTab === 'markdown'" class="content-area__pane">
        <MarkdownEditor />
      </div>
      <div v-if="activeTab === 'canvas'" class="content-area__pane">
        <Canvas />
      </div>
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
}

.tabs__tab:hover {
  background-color: var(--color-sidebar-hover);
}

.tabs__tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.content-area__pane {
  height: 100%;
  width: 100%;
}
</style>
