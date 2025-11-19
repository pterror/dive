import type { App } from 'vue';
import type { Plugin, ObjectType, ViewComponent } from './plugin';

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();
  private types: Map<string, ObjectType> = new Map();
  private views: Map<string, ViewComponent[]> = new Map();

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} already registered.`);
      return;
    }
    this.plugins.set(plugin.name, plugin);

    if (plugin.types) {
      plugin.types.forEach(type => {
        this.types.set(type.name, type);
      });
    }

    if (plugin.views) {
      plugin.views.forEach(view => {
        view.supports.forEach(type => {
          if (!this.views.has(type)) {
            this.views.set(type, []);
          }
          this.views.get(type)?.push(view);
        });
      });
    }
  }

  initAll(app: App) {
    this.plugins.forEach(plugin => {
      if (plugin.init) {
        plugin.init(app);
      }
    });
  }

  getViewsForType(type: string): ViewComponent[] {
    return this.views.get(type) || [];
  }

  getPluginForType(type: string): Plugin | undefined {
    // Find a plugin that supports this type via its views
    for (const [, plugin] of this.plugins.entries()) {
      if (plugin.views?.some(view => view.supports.includes(type))) {
        return plugin;
      }
    }
    return undefined;
  }
}

export const registry = new PluginRegistry();
