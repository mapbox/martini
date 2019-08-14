
import fs from 'fs';
import {PNG} from 'pngjs';
import Martin from './index.js';

const png = PNG.sync.read(fs.readFileSync('./test/fixtures/fuji.png'));

const tileSize = png.width;
const gridSize = png.width + 1;
const terrain = new Float32Array(gridSize * gridSize);

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

console.time('init tileset');
const martin = new Martin(gridSize);
console.timeEnd('init tileset');

console.time('create tile');
const tile = martin.createTile(terrain);
console.timeEnd('create tile');

console.time('update');
tile.update();
console.timeEnd('update');

console.time('mesh');
const mesh = tile.getMesh(20);
console.timeEnd('mesh');

// console.log(JSON.stringify(mesh));

console.log(`vertices: ${mesh.vertices.length / 2}, triangles: ${mesh.triangles.length / 3}`);
