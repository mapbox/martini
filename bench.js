
import fs from 'fs';
import {PNG} from 'pngjs';
import Martini from './index.js';
import {mapboxTerrainToGrid} from './test/util.js';

const png = PNG.sync.read(fs.readFileSync('./test/fixtures/fuji.png'));

const terrain = mapboxTerrainToGrid(png);

console.time('init tileset');
const martini = new Martini(png.width + 1);
console.timeEnd('init tileset');

console.time('create tile');
const tile = martini.createTile(terrain);
console.timeEnd('create tile');

console.time('mesh');
const mesh = tile.getMesh(30);
console.timeEnd('mesh');

console.log(`vertices: ${mesh.vertices.length / 2}, triangles: ${mesh.triangles.length / 3}`);

console.time('20 meshes total');
for (let i = 0; i <= 20; i++) {
    console.time(`mesh ${i}`);
    tile.getMesh(i);
    console.timeEnd(`mesh ${i}`);
}
console.timeEnd('20 meshes total');
