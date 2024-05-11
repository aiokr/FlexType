import type React from 'react'
export type IconProps = React.SVGAttributes<SVGElement>

export const IconPropsDefault: IconProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: 'false',
}

export { FileIcon } from './File'
export { SettingIcon } from './Setting'
export { PhotoIcon } from './Photo'
export { IconGithub } from './IconGithub'