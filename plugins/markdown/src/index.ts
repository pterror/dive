import type { Plugin } from '@dive/core';
import MarkdownEditor from './MarkdownEditor.vue';

export const MarkdownPlugin: Plugin = {
  name: 'markdown',
  version: '0.0.1',
  views: [
    {
      name: 'Markdown Editor',
      component: MarkdownEditor,
      supports: ['markdown', 'text/markdown']
    }
  ],
  init(_app) {
    console.log('Markdown Plugin Initialized');
  }
};

export { MarkdownEditor };
