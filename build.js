import * as esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/lambda/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    platform: 'node',
    target: 'node18',
    format: 'esm',
    minify: true,
    sourcemap: true,
    external: ['util', 'path', 'http', 'https', 'url', 'fs', 'stream'],
}).catch(() => process.exit(1));
``
