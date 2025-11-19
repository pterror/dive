export class InfiniteCanvas {
  x: number = 0;
  y: number = 0;
  zoom: number = 1;

  constructor() {}

  pan(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  setZoom(z: number) {
    this.zoom = z;
  }
}
