export interface DiveObject {
  readonly id: string;
  readonly type: string; // e.g., 'file', 'image', 'note'
  readonly name: string;
  readonly path?: string; // For file-based objects
  readonly content?: any;
  readonly metadata?: Record<string, any>;
}
