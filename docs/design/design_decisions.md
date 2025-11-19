# Design Decisions

## Tech Stack
- **Framework**: Astro + Vue
  - *Reasoning*: User preference. Astro handles static content well and allows for island architecture, while Vue is great for the interactive "editor" parts.
- **Styling**: TailwindCSS
  - *Reasoning*: Rapid development, consistent design system.
- **Desktop Wrapper**: Electron (Planned)
  - *Reasoning*: User mentioned it. Allows local file system access which is crucial for a "File browser" feature.

## Architecture
- **Pattern**: Modular Plugin System (Monorepo)
  - **Core**: Handles DB connection, global state, routing, and UI shell.
  - **Packages**:
    - `canvas`: Pure TS logic for infinite canvas.
    - `canvas-vue`: Vue components for canvas.
  - **Plugins**: Granular feature sets.
    - `plugin-markdown`: Text/Markdown editing.
    - `plugin-canvas`: Infinite canvas/whiteboard (Uses `canvas-vue`).
    - `plugin-image`: Image viewer.
    - `plugin-video`: Video player.
    - *Future*: `plugin-audio` (DAW-like), `plugin-image-editor`.
  - **Composition**: Build-time composition.

## Core Concepts
- **The "Object"**: The fundamental unit of data.
  - Needs to be flexible (JSON-like).
  - Must support tagging.
  - Types: File, Link, Event, Timer, etc.
- **Navigation**: Tag-based > Folder-based.
  - Search tagging should be the primary way to find things.

## Data Storage
- **Database**: SQLite (`better-sqlite3`)
  - *Reasoning*: Fast, reliable, single-file (easy to backup/move), supports JSON columns for flexible "Object" schema.
  - **Architecture**: Centralized database for all objects and metadata.
  - **Web Compatibility**: Will run on the server-side (Node.js) of Astro.

## UI/UX
- **Infinite Canvas**: Custom implementation (no external heavy libs).
  - Split into `packages/canvas` (Logic) and `packages/canvas-vue` (UI).
  - decoupled from "Notes".
  - Reusable engine for future plugins (e.g. Audio nodes).
  - *Goal*: Simple core, but extensible enough for future Node Graph/Flowchart plugins.
- **Modular Views**: Plugins register views for specific object types.
