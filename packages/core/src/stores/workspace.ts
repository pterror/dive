import { defineStore, type StoreDefinition } from "pinia";
import { ref, type Ref } from "vue";
import type { DiveObject } from "../types";

interface WorkspaceStore {
  activeObject: Ref<
    {
      readonly id: string;
      readonly type: string;
      readonly name: string;
      readonly path?: string;
      readonly content?: unknown;
      readonly metadata?: Record<string, unknown>;
    } | null,
    | DiveObject
    | {
        readonly id: string;
        readonly type: string;
        readonly name: string;
        readonly path?: string;
        readonly content?: unknown;
        readonly metadata?: Record<string, unknown>;
      }
    | null
  >;
  openObjects: Ref<
    {
      readonly id: string;
      readonly type: string;
      readonly name: string;
      readonly path?: string;
      readonly content?: unknown;
      readonly metadata?: Record<string, unknown>;
    }[],
    | DiveObject[]
    | {
        readonly id: string;
        readonly type: string;
        readonly name: string;
        readonly path?: string;
        readonly content?: unknown;
        readonly metadata?: Record<string, unknown>;
      }[]
  >;
  openObject: (obj: DiveObject) => void;
  closeObject: (id: string) => void;
}

export const useWorkspaceStore: StoreDefinition<
  "workspace",
  Pick<WorkspaceStore, "activeObject" | "openObjects">,
  object,
  Omit<WorkspaceStore, "activeObject" | "openObjects">
> = defineStore("workspace", () => {
  const activeObject = ref<DiveObject | null>(null);
  const openObjects = ref<DiveObject[]>([]);

  function openObject(obj: DiveObject): void {
    // Check if already open
    const existing = openObjects.value.find((o) => o.id === obj.id);
    if (!existing) {
      openObjects.value.push(obj);
    }
    activeObject.value = obj;
  }

  function closeObject(id: string): void {
    const index = openObjects.value.findIndex((o) => o.id === id);
    if (index !== -1) {
      openObjects.value.splice(index, 1);
      // If we closed the active object, switch to another one
      if (activeObject.value?.id === id) {
        activeObject.value =
          openObjects.value[openObjects.value.length - 1] || null;
      }
    }
  }

  return {
    activeObject,
    openObjects,
    openObject,
    closeObject,
  };
});
