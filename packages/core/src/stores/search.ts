import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const query = ref<string>('');
  const selectedTag = ref<string | null>(null);

  function setQuery(q: string) {
    query.value = q;
  }

  function toggleTag(tagId: string) {
    if (selectedTag.value === tagId) {
      selectedTag.value = null;
    } else {
      selectedTag.value = tagId;
    }
  }

  return {
    query,
    selectedTag,
    setQuery,
    toggleTag
  };
});
