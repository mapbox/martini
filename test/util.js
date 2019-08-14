
export function mapboxTerrainToGrid(png) {
    const gridSize = png.width + 1;
    const terrain = new Float32Array(gridSize * gridSize);

    const tileSize = png.width;

    // decode terrain values
    for (let y = 0; y < tileSize; y++) {
        for (let x = 0; x < tileSize; x++) {
            const k = (y * tileSize + x) * 4;
            const r = png.data[k + 0];
            const g = png.data[k + 1];
            const b = png.data[k + 2];
            terrain[y * gridSize + x] = (r * 256 * 256 + g * 256.0 + b) / 10.0 - 10000.0;
        }
    }
    // backfill right and bottom borders
    for (let x = 0; x < gridSize - 1; x++) {
        terrain[gridSize * (gridSize - 1) + x] = terrain[gridSize * (gridSize - 2) + x];
    }
    for (let y = 0; y < gridSize; y++) {
        terrain[gridSize * y + gridSize - 1] = terrain[gridSize * y + gridSize - 2];
    }

    return terrain;
}
