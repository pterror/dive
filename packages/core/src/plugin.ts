import type { App, Component } from 'vue';

export interface ObjectType {
  name: string;
  icon?: string;
  // Schema validation, etc.
}

export interface ViewComponent {
  name: string;
  component: Component;
  supports: string[]; // Object types this view supports
}

export interface Plugin {
  name: string;
  version: string;
  types?: ObjectType[];
  views?: ViewComponent[];
  init?: (app: App) => void;
}
