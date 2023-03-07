import typescript from '@rollup/plugin-typescript'
import ts from 'typescript'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default {
  input: 'libs/index.ts',

  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.browser,
      format: 'cjs',
      plugins: [terser()],
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],

  plugins: [
    del({
      targets: 'dist/*',
      runOnce: true
    }),

    typescript({
      typescript: ts,
      tsconfig: './tsconfig.json'
    })
  ],
}
