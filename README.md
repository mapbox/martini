# MARTIN: Mapbox's Awesome Right-Triangulated Irregular Networks

An experimental JavaScript library for **real-time terrain mesh generation** from height data. Given a (2<sup>k</sup>+1) × (2<sup>k</sup>+1) terrain grid, generates a hierarchy of triangular meshes of varying level of detail in milliseconds.

![MARTIN terrain demo](martin.gif)

## Example

```js
const martin = new Martin(gridSize);

// generate RTIN hierarchy from terrain data (array of size^2 length)
const tile = martin.createTile(terrain);

// get a mesh (vertices and triangles indices) for a 10m error
const mesh = tile.getMesh(10);
```
