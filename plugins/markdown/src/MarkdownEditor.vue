<script setup lang="ts">
import { computed, ref } from "vue";
import { marked } from "marked";

const content = ref<string>("# Hello Markdown\n\nStart typing...");
const isEditing = ref<boolean>(true);

const renderedContent = computed(() => {
  return marked.parse(content.value);
});

function toggleMode() {
  isEditing.value = !isEditing.value;
}
</script>

<template>
  <div class="markdown-editor">
    <div class="markdown-editor__toolbar">
      <button @click="toggleMode" class="markdown-editor__toggle">
        {{ isEditing ? "Preview" : "Edit" }}
      </button>
    </div>

    <div v-if="isEditing" class="markdown-editor__edit">
      <textarea
        v-model="content"
        class="markdown-editor__textarea"
        placeholder="Type markdown here..."
      ></textarea>
    </div>

    <div v-else class="markdown-editor__preview" v-html="renderedContent"></div>
  </div>
</template>

<style scoped>
.markdown-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.markdown-editor__toolbar {
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
}

.markdown-editor__toggle {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  color: var(--color-text);
}

.markdown-editor__edit,
.markdown-editor__preview {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.markdown-editor__textarea {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  font-family: monospace;
  font-size: 1rem;
  background: transparent;
  color: var(--color-text);
  outline: none;
}
</style>
