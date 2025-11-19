import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const query = ref<string>('');

  function setQuery(newQuery: string) {
    query.value = newQuery;
  }

  return {
    query,
    setQuery
  };
});
