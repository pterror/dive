import { defineStore } from "pinia";
import { ref } from "vue";

export interface Filter {
  id: string;
  type: "tag" | "date" | "type";
  value: string;
  label: string;
}

export const useSearchStore = defineStore("search", () => {
  const query = ref<string>("");
  const filters = ref<Filter[]>([]);

  function setQuery(q: string) {
    query.value = q;
  }

  function addFilter(filter: Filter) {
    // Avoid duplicates
    if (
      !filters.value.some((f) => f.id === filter.id && f.type === filter.type)
    ) {
      filters.value.push(filter);
    }
  }

  function removeFilter(filterId: string) {
    filters.value = filters.value.filter((f) => f.id !== filterId);
  }

  function clearFilters() {
    filters.value = [];
  }

  function toggleFilter(filter: Filter) {
    const index = filters.value.findIndex(
      (f) => f.id === filter.id && f.type === filter.type,
    );
    if (index >= 0) {
      filters.value.splice(index, 1);
    } else {
      filters.value.push(filter);
    }
  }

  return {
    query,
    filters,
    setQuery,
    addFilter,
    removeFilter,
    clearFilters,
    toggleFilter,
  };
});
