// eslint-disable-next-line
// @ts-ignore
import iconDefs from 'icon-definitions'

// Icon type
export interface Icon {
  name: string
  extensions?: string[]
  files?: string[]
  svg: string
}

const defaultIcon: Icon = iconDefs.defaultIcon
export { defaultIcon }

export function getIcon (filename: string): Icon {
  if (typeof filename === 'string') {
    //    get the lowercase filename
    //    eslint-disable-next-line
    const lcFilename = filename.toLowerCase()
    //    base on filename and extensions to find icon
    let icon = iconDefs.icons.find(i => i.files && i.files.some(f => f === lcFilename))
    if (icon) {
      return icon
    }

    let matchLength = 0
    iconDefs.icons.forEach(i => {
      i.extensions?.forEach(ext => (
        ext.length > matchLength && lcFilename.endsWith('.' + ext) && (icon = i) && (matchLength = ext.length)
      ))
    })

    if (icon) {
      return icon
    }
  }

  //  return the default icon
  return defaultIcon
}

// 获取全部 icon 数组
export function getAllIcons (): Icon[] {
  return [
    defaultIcon,
    ...iconDefs.icons
  ]
}
