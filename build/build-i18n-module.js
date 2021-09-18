/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * Rollup plugins don't export types that work with commonjs.
 * @template T
 * @param {T} module
 * @return {T['default']}
 */
function rollupPluginTypeCoerce(module) {
  // @ts-expect-error
  return module;
}

const fs = require('fs');

const rollup = require('rollup');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');
// Only needed b/c getFilenamePrefix loads a commonjs module.
const commonjs = rollupPluginTypeCoerce(require('@rollup/plugin-commonjs'));
const replace = rollupPluginTypeCoerce(require('rollup-plugin-replace'));
const nodePolyfills = rollupPluginTypeCoerce(require('rollup-plugin-polyfill-node'));
// @ts-expect-error: no types
const shim = require('rollup-plugin-shim');
const {LH_ROOT} = require('../root.js');

const distDir = `${LH_ROOT}/dist`;
const bundleOutFile = `${distDir}/i18n-module.js`;
const generatorFilename = `./lighthouse-core/lib/i18n/i18n-module.js`;

const localeBasenames = fs.readdirSync(LH_ROOT + '/lighthouse-core/lib/i18n/locales/');
const actualLocales = localeBasenames
  .filter(basename => basename.endsWith('.json') && !basename.endsWith('.ctc.json'))
  .map(locale => locale.replace('.json', ''));

const plugins = [
  replace({
    delimiters: ['', ''],
    values: {
      '[\'__availableLocales__\']': JSON.stringify(actualLocales),
      '__dirname': '""',
    },
  }),
  shim({
    ['./locales.js']: 'export default {}',
  }),
  commonjs(),
  nodePolyfills(),
  nodeResolve({preferBuiltins: true}),
  terser(),
];

// TODO: this file is for Option 1 (hacky code splitting). see `SwapLocaleFeature._getI18nModule`.
async function main() {
  const bundle = await rollup.rollup({
    input: generatorFilename,
    plugins,
  });
  await bundle.write({
    file: bundleOutFile,
    format: 'esm',
  });
}

if (require.main === module) {
  main();
}

module.exports = {plugins};
