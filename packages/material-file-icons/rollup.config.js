import typescript from '@rollup/plugin-typescript'
import ts from 'typescript'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'

import iconDefinitionsResolver from './scripts/icon-definitions-resolver.js'

// import pakcage.json file
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default {
  input: 'libs/index.ts',

  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.browser,
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],

  plugins: [
    del({
      targets: 'dist/*',
      runOnce: true
    }),

    typescript({
      typescript: ts,
      tsconfig: './tsconfig.json'
    }),

    iconDefinitionsResolver()
  ]
}
