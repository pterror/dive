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
