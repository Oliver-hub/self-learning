// 自定义rollup 插件
import { defineConfig, rollup } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { optimize } from 'svgo'
import util from 'node:util'
import fs from 'fs-extra'
const { readFile } = fs

// 常量
const SRC_BASE = 'node_modules/material-icon-theme/'
const IMPORT_NAME = 'icon-definitions'
const FILE_ID = IMPORT_NAME + '.js'
const usedExtensions = new Set()

const config = defineConfig({
  input: [
    `${SRC_BASE}/src/icons/fileIcons.ts`,
    `${SRC_BASE}/src/icons/languageIcons.ts`
  ],
  plugins: [
    typescript()
  ]
})

// 初始化 svg icon
// 优化 svg
const inlineSvg = async (filename, prefix) => {
  const image = await readFile(filename)
  const res = optimize(image.toString(), {
    path: filename,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      },
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [{ style: 'width: 100%; height: 100%' }]
        }
      },
      { name: 'prefixIds', active: true, params: { prefix } },
      'convertStyleToAttrs',
      'removeDimensions',
      'removeStyleElement'
    ]
  })
  return res.data
}

// 添加 icon svg
const addIcon = async (output, name, extensions, files) => {
  console.log(name, extensions, files)
  if (!extensions?.length && !files?.length) {
    return
  }

  let outputIcon = output.icons.find(i => i.name === name)

  // output 没有存在,则需要加入
  if (!outputIcon) {
    outputIcon = {
      name,
      svg: await inlineSvg(`${SRC_BASE}/icons/${name}.svg`, name)
    }
    output.icons.push(outputIcon)
  }

  //  add files and extensions for icon search
  if (extensions?.length) {
    outputIcon.extensions = Array.from(
      new Set([
        ...(outputIcon.extensions ? outputIcon.extensions: []),
        ...extensions.filter(ext => !usedExtensions.has(ext))
      ])
    )

    extensions.forEach(ext => usedExtensions.add(ext))
  }

  if (files?.length) {
    outputIcon.files = Array.from(
      new Set([
        ...(outputIcon.files ? outputIcon.files: []),
        ...files
      ])
    )
  }

}

export default function iconDefinitionsResolver () {
  return ({
    name: 'icon-definitions',

    resolveId (source) {
      if (source === IMPORT_NAME) {
        return FILE_ID
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    async load (id) {
      if (id === FILE_ID) {
        // 创建 rollup instance
        const bundle = await rollup(config)

        // generate code as es module
        const { output: bundleOutput } = await bundle.generate({
          format: 'es'
        })

        const output = {
          icons: []
        }

        for (const chunkOrAsset of bundleOutput) {
          if (chunkOrAsset.type !== 'asset') {
            const modules = chunkOrAsset.modules

            for (const file in modules) {
              if (Object.hasOwnProperty.call(modules, file)) {
                const module = modules[file]

                if (module.renderedExports.includes('fileIcons')) {
                  // eslint-disable-next-line no-eval
                  const fileIcons = eval('var IconPack = {}; ' + module.code + ' fileIcons')
                  // const fileIcons = eval(module.code)
                  console.log('fileIcons', fileIcons)

                  output.defaultIcon = {
                    name: fileIcons.defaultIcon.name,
                    svg: await inlineSvg(`${SRC_BASE}/icons/${fileIcons.defaultIcon.name}.svg`, fileIcons.defaultIcon.name)
                  }

                  for (const icon of fileIcons.icons) {
                    if (icon.enabledFor) {
                      continue
                    }

                    await addIcon(output, icon.name, icon.fileExtensions, icon.fileNames)
                  }

                  console.log('output: ', output)
                }

                if (module.renderedExports.includes('languageIcons')) {
                  // console.log('languageIcons: ', module.code), why need this?
                }
              }
            }
          }
        }

        console.log('Compiled', output.icons.length + 1, 'icons')

        return ({
          code: 'export default ' + util.inspect(output, {
            maxArrayLength: Infinity,
            depth: Infinity,
            maxStringLength: Infinity
          }),
          map: { mappings: '' }
        })
      }
    }
  })
}
