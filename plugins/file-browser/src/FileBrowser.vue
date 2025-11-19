<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { FileObject } from './types';
import { Button } from '@dive/ui';
import { useSearchStore, useWorkspaceStore } from '@dive/core';

const searchStore = useSearchStore();
const workspaceStore = useWorkspaceStore();
const files = ref<readonly FileObject[]>([]);
const currentPath = ref('/');

// Mock data for now
const mockFiles: readonly FileObject[] = [
  { id: '1', name: 'Documents', path: '/Documents', isDirectory: true, updatedAt: Date.now() },
  { id: '2', name: 'Images', path: '/Images', isDirectory: true, updatedAt: Date.now() },
  { id: '3', name: 'notes.md', path: '/notes.md', isDirectory: false, size: 1024, updatedAt: Date.now() },
  { id: '4', name: 'photo.jpg', path: '/photo.jpg', isDirectory: false, size: 2048, updatedAt: Date.now() },
  { id: '5', name: 'video.mp4', path: '/video.mp4', isDirectory: false, size: 4096, updatedAt: Date.now() },
];

const filteredFiles = computed(() => {
  if (!searchStore.query) return files.value;
  const q = searchStore.query.toLowerCase();
  return files.value.filter(f => f.name.toLowerCase().includes(q));
});

onMounted(() => {
  files.value = mockFiles;
});

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['md', 'markdown'].includes(ext)) return 'markdown';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['mp4', 'webm'].includes(ext)) return 'video';
  return 'text';
}

function navigate(file: FileObject) {
  if (file.isDirectory) {
    currentPath.value = file.path;
    // In a real app, fetch new files here
    console.log('Navigating to', file.path);
  } else {
    console.log('Opening file', file.path);
    workspaceStore.openObject({
      id: file.id,
      type: getFileType(file.name),
      name: file.name,
      path: file.path
    });
  }
}
</script>

<template>
  <div class="file-browser">
    <div class="file-browser__header">
      <span class="file-browser__path">{{ currentPath }}</span>
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
          {{ file.isDirectory ? '📁' : '📄' }}
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

.file-browser__path {
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--color-text);
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
