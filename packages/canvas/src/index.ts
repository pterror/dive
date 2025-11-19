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

  pan(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  setZoom(z: number) {
    this.zoom = z;
  }

  addNode(node: Node) {
    this.nodes.push(node);
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }

  updateNodePosition(id: string, x: number, y: number) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.x = x;
      node.y = y;
    }
  }

  addEdge(edge: Edge) {
    this.edges.push(edge);
  }

  removeEdge(id: string) {
    this.edges = this.edges.filter(e => e.id !== id);
  }
}
