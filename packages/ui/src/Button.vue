<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary";
}>();
</script>

<template>
  <button class="btn" :class="[`btn--${variant || 'primary'}`]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn--primary {
  background-color: var(--color-primary, #3b82f6);
  color: white;
}

.btn--primary:hover {
  background-color: var(--color-primary-hover, #2563eb);
}

.btn--secondary {
  background-color: transparent;
  border: 1px solid var(--color-border, #e5e7eb);
  color: var(--color-text, #1a1a1a);
}
</style>
