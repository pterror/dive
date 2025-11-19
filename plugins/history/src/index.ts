import type { Plugin } from '@dive/core';
import HistoryView from './HistoryView.vue';

export const HistoryPlugin: Plugin = {
  name: 'history',
  version: '0.0.1',
  views: [
    {
      name: 'History',
      component: HistoryView,
      supports: ['history']
    }
  ],
  init(_app) {
    console.log('History Plugin Initialized');
  }
};

export { HistoryView };
