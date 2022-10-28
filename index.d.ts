export default class Martini {
  constructor(gridSize?: number);
  createTile(terrain: ArrayLike<number>): Tile;
}

export class Tile {
  constructor(terrain: ArrayLike<number>, martini: Martini);
  update(): void;
  getMesh(maxError?: number): {
    vertices: Uint16Array;
    triangles: Uint32Array;
  };
}
