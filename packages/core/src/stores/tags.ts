import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly color?: string;
}

export const useTagStore = defineStore('tags', () => {
  const tags = ref<Tag[]>([
    { id: '1', name: 'work', color: '#ef4444' },
    { id: '2', name: 'personal', color: '#3b82f6' },
    { id: '3', name: 'ideas', color: '#10b981' },
  ]);

  function addTag(name: string) {
    tags.value.push({
      id: Date.now().toString(),
      name,
      color: '#9ca3af'
    });
  }

  return {
    tags,
    addTag
  };
});
