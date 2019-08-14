
export default class Martin {
    constructor(gridSize = 257) {
        this.gridSize = gridSize;
        const tileSize = gridSize - 1;
        if (tileSize & (tileSize - 1)) throw new Error(
            `Expected grid size to be 2^n+1, got ${gridSize}.`);

        this.numTriangles = tileSize * tileSize * 2 - 2;
        this.numParentTriangles = this.numTriangles - tileSize * tileSize;

        this.indices = new Uint16Array(this.gridSize * this.gridSize);

        // coordinates for all possible triangles in an RTIN tile
        this.coords = new Uint16Array(this.numTriangles * 4);

        // get triangle coordinates from its index in an implicit binary tree
        for (let i = 0; i < this.numTriangles; i++) {
            let id = i + 2;
            let ax = 0, ay = 0, bx = 0, by = 0, cx = 0, cy = 0;
            if (id & 1) {
                bx = by = cx = tileSize; // bottom-left triangle
            } else {
                ax = ay = cy = tileSize; // top-right triangle
            }
            while ((id >>= 1) > 1) {
                const mx = (ax + bx) >> 1;
                const my = (ay + by) >> 1;

                if (id & 1) { // left half
                    bx = ax; by = ay;
                    ax = cx; ay = cy;
                } else { // right half
                    ax = bx; ay = by;
                    bx = cx; by = cy;
                }
                cx = mx; cy = my;
            }
            const k = i * 4;
            this.coords[k + 0] = ax;
            this.coords[k + 1] = ay;
            this.coords[k + 2] = bx;
            this.coords[k + 3] = by;
        }
    }

    createTile(terrain) {
        return new Tile(terrain, this);
    }
}

class Tile {
    constructor(terrain, martin) {
        const size = martin.gridSize;
        if (terrain.length !== size * size) throw new Error(
            `Expected terrain data of length ${size * size} (${size} x ${size}), got ${terrain.length}.`);

        this.terrain = terrain;
        this.martin = martin;
        this.errors = new Float32Array(terrain.length);
        this.update();
    }

    update() {
        const {numTriangles, numParentTriangles, coords, gridSize} = this.martin;
        const {terrain, errors} = this;

        // iterate over all possible triangles, starting from the smallest level
        for (let i = numTriangles - 1; i >= 0; i--) {
            const k = i * 4;
            const ax = coords[k + 0];
            const ay = coords[k + 1];
            const bx = coords[k + 2];
            const by = coords[k + 3];
            const mx = (ax + bx) >> 1;
            const my = (ay + by) >> 1;
            const cx = mx + my - ay;
            const cy = my + ax - mx;

            // calculate error in the middle of the long edge of the triangle
            const interpolatedHeight = (terrain[ay * gridSize + ax] + terrain[by * gridSize + bx]) / 2;
            const middleIndex = my * gridSize + mx;
            const middleError = Math.abs(interpolatedHeight - terrain[middleIndex]);

            errors[middleIndex] = Math.max(errors[middleIndex], middleError);

            if (i < numParentTriangles) { // bigger triangles; accumulate error with children
                const leftChildIndex = ((ay + cy) >> 1) * gridSize + ((ax + cx) >> 1);
                const rightChildIndex = ((by + cy) >> 1) * gridSize + ((bx + cx) >> 1);
                errors[middleIndex] = Math.max(errors[middleIndex], errors[leftChildIndex], errors[rightChildIndex]);
            }
        }
    }

    getMesh(maxError = 0) {
        const {gridSize, indices} = this.martin;
        const {errors} = this;
        const vertices = [];
        const triangles = [];
        let numVertices = 0;

        // we use an index grid to keep track of vertices that were already used to avoid duplication
        indices.fill(0);

        function processTriangle(ax, ay, bx, by, cx, cy) {
            const mx = (ax + bx) >> 1;
            const my = (ay + by) >> 1;

            if (Math.abs(ax - cx) + Math.abs(ay - cy) > 1 && errors[my * gridSize + mx] > maxError) {
                // triangle doesn't approximate the surface well enough; drill down further
                processTriangle(cx, cy, ax, ay, mx, my);
                processTriangle(bx, by, cx, cy, mx, my);

            } else {
                // add a triangle
                let a = indices[ay * gridSize + ax] - 1;
                let b = indices[by * gridSize + bx] - 1;
                let c = indices[cy * gridSize + cx] - 1;
                if (a === -1) {
                    a = numVertices++;
                    indices[ay * gridSize + ax] = numVertices;
                    vertices.push(ax, ay);
                }
                if (b === -1) {
                    b = numVertices++;
                    indices[by * gridSize + bx] = numVertices;
                    vertices.push(bx, by);
                }
                if (c === -1) {
                    c = numVertices++;
                    indices[cy * gridSize + cx] = numVertices;
                    vertices.push(cx, cy);
                }
                triangles.push(a, b, c);
            }
        }

        const max = gridSize - 1;
        processTriangle(0, 0, max, max, max, 0);
        processTriangle(max, max, 0, 0, 0, max);

        return {vertices, triangles};
    }
}
