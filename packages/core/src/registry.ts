import type { App } from "vue";
import type { ObjectType, Plugin, ViewComponent } from "./plugin";

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();
  private types: Map<string, ObjectType> = new Map();
  private views: Map<string, ViewComponent[]> = new Map();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} already registered.`);
      return;
    }
    this.plugins.set(plugin.name, plugin);

    if (plugin.types) {
      for (const type of plugin.types) {
        this.types.set(type.name, type);
      }
    }

    if (plugin.views) {
      for (const view of plugin.views) {
        for (const type of view.supports) {
          if (!this.views.has(type)) {
            this.views.set(type, []);
          }
          this.views.get(type)?.push(view);
        }
      }
    }
  }

  initAll(app: App): void {
    for (const plugin of this.plugins.values()) {
      if (plugin.init) {
        plugin.init(app);
      }
    }
  }

  getViewsForType(type: string): ViewComponent[] {
    return this.views.get(type) || [];
  }

  getPluginForType(type: string): Plugin | undefined {
    // Find a plugin that supports this type via its views
    for (const [, plugin] of this.plugins.entries()) {
      if (plugin.views?.some((view) => view.supports.includes(type))) {
        return plugin;
      }
    }
    return undefined;
  }
}

export const registry: PluginRegistry = new PluginRegistry();
