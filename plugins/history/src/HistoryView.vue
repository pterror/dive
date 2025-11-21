<script setup lang="ts">
import { ref } from "vue";

interface HistoryItem {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly visitedAt: number;
}

// Mock data
const history = ref<readonly HistoryItem[]>([
  { id: "1", title: "Google", url: "https://google.com", visitedAt: Date.now() - 100000 },
  { id: "2", title: "GitHub", url: "https://github.com", visitedAt: Date.now() - 200000 },
  { id: "3", title: "Vue.js", url: "https://vuejs.org", visitedAt: Date.now() - 300000 },
]);

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}
</script>

<template>
  <div class="history-view">
    <div class="history-view__list">
      <div v-for="item in history" :key="item.id" class="history-item">
        <div class="history-item__content">
          <div class="history-item__title">{{ item.title }}</div>
          <div class="history-item__url">{{ item.url }}</div>
        </div>
        <div class="history-item__time">{{ formatTime(item.visitedAt) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-view {
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
}

.history-view__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--color-sidebar-hover);
}

.history-item__title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.history-item__url {
  font-size: 0.75rem;
  color: #6b7280;
}

.history-item__time {
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
