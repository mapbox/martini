import terser from '@rollup/plugin-terser';

const config = (file, plugins = []) => ({
    input: 'index.js',
    output: {
        name: 'Martini',
        format: 'umd',
        indent: false,
        file
    },
    plugins
});

export default [
    config('martini.js'),
    config('martini.min.js', [terser()])
];
