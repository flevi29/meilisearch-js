// @TODO: Remove once eslint improvements merged
/* eslint-disable */
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const {
  swc,
  defineRollupSwcOption,
  minify,
  defineRollupSwcMinifyOption,
} = require('rollup-plugin-swc3')
const { jsdelivr: JSDELIVR_OUT, main: CJS } = require('./package.json')

// @TODO: Research the purposes of minification and how it's supposed to be used
//        - JSDELIVR checks for *.min.js files from *.js files
//        - If we have .min.js by default does it still try to minify it?
//        - Does it help with sourcemaps to publish both minified and un-minified? Nope.

// @TODO: Sourcemaps
//        - Should we publish sourcemaps with the minified bundle? Yes.
//        - Should we publish sourcemaps otherwise for CJS and ESM? Only for
//          CJS, which will also be imported by Node.js.

// @TODO: https://esbuild.github.io/api/#main-fields-for-package-authors

// @TODO: Does UMD have any use for us, should we transpile to UMD?
//        Yeah, whatever, UMD is fine.

// @TODO: Make a build script for tsc that doesn't do incremental, s owe don't publish tsbuildinfo
//        or find another solution so we don't publish it

// (@TODO Rewrite this a little?) Maybe do make ESM a bundler version, and transpile that with TSC, only
//    accessible through "exports", while CJS will also be imported (this also
//    prevents the dual package hazard https://nodejs.org/api/packages.html#dual-package-hazard)

const IS_PROD = process.env.NODE_ENV === 'production'

/** @type {import('rollup').RollupOptions[]} */
module.exports = [
  {
    input: 'src/browser.ts',
    external: ['cross-fetch/polyfill'],
    output: {
      // All Meilisearch exports will be available on global variable `window`
      name: 'window',
      // If `window` already exists (like in browsers), don't overwrite it
      extend: true,
      file: JSDELIVR_OUT,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ extensions: '.ts' }),
      swc(
        defineRollupSwcOption({
          env: { targets: 'last 2 versions, ie >= 11' },
          jsc: { externalHelpers: true },
          sourceMaps: true,
        })
      ),
      // @TODO Do we need this? It generates a slightly longer code seemingly, but it doesn't seem to help
      //       especially considering that the depended on package is not even inlined, stays a require
      // commonjs({
      //   include: ['node_modules/**'],
      // }),
      // nodePolyfills
      // @TODO We have no JSONs used in src, this is not needed, remove
      // json(),
      IS_PROD ? minify(defineRollupSwcMinifyOption({ sourceMap: true })) : {},
    ],
  },
  {
    input: 'src/index.ts',
    external: ['cross-fetch/polyfill'],
    output: {
      file: CJS,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ extensions: '.ts' }),
      // Node.js 18 (Maintenance version at the time of writing) fully
      // supports es2022 https://www.npmjs.com/package/@tsconfig/node18
      // If people wish to use this with EOL Node.js versions they are welcome
      // to transform the code, but ideally they should update Node.js
      swc(
        defineRollupSwcOption({
          jsc: { target: 'es2022', externalHelpers: true },
          sourceMaps: true,
        })
      ),
    ],
  },
]
