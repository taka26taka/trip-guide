/**
 * アプリ内で使う最小限のインラインSVGアイコン。
 * 外部アイコンライブラリに依存せず、旅のしおり全体の線幅を揃える。
 */
import type { SVGProps } from 'react'

type IconName = 'external' | 'map' | 'navigation'

type IconProps = SVGProps<SVGSVGElement> & { name: IconName }

export function Icon({ name, ...props }: IconProps) {
  const common: SVGProps<SVGSVGElement> = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    ...props,
  }

  switch (name) {
    case 'external':
      return <svg {...common}><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 17.5v-10A1.5 1.5 0 0 1 6.5 6H11" /></svg>
    case 'map':
      return <svg {...common}><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></svg>
    case 'navigation':
      return <svg {...common}><path d="m4.5 19.5 6.3-15.2a1.3 1.3 0 0 1 2.4 0l6.3 15.2-7.5-3.4-7.5 3.4Z" /></svg>
  }
}
