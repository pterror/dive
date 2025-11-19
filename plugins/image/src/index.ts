import type { Plugin } from '@dive/core';
import ImageViewer from './ImageViewer.vue';

export const ImagePlugin: Plugin = {
  name: 'image',
  version: '0.0.1',
  views: [
    {
      name: 'Image Viewer',
      component: ImageViewer,
      supports: ['image', 'image/jpeg', 'image/png', 'image/gif']
    }
  ],
  init(_app) {
    console.log('Image Plugin Initialized');
  }
};

export { ImageViewer };
