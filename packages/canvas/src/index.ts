export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  data?: any;
}

export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
}

export class InfiniteCanvas {
  x: number = 0;
  y: number = 0;
  zoom: number = 1;
  nodes: Node[] = [];
  edges: Edge[] = [];

  constructor() {}

  pan(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  setZoom(z: number): void {
    this.zoom = z;
  }

  addNode(node: Node): void {
    this.nodes.push(node);
  }

  removeNode(id: string): void {
    this.nodes = this.nodes.filter((n) => n.id !== id);
  }

  updateNodePosition(id: string, x: number, y: number): void {
    const node = this.nodes.find((n) => n.id === id);
    if (node) {
      node.x = x;
      node.y = y;
    }
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  removeEdge(id: string): void {
    this.edges = this.edges.filter((e) => e.id !== id);
  }
}
