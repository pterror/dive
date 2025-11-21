import type { App, Component } from "vue";

export interface ObjectType {
  readonly name: string;
  readonly icon?: string;
  // Schema validation, etc.
}

export interface ViewComponent {
  readonly name: string;
  readonly component: Component;
  readonly supports: readonly string[]; // Object types this view supports
}

export interface Plugin {
  readonly name: string;
  readonly version: string;
  readonly types?: readonly ObjectType[];
  readonly views?: readonly ViewComponent[];
  readonly init?: (app: App) => void;
}
