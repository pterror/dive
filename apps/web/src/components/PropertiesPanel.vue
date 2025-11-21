<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
  objectId: string;
}>();

const properties = ref<Record<string, any>>({});
const relations = ref<any[]>([]);
const allObjects = ref<any[]>([]);

const newKey = ref("");
const newValue = ref("");
const isSaving = ref(false);
const addMode = ref<"text" | "link">("text");
const selectedTargetId = ref("");

async function fetchProperties() {
  try {
    const res = await fetch(`/api/objects/${props.objectId}`);
    if (res.ok) {
      const data = await res.json();
      properties.value = data.properties || {};
    }
  } catch (e) {
    console.error("Failed to fetch properties:", e);
  }
}

async function fetchRelations() {
  try {
    const res = await fetch(`/api/objects/${props.objectId}/relations`);
    if (res.ok) {
      relations.value = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch relations:", e);
  }
}

async function fetchAllObjects() {
  try {
    const res = await fetch("/api/objects");
    if (res.ok) {
      allObjects.value = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch objects:", e);
  }
}

async function saveProperties() {
  isSaving.value = true;
  try {
    await fetch(`/api/objects/${props.objectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ properties: properties.value }),
    });
  } catch (e) {
    console.error("Failed to save properties:", e);
  } finally {
    isSaving.value = false;
  }
}

async function addRelation() {
  if (!newKey.value || !selectedTargetId.value) return;

  try {
    const res = await fetch("/api/relations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceId: props.objectId,
        targetId: selectedTargetId.value,
        type: newKey.value,
      }),
    });

    if (res.ok) {
      await fetchRelations();
      newKey.value = "";
      selectedTargetId.value = "";
    }
  } catch (e) {
    console.error("Failed to add relation:", e);
  }
}

function addProperty() {
  if (!newKey.value) return;

  if (addMode.value === "link") {
    addRelation();
    return;
  }

  properties.value[newKey.value] = newValue.value;
  newKey.value = "";
  newValue.value = "";
  saveProperties();
}

function removeProperty(key: string) {
  delete properties.value[key];
  saveProperties();
}

async function removeRelation(id: string) {
  try {
    await fetch(`/api/relations/${id}`, { method: "DELETE" });
    await fetchRelations();
  } catch (e) {
    console.error("Failed to remove relation:", e);
  }
}

function updateProperty(key: string, value: any) {
  properties.value[key] = value;
  saveProperties();
}

watch(
  () => props.objectId,
  () => {
    fetchProperties();
    fetchRelations();
  },
);

onMounted(() => {
  fetchProperties();
  fetchRelations();
  fetchAllObjects();
});

const availableTargets = computed(() => {
  return allObjects.value.filter((obj) => obj.id !== props.objectId);
});
</script>

<template>
  <div class="properties-panel">
    <div class="properties-panel__header">
      <h3 class="properties-panel__title">Properties</h3>
    </div>

    <div class="properties-panel__list">
      <!-- Standard Properties -->
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

      <!-- Relations -->
      <div
        v-for="relation in relations"
        :key="relation.id"
        class="property-item property-item--relation"
      >
        <div class="property-item__header">
          <span class="property-item__key property-item__key--link">{{ relation.type }}</span>
          <button class="property-item__remove" @click="removeRelation(relation.id)">×</button>
        </div>
        <div class="property-item__link">
          <span class="link-icon">🔗</span>
          <span class="link-name">{{ relation.otherObject?.name || "Unknown" }}</span>
          <span class="link-type">({{ relation.otherObject?.type }})</span>
        </div>
      </div>
    </div>

    <div class="properties-panel__add">
      <div class="add-mode-switch">
        <button :class="{ active: addMode === 'text' }" @click="addMode = 'text'">Text</button>
        <button :class="{ active: addMode === 'link' }" @click="addMode = 'link'">Link</button>
      </div>

      <div class="add-inputs">
        <input
          v-model="newKey"
          placeholder="Key (e.g. Author)"
          class="properties-panel__input"
          @keyup.enter="addProperty"
        />

        <input
          v-if="addMode === 'text'"
          v-model="newValue"
          placeholder="Value"
          class="properties-panel__input"
          @keyup.enter="addProperty"
        />

        <select v-else v-model="selectedTargetId" class="properties-panel__select">
          <option value="" disabled>Select Target</option>
          <option v-for="obj in availableTargets" :key="obj.id" :value="obj.id">
            {{ obj.name }}
          </option>
        </select>

        <button class="properties-panel__add-btn" @click="addProperty">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  padding: 1rem;
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

.property-item__key--link {
  color: var(--color-primary);
}

.property-item__remove {
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
}

.property-item__remove:hover {
  color: var(--color-danger);
}

.property-item__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem;
  border-radius: 0.25rem;
  background: var(--color-surface-hover);
  color: var(--color-text);
  font-size: 0.875rem;
}

.link-icon {
  font-size: 0.75rem;
}

.link-type {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.properties-panel__add {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.add-mode-switch {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.add-mode-switch button {
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.add-mode-switch button.active {
  background: var(--color-surface-hover);
  color: var(--color-primary);
  font-weight: 600;
}

.add-inputs {
  display: flex;
  gap: 0.5rem;
}

.properties-panel__input,
.properties-panel__select {
  flex: 1;
  padding: 0.375rem;
  border-radius: 0.25rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  min-width: 0;
}

.properties-panel__add-btn {
  padding: 0 0.75rem;
  background: var(--color-surface-hover);
  border-radius: 0.25rem;
  cursor: pointer;
  color: var(--color-text);
}

.properties-panel__add-btn:hover {
  background: var(--color-border);
}
</style>
