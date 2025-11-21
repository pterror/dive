import { defineStore, type StoreDefinition } from "pinia";
import { ref, type Ref } from "vue";

export interface Filter {
  id: string;
  type: "tag" | "date" | "type";
  value: string;
  label: string;
}

interface SearchStore {
  query: Ref<string, string>;
  filters: Ref<
    {
      id: string;
      type: "tag" | "date" | "type";
      value: string;
      label: string;
    }[],
    | Filter[]
    | {
        id: string;
        type: "tag" | "date" | "type";
        value: string;
        label: string;
      }[]
  >;
  setQuery: (q: string) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (filterId: string) => void;
  clearFilters: () => void;
  toggleFilter: (filter: Filter) => void;
}

export const useSearchStore: StoreDefinition<
  "search",
  Pick<SearchStore, "query" | "filters">,
  object,
  Omit<SearchStore, "query" | "filters">
> = defineStore("search", () => {
  const query = ref<string>("");
  const filters = ref<Filter[]>([]);

  function setQuery(q: string): void {
    query.value = q;
  }

  function addFilter(filter: Filter): void {
    // Avoid duplicates
    if (!filters.value.some((f) => f.id === filter.id && f.type === filter.type)) {
      filters.value.push(filter);
    }
  }

  function removeFilter(filterId: string): void {
    filters.value = filters.value.filter((f) => f.id !== filterId);
  }

  function clearFilters(): void {
    filters.value = [];
  }

  function toggleFilter(filter: Filter): void {
    const index = filters.value.findIndex((f) => f.id === filter.id && f.type === filter.type);
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
