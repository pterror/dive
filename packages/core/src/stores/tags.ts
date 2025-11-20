import { defineStore } from "pinia";
import { ref } from "vue";

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly color?: string;
}

export const useTagStore = defineStore("tags", () => {
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
