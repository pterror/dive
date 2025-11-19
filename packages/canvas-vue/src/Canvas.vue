<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { InfiniteCanvas, type Node } from '@dive/canvas';

const canvas = reactive(new InfiniteCanvas());
const container = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const draggingNodeId = ref<string | null>(null);

// Mock initial data
onMounted(() => {
  canvas.addNode({ id: '1', x: 100, y: 100, width: 200, height: 150, type: 'note', data: { title: 'Welcome', content: 'This is a note on the canvas.' } });
  canvas.addNode({ id: '2', x: 400, y: 200, width: 200, height: 150, type: 'image', data: { title: 'Image', src: 'placeholder.jpg' } });
});

function onMouseDown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.canvas-node')) return;
  
  isDragging.value = true;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e: MouseEvent) {
  if (draggingNodeId.value) {
    const dx = (e.clientX - lastMousePos.value.x) / canvas.zoom;
    const dy = (e.clientY - lastMousePos.value.y) / canvas.zoom;
    const node = canvas.nodes.find(n => n.id === draggingNodeId.value);
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
        transformOrigin: '0 0'
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
          height: `${node.height}px`
        }"
        @mousedown="(e) => startDragNode(e, node.id)"
      >
        <div class="canvas-node__header">{{ node.data?.title || 'Node' }}</div>
        <div class="canvas-node__content">
          {{ node.data?.content || node.type }}
        </div>
      </div>
    </div>
    
    <div class="canvas-controls">
      <button @click="canvas.setZoom(canvas.zoom * 1.1)">+</button>
      <button @click="canvas.setZoom(1)">Reset</button>
      <button @click="canvas.setZoom(canvas.zoom * 0.9)">-</button>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
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
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  pointer-events: auto; /* Re-enable events for nodes */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-node__header {
  background: #f9fafb;
  padding: 0.5rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
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
  background: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.canvas-controls button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
