// @TODO: Remove once eslint improvements merged
/* eslint-disable */
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { default: swc } = require('@rollup/plugin-swc')
const { default: terser } = require('@rollup/plugin-terser')
const {
  browser: BROWSER_OUT,
  main: CJS,
  module: ESM,
} = require('./package.json')

// @TODO: Research the purposes of minification and how it's supposed to be used
//        Is there a point to having a .min as well as the main thing without directly exporting it?
//        Do I just use tsc to compile and export for Node.js?
//        Does UMD have any use for us, should we transpile to UMD?

// @TODO In conclusion:
// 1. TSC for type-checking and generating types
// 2. Rollup with SWC to generate UMD that only targets browsers
// 3. Rollup with SWC that targets Node.js for CJS and ESM (ES2022)
// ?. Maybe do make ESM a bundler version, and transpile that with TSC, only
//    accessible through "exports", while CJS will also be imported (this also
//    prevents the dual package hazard https://nodejs.org/api/packages.html#dual-package-hazard)

const IS_PROD = process.env.NODE_ENV === 'production'

// @TODO Im confused, we are importing and then using module.exports
//       rollup transpiles config that's why this works but we should stay consistent
/** @type {import('rollup').RollupOptions[]} */
module.exports = [
  // browser-friendly UMD build
  {
    input: 'src/browser.ts',
    external: 'cross-fetch/polyfill',
    output: {
      name: 'window',
      extend: true,
      file: BROWSER_OUT,
      format: 'umd',
      // This source map can only be useful for local tests
      sourcemap: !IS_PROD,
    },
    plugins: [
      nodeResolve({ extensions: '.ts' }),
      swc({ swc: { env: { targets: 'last 2 versions, ie >= 11' } } }),
      // @TODO Do we need this? It generates a slightly longer code seemingly, but it doesn't seem to help
      //       especially considering that the depended on package is not even inlined, stays a require
      // commonjs({
      //   include: ['node_modules/**'],
      // }),
      // nodePolyfills
      // @TODO We have no JSONs used in src, this is not needed, remove
      // json(),
      IS_PROD ? terser() : {},
    ],
  },

  // @TODO While this is meant for bundlers it still generates down-leveled code,
  //       down-leveled code cannot be up-leveled again, the package user should
  //       be able to bundle to whatever version of ES they want, so this "bundling"
  //       version should be left as is without any down-leveling
  // ES module (for bundlers) build.
  {
    input: 'src/index.ts',
    external: 'cross-fetch/polyfill',
    output: [
      {
        file: ESM,
        format: 'es',
        sourcemap: true,
      },
      {
        file: CJS,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve({ extensions: '.ts' }),
      // Node.js 18 fully supports es2022 https://www.npmjs.com/package/@tsconfig/node18
      swc({ swc: { jsc: { target: 'es2022' } } }),
      // @TODO: There's no point in minifying Node.js code
      // IS_PROD ? terser() : {}, // will minify the file in production mode
    ],
  },
  // Common JS build (Node).
  // Compatible only in a nodeJS environment.
  // @TODO Rollup runs twice, once raw and once with NODE_ENV=true
  //       1. That means CJS version gets created twice with no differences
  //       2. Do we even need min versions of ESM? We probably only want a min version of something we want on unpkg like UMD?
  //          It's still debatable whether we want UMD at all
  // @TODO Also, it should not run twice, what's even the point we're not even using it separately, it always does the same thing
  //       we could use https://rollupjs.org/configuration-options/#output-plugins for generating min
  // @TODO This doesn't get a sourcemap but this is what's used in Node.js, so Node.js won't point to src
  // {
  //   input: 'src/index.ts',
  //   external: ['cross-fetch', 'cross-fetch/polyfill'],
  //   output: {
  //     file: getOutputFileName(
  //       // will add .min. in filename if in production env
  //       resolve(ROOT, pkg.main),
  //       env === 'production'
  //     ),
  //     exports: 'named',
  //     format: 'cjs',
  //   },
  //   plugins: [nodeResolve({ extensions: '.ts' }), swc()],
  // },
]
