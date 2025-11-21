# TypeScript Style Guide

## Immutability

- Prefer `readonly` on every property and array/tuple type.
- Use `Readonly<T>` or `readonly T[]` where appropriate.

### Examples

```typescript
// Good
interface Point {
  readonly x: number;
  readonly y: number;
}

const points: readonly Point[] = [];

// Bad
interface Point {
  x: number;
  y: number;
}

const points: Point[] = [];
```

# CSS & UI Style Guide

## Layout Principles

- **Container Responsibility**: Let the parent container define geometry (width, height, positioning). The child component should fill the space (`width: 100%`, `height: 100%`) or be flexible.
  - _Avoid_: Setting fixed widths (`width: 250px`) on components that might be used in different contexts.
  - _Prefer_: `flex-basis`, `width: 100%`, or `ch` units for text containers.
- **Box Model**:
  - We apply `box-sizing: border-box` globally.
  - _Gotcha_: Without this, `width: 100%` + `padding` causes overflow (the issue we saw with the Sidebar/Search). Always ensure this reset is present.
- **Spacing**:
  - Use `gap` in flex/grid containers instead of margins on children.
  - Avoid double padding. If a container has padding, the child usually shouldn't, unless it's a card.
- **Backgrounds**:
  - Be mindful of stacking backgrounds. If a parent has a background, the child should usually be transparent unless it's a distinct card/surface.
  - _Gotcha_: A component with a background color inside a container with the same background color can look confusing or cause transparency buildup issues.

## Theming (Glass/OKLCH)

- **Colors**: Use `oklch` variables from `global.css`.
- **Transparency**:
  - Use the "Inverted Base" strategy for transparent backgrounds to ensure contrast:
    - Light Mode: Dark base + Low Opacity (`oklch(20% ... / 0.05)`).
    - Dark Mode: Light base + Low Opacity (`oklch(95% ... / 0.05)`).
  - _Do not_ just use white/black with opacity, as it looks washed out.
- **Hue**: Use `var(--hue)` to tint neutral colors.

## Global Styles

- Avoid scoping these styles to specific components if they are generic.

## Common Elements

- **Unified Styling**: Styles for common elements (e.g. `a`, `button`, `select`, `input`) should be unified across the entire app in `apps/web/src/styles/global.css`.
- **Avoid Overrides**: Do not create specific styles for these elements in individual components unless it is a special case (e.g. a primary call-to-action button vs a standard button).

## Linting & Code Quality

### No Explicit Any

Avoid using `any` type. It defeats the purpose of TypeScript.

- **Bad**: `const data: any = ...`
- **Good**: `const data: unknown = ...` or define a proper type.

### Iteration

Avoid `forEach`. Use `for...of` loops instead.

- **Bad**:
  ```ts
  items.forEach((item) => {
    // ...
  });
  ```
- **Good**:
  ```ts
  for (const item of items) {
    // ...
  }
  ```
  `for...of` is generally more readable, supports `await`, and works better with `break`/`continue`.

### Tools

- Run `pnpm lint` to check for issues.
- Run `pnpm format` to auto-format code.
