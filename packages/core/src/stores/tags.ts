import { defineStore, type StoreDefinition } from "pinia";
import { ref, type Ref } from "vue";

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly color?: string;
}

interface TagStore {
  tags: Ref<
    {
      readonly id: string;
      readonly name: string;
      readonly color?: string;
    }[],
    | Tag[]
    | {
        readonly id: string;
        readonly name: string;
        readonly color?: string;
      }[]
  >;
  fetchTags: () => Promise<void>;
  addTag: (name: string, color?: string) => Promise<void>;
}

export const useTagStore: StoreDefinition<
  "tags",
  Pick<TagStore, "tags">,
  object,
  Omit<TagStore, "tags">
> = defineStore("tags", () => {
  const tags = ref<Tag[]>([]);

  async function fetchTags() {
    try {
      const res = await fetch("/api/tags");
      if (res.ok) {
        tags.value = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch tags:", e);
    }
  }

  async function addTag(name: string, color?: string) {
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (res.ok) {
        const newTag = await res.json();
        tags.value.push(newTag);
      }
    } catch (e) {
      console.error("Failed to add tag:", e);
    }
  }

  return {
    tags,
    fetchTags,
    addTag,
  };
});
