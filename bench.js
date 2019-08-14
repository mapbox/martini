
import fs from 'fs';
import {PNG} from 'pngjs';
import Martin from './index.js';
import {mapboxTerrainToGrid} from './test/util.js';

const png = PNG.sync.read(fs.readFileSync('./test/fixtures/fuji.png'));

const terrain = mapboxTerrainToGrid(png);
const terrain2 = terrain.map(Math.sqrt);

console.time('init tileset');
const martin = new Martin(png.width + 1);
console.timeEnd('init tileset');

console.time('create tile');
const tile = martin.createTile(terrain);
console.timeEnd('create tile');

console.time('create tile 2');
const tile2 = martin.createTile(terrain2);
console.timeEnd('create tile 2');

console.time('mesh');
const mesh = tile.getMesh(20);
console.timeEnd('mesh');

console.log(`vertices: ${mesh.vertices.length / 2}, triangles: ${mesh.triangles.length / 3}`);

console.time('mesh');
const mesh2 = tile2.getMesh(0.42);
console.timeEnd('mesh');

console.log(`vertices: ${mesh2.vertices.length / 2}, triangles: ${mesh2.triangles.length / 3}`);
