# Agent Guidance & Project Context

## Tech Stack

- **Framework**: Astro (Host) + Vue (Interactive Islands/Plugins).
- **Styling**: Vanilla CSS (BEM methodology).
- **Desktop**: Electron (Planned wrapper for `apps/web`).
- **Package Manager**: `pnpm` (Workspaces).
- **Database**: Astro DB (LibSQL) - Native integration, server-side.

## Dive: Modular Knowledge Editor

## Fundamental Goal

**To build a modular editor/viewer for arbitrary information.**
The system is designed to be agnostic to the type of data it manages, using a plugin architecture to provide specialized viewers and editors for different "objects" (files, notes, images, canvas graphs, etc.) while maintaining a unified, tag-based organization system.

- **Monorepo Structure**:
  - `apps/web`: Main entry point, handles routing, layout, and plugin loading.
  - `packages/core`: Shared types, Database client, Plugin registry/interface.
  - `packages/ui`: Shared Vue design system components.
  - `packages/canvas`: **Pure TypeScript** infinite canvas logic (Coordinate system, Node management). Framework agnostic.
  - `packages/canvas-vue`: Vue components that render `packages/canvas` state.
  - `plugins/*`: Granular features.
    - `plugins/markdown`: Text editing.
    - `plugins/canvas`: Whiteboard/Spatial view (uses `packages/canvas-vue`).
    - `plugins/image`: Image viewer.
    - `plugins/video`: Video player.

## Core Concepts

- **The "Object"**: Fundamental unit of data (File, Note, Link, etc.).
- **Navigation**: Tag-based > Folder-based.
- **Canvas**: Should be simple initially but extensible enough for future Node Graph/Flowchart plugins.

## Locations

- **Design Docs**: `docs/design/` (Update `design_decisions.md` when making significant architectural choices).
- **Style Guide**: `docs/style.md` (Follow TypeScript `readonly` preferences).
- **Workflows**: `.agent/workflows/`

## Development Patterns & Gotchas

- **Vue Reactivity**:
  - **ALWAYS** use `storeToRefs` when destructuring state from Pinia stores.
    - _Bad_: `const { tags } = useTagStore();` (Breaks reactivity)
    - _Good_: `const { tags } = storeToRefs(useTagStore());`
- **Database**:
  - The SQLite database file is located at `apps/web/dive.db`.
  - **DO NOT** commit this file to git. It is already in `.gitignore`.
- **Astro + Vue**:
  - We use a **Single App** architecture. Do not try to mount multiple isolated Vue islands if they need to share complex state.
  - Modify `apps/web/src/components/App.vue` for high-level layout changes.
- **UI Consistency**:
  - Ensure common elements (`a`, `button`, `input`, etc.) rely on global styles defined in `apps/web/src/styles/global.css` rather than component-scoped styles.
