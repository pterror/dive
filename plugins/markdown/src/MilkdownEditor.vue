<script setup lang="ts">
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, useEditor } from "@milkdown/vue";
import { ref } from "vue";

const props = defineProps<{
  objectId: string;
}>();

const content = ref("");
const loading = ref(true);

// Fetch content
async function fetchContent() {
  try {
    const res = await fetch(`/api/objects/${props.objectId}`);
    if (res.ok) {
      const data = await res.json();
      content.value =
        typeof data.content === "object" ? (data.content.content ?? "") : (data.content ?? "");
    }
  } catch (e) {
    console.error("Failed to load content", e);
  } finally {
    loading.value = false;
  }
}

// Save content (debounced)
let saveTimeout: ReturnType<typeof setTimeout>;
function saveContent(markdown: string) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await fetch(`/api/objects/${props.objectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: markdown }),
      });
    } catch (e) {
      console.error("Failed to save content", e);
    }
  }, 1000);
}

// Initial fetch
fetchContent();

useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, content.value);
      ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
        if (!loading.value) {
          saveContent(markdown);
        }
      });
    })
    .config(nord)
    .use(commonmark)
    .use(listener);
}); // Re-create editor when loading finishes (to set defaultValue)
</script>

<template>
  <div class="milkdown-container">
    <Milkdown v-if="!loading" />
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<style>
/* Ensure the editor takes full height */
.milkdown-container {
  height: 100%;
  overflow: auto;
}

.loading {
  padding: 2rem;
  color: var(--color-text-muted);
}

/* Milkdown Nord theme overrides or adjustments if needed */
.milkdown .editor {
  min-height: 100%;
  padding: 2rem;
  outline: none;
}
</style>
