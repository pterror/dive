import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DiveObject } from '../types';

export const useWorkspaceStore = defineStore('workspace', () => {
  const activeObject = ref<DiveObject | null>(null);
  const openObjects = ref<DiveObject[]>([]);

  function openObject(obj: DiveObject) {
    // Check if already open
    const existing = openObjects.value.find(o => o.id === obj.id);
    if (!existing) {
      openObjects.value.push(obj);
    }
    activeObject.value = obj;
  }

  function closeObject(id: string) {
    const index = openObjects.value.findIndex(o => o.id === id);
    if (index !== -1) {
      openObjects.value.splice(index, 1);
      // If we closed the active object, switch to another one
      if (activeObject.value?.id === id) {
        activeObject.value = openObjects.value[openObjects.value.length - 1] || null;
      }
    }
  }

  return {
    activeObject,
    openObjects,
    openObject,
    closeObject
  };
});
