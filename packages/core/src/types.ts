export interface DiveObject {
  readonly id: string;
  readonly type: string; // e.g., 'file', 'image', 'note'
  readonly name: string;
  readonly path?: string; // For file-based objects
  readonly content?: unknown;
  readonly metadata?: Record<string, unknown>;
}

export interface EnrichedRelation {
  readonly id: string;
  readonly source_id: string;
  readonly target_id: string;
  readonly type: string;
  readonly data?: unknown;
  readonly created_at: number;
  readonly otherObject: {
    readonly id: string;
    readonly name: string;
    readonly type: string;
  };
  readonly direction: "outgoing" | "incoming";
}
