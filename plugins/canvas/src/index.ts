import type { Plugin } from '@dive/core';
import { Canvas } from '@dive/canvas-vue';

export const CanvasPlugin: Plugin = {
  name: 'canvas',
  version: '0.0.1',
  views: [
    {
      name: 'Infinite Canvas',
      component: Canvas,
      supports: ['canvas', 'application/x-canvas']
    }
  ],
  init(_app) {
    console.log('Canvas Plugin Initialized');
  }
};

export { Canvas };
