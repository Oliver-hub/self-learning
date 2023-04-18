// eslint-disable-next-line
// @ts-ignore
import iconDefs from 'icon-definitions'

// Icon type
export interface Icon {
  name: string;
  extensions?: string[];
  files?: string[];
  svg: string;
}

const defaultIcon: Icon = iconDefs.defaultIcon;
export {defaultIcon}

//export function getIcon (filename: string): Icon {
//
//}

// 获取全部 icon 数组
export function getAllIcons (): Array<Icon> {
  return [
    defaultIcon,
    ...iconDefs.icons
  ]
}