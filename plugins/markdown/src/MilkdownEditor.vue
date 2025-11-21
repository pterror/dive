<script setup lang="ts">
import { Milkdown, useEditor } from "@milkdown/vue";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { ref } from "vue";

const content = ref("# Hello Milkdown\n\nStart typing...");

useEditor((root) => {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, content.value);
      ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
        content.value = markdown;
      });
    })
    .config(nord)
    .use(commonmark)
    .use(listener);
});
</script>

<template>
  <div class="milkdown-container">
    <Milkdown />
  </div>
</template>

<style>
/* Ensure the editor takes full height */
.milkdown-container {
  height: 100%;
  overflow: auto;
}

/* Milkdown Nord theme overrides or adjustments if needed */
.milkdown .editor {
  min-height: 100%;
  padding: 2rem;
  outline: none;
}
</style>
