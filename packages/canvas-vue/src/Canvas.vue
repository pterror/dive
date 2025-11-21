<script setup lang="ts">
import { InfiniteCanvas, type Node } from "@dive/canvas";
import { onMounted, reactive, ref, watch } from "vue";

const props = defineProps<{
  objectId?: string;
}>();

const canvas = reactive(new InfiniteCanvas());
const container = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const draggingNodeId = ref<string | null>(null);
const saveStatus = ref<"saved" | "saving" | "error">("saved");
const lastSavedTime = ref<string>("");

// Load initial data
onMounted(async () => {
  if (props.objectId) {
    try {
      const res = await fetch(`/api/objects/${props.objectId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.content && data.content.nodes) {
          data.content.nodes.forEach((n: Node) => canvas.addNode(n));
        }
      }
    } catch (e) {
      console.error("Failed to load canvas:", e);
    }
  } else {
    // Mock initial data if no ID
    canvas.addNode({
      id: "1",
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      type: "note",
      data: { title: "Welcome", content: "This is a note on the canvas." },
    });
    canvas.addNode({
      id: "2",
      x: 400,
      y: 200,
      width: 200,
      height: 150,
      type: "image",
      data: { title: "Image", src: "placeholder.jpg" },
    });
  }
});

async function saveCanvas() {
  if (!props.objectId) return;
  saveStatus.value = "saving";
  try {
    const content = {
      nodes: canvas.nodes,
      edges: [], // TODO: Add edges
    };

    await fetch(`/api/objects/${props.objectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    saveStatus.value = "saved";
    lastSavedTime.value = new Date().toLocaleTimeString();
  } catch (e) {
    console.error("Failed to save:", e);
    saveStatus.value = "error";
  }
}

let saveTimeout: ReturnType<typeof setTimeout>;
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveStatus.value = "saving"; // Show saving immediately on change
  saveTimeout = setTimeout(() => {
    saveCanvas();
  }, 1000);
}

watch(
  () => canvas.nodes,
  () => {
    debouncedSave();
  },
  { deep: true },
);

function onMouseDown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest(".canvas-node")) return;

  isDragging.value = true;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e: MouseEvent) {
  if (draggingNodeId.value) {
    const dx = (e.clientX - lastMousePos.value.x) / canvas.zoom;
    const dy = (e.clientY - lastMousePos.value.y) / canvas.zoom;
    const node = canvas.nodes.find((n) => n.id === draggingNodeId.value);
    if (node) {
      canvas.updateNodePosition(node.id, node.x + dx, node.y + dy);
    }
    lastMousePos.value = { x: e.clientX, y: e.clientY };
    return;
  }

  if (isDragging.value) {
    const dx = e.clientX - lastMousePos.value.x;
    const dy = e.clientY - lastMousePos.value.y;
    canvas.pan(dx, dy);
    lastMousePos.value = { x: e.clientX, y: e.clientY };
  }
}

function onMouseUp() {
  isDragging.value = false;
  draggingNodeId.value = null;
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  const zoomSpeed = 0.001;
  const newZoom = Math.max(0.1, Math.min(5, canvas.zoom - e.deltaY * zoomSpeed));
  canvas.setZoom(newZoom);
}

function startDragNode(e: MouseEvent, nodeId: string) {
  e.stopPropagation();
  draggingNodeId.value = nodeId;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}
</script>

<template>
  <div
    ref="container"
    class="canvas-container"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel="onWheel"
  >
    <div
      class="canvas-viewport"
      :style="{
        transform: `translate(${canvas.x}px, ${canvas.y}px) scale(${canvas.zoom})`,
        transformOrigin: '0 0',
      }"
    >
      <div
        v-for="node in canvas.nodes"
        :key="node.id"
        class="canvas-node"
        :style="{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }"
        @mousedown="(e) => startDragNode(e, node.id)"
      >
        <div class="canvas-node__header">
          {{ node.data?.title || "Node" }}
        </div>
        <div class="canvas-node__content">
          {{ node.data?.content || node.type }}
        </div>
      </div>
    </div>

    <div class="canvas-controls">
      <div class="save-status" :class="saveStatus">
        {{
          saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
              ? "Saved " + lastSavedTime
              : "Error"
        }}
      </div>
      <div class="canvas-controls__divider" />
      <button class="btn-icon" @click="canvas.setZoom(canvas.zoom * 1.1)">+</button>
      <button class="btn-icon" @click="canvas.setZoom(1)">Reset</button>
      <button class="btn-icon" @click="canvas.setZoom(canvas.zoom * 0.9)">-</button>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg);
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.canvas-container:active {
  cursor: grabbing;
}

.canvas-viewport {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let events pass through to container unless hitting a node */
}

.canvas-node {
  position: absolute;
  background: var(--color-surface);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  pointer-events: auto; /* Re-enable events for nodes */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-node__header {
  background: var(--color-surface-hover);
  padding: 0.5rem;
  font-weight: 600;
  cursor: move;
}

.canvas-node__content {
  padding: 0.5rem;
  flex: 1;
  overflow: auto;
}

.canvas-controls {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  background: var(--color-surface);
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.save-status {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
}

.save-status.saved {
  color: var(--color-success);
}

.save-status.saving {
  color: var(--color-primary);
}

.save-status.error {
  color: var(--color-danger);
}
</style>
