import {terser} from 'rollup-plugin-terser';

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
    config('martin.js'),
    config('martin.min.js', [terser()])
];
