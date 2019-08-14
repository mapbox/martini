# MARTIN

[![Simply Awesome](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

MARTIN stands for **Mapbox's Awesome Right-Triangulated Irregular Networks**.

It's an experimental JavaScript library for **real-time terrain mesh generation** from height data. Given a (2<sup>k</sup>+1) × (2<sup>k</sup>+1) terrain grid, generates a hierarchy of triangular meshes of varying level of detail in milliseconds.

Based on the paper ["Right-Triangulated Irregular Networks" by Will Evans et. al. (1997)](https://www.cs.ubc.ca/~will/papers/rtin.pdf).

![MARTIN terrain demo](martin.gif)

## Example

```js
const martin = new Martin(gridSize);

// generate RTIN hierarchy from terrain data (array of size^2 length)
const tile = martin.createTile(terrain);

// get a mesh (vertices and triangles indices) for a 10m error
const mesh = tile.getMesh(10);
```
