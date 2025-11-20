# Design Decisions

## Fundamental Goal

**To build a modular editor/viewer for arbitrary information.**
We prioritize flexibility and extensibility. The core application is a shell that manages state and data persistence, while features are implemented as granular plugins.

## Tech Stack

- **Framework**: Astro + Vue
  - _Reasoning_: User preference. Astro handles static content well and allows for island architecture, while Vue is great for the interactive "editor" parts.
- **Styling**: Vanilla CSS (BEM)
  - _Reasoning_: User preference for simplicity and maintainability without build steps.
- **Desktop Wrapper**: Electron (Planned)
  - _Reasoning_: User mentioned it. Allows local file system access which is crucial for a "File browser" feature.

## Architecture

- **Pattern**: Modular Plugin System (Monorepo)
  - **Core**: Handles DB connection, global state, routing, and UI shell.
  - **Single App Mode**: The main interface is a single Vue app (`<App />`) mounted by Astro.
    - _Reasoning_: Ensures a single Pinia instance for shared state across Sidebar, MainContent, and Plugins.
  - **Packages**:
    - `canvas`: Pure TS logic for infinite canvas.
    - `canvas-vue`: Vue components for canvas.
  - **Plugins**: Granular feature sets.
    - `plugin-markdown`: Text/Markdown editing.
    - `plugin-canvas`: Infinite canvas/whiteboard (Uses `canvas-vue`).
    - `plugin-image`: Image viewer.
    - `plugin-video`: Video player.
    - _Future_: `plugin-audio` (DAW-like), `plugin-image-editor`.
  - **Composition**: Build-time composition.

## Core Concepts

- **The "Object"**: The fundamental unit of data.
  - Needs to be flexible (JSON-like).
  - Must support tagging.
  - Types: File, Link, Event, Timer, etc.
- **Navigation**: Tag-based > Folder-based.
  - Search tagging should be the primary way to find things.

## Data Storage

- **Database**: Astro DB (LibSQL)
  - _Reasoning_: Native Astro integration, simpler deployment, supports SQL with a type-safe ORM-like interface (`astro:db`).
  - **Architecture**: Centralized database for all objects and metadata.
  - **Web Compatibility**: Runs on the server-side (Node.js adapter) of Astro.

## Data Model

- **Objects Table**:
  - `id`, `type`, `name`, `path`, `content` (JSON), `created_at`, `updated_at`.
  - **Properties (JSON)**: A flexible column for arbitrary metadata (e.g., `author`, `episode`, `rating`).
- **Tags**: Separate table for high-level grouping/filtering.
- **Smart Fields Strategy**:
  - The UI (`PropertiesPanel`) presents a unified interface for metadata.
  - Currently stores values as simple text/numbers in the `properties` JSON.
  - _Future_: Will support "Relations" (links to other objects) transparently within the same UI.

## UI/UX

- **Infinite Canvas**: Custom implementation (no external heavy libs).
  - Split into `packages/canvas` (Logic) and `packages/canvas-vue` (UI).
  - decoupled from "Notes".
  - Reusable engine for future plugins (e.g. Audio nodes).
  - _Goal_: Simple core, but extensible enough for future Node Graph/Flowchart plugins.
- **Modular Views**: Plugins register views for specific object types.
- **Glass Theme Strategy**:
  - **Colors**: Uses `oklch` color space for perceptual uniformity.
  - **Transparency**: Uses inverted base colors for transparent elements to ensure contrast:
    - _Light Mode_: Dark base with low opacity ("Smoked Glass").
    - _Dark Mode_: Light base with low opacity ("Frosted Glass").
  - **Hue**: A global `--hue` variable tints all neutral colors for cohesion.

## State Management

- **Single Vue App**:
  - **Problem**: Astro Islands (`client:load`) create separate Vue instances, causing "Active Pinia" errors when sharing stores.
  - **Solution**: We mount a single root Vue component (`<App />`) in `index.astro`. This ensures one consistent Pinia instance for the entire interactive application.
  - **Pattern**: `apps/web/src/_app.ts` handles the global Vue setup (Pinia, Router, etc.).
