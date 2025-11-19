import type { Plugin } from '@dive/core';
import CalendarView from './CalendarView.vue';

export const CalendarPlugin: Plugin = {
  name: 'calendar',
  version: '0.0.1',
  views: [
    {
      name: 'Calendar',
      component: CalendarView,
      supports: ['calendar']
    }
  ],
  init(_app) {
    console.log('Calendar Plugin Initialized');
  }
};

export { CalendarView };
