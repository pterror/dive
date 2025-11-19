export interface FileObject {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  readonly isDirectory: boolean;
  readonly size?: number;
  readonly updatedAt: number;
}
