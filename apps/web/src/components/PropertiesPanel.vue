<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  objectId: string;
}>();

const properties = ref<Record<string, any>>({});
const newKey = ref('');
const newValue = ref('');
const isSaving = ref(false);

async function fetchProperties() {
  try {
    const res = await fetch(`/api/objects/${props.objectId}`);
    if (res.ok) {
      const data = await res.json();
      properties.value = data.properties || {};
    }
  } catch (e) {
    console.error('Failed to fetch properties:', e);
  }
}

async function saveProperties() {
  isSaving.value = true;
  try {
    await fetch(`/api/objects/${props.objectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties: properties.value })
    });
  } catch (e) {
    console.error('Failed to save properties:', e);
  } finally {
    isSaving.value = false;
  }
}

function addProperty() {
  if (!newKey.value) return;
  properties.value[newKey.value] = newValue.value;
  newKey.value = '';
  newValue.value = '';
  saveProperties();
}

function removeProperty(key: string) {
  delete properties.value[key];
  saveProperties();
}

function updateProperty(key: string, value: any) {
  properties.value[key] = value;
  saveProperties();
}

watch(() => props.objectId, () => {
  fetchProperties();
});

onMounted(() => {
  fetchProperties();
});
</script>

<template>
  <div class="properties-panel">
    <div class="properties-panel__header">
      <h3 class="properties-panel__title">Properties</h3>
    </div>

    <div class="properties-panel__list">
      <div v-for="(value, key) in properties" :key="key" class="property-item">
        <div class="property-item__header">
          <span class="property-item__key">{{ key }}</span>
          <button class="property-item__remove" @click="removeProperty(key)">×</button>
        </div>
        <input 
          class="property-item__input"
          :value="value"
          @change="(e) => updateProperty(key, (e.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="properties-panel__add">
      <input 
        v-model="newKey" 
        placeholder="Key" 
        class="properties-panel__input"
        @keyup.enter="addProperty"
      />
      <input 
        v-model="newValue" 
        placeholder="Value" 
        class="properties-panel__input"
        @keyup.enter="addProperty"
      />
      <button @click="addProperty" class="properties-panel__add-btn">+</button>
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  padding: 1rem;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.properties-panel__header {
  margin-bottom: 1rem;
}

.properties-panel__title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.properties-panel__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.property-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-item__key {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.property-item__remove {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
}

.property-item__remove:hover {
  color: var(--color-danger);
}

.property-item__input {
  width: 100%;
  padding: 0.375rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
}

.properties-panel__add {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.properties-panel__input {
  flex: 1;
  padding: 0.375rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  min-width: 0;
}

.properties-panel__add-btn {
  padding: 0 0.75rem;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  cursor: pointer;
  color: var(--color-text);
}

.properties-panel__add-btn:hover {
  background: var(--color-border);
}
</style>
