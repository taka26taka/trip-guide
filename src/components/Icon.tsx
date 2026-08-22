/**
 * アプリ内で使う最小限のインラインSVGアイコン。
 * 外部アイコンライブラリに依存せず、旅のしおり全体の線幅を揃える。
 */
import type { SVGProps } from 'react'

type IconName =
  | 'arrow-right'
  | 'calendar'
  | 'chevron-right'
  | 'clock'
  | 'external'
  | 'map'
  | 'navigation'
  | 'pin'
  | 'train'
  | 'utensils'

type IconProps = SVGProps<SVGSVGElement> & { name: IconName }

export function Icon({ name, ...props }: IconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.9,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    ...props,
  }

  switch (name) {
    case 'arrow-right':
      return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" /></svg>
    case 'calendar':
      return <svg {...common}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" /></svg>
    case 'chevron-right':
      return <svg {...common}><path d="m9 5 7 7-7 7" /></svg>
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg>
    case 'external':
      return <svg {...common}><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 17.5v-10A1.5 1.5 0 0 1 6.5 6H11" /></svg>
    case 'map':
      return <svg {...common}><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></svg>
    case 'navigation':
      return <svg {...common}><path d="m4.5 19.5 6.3-15.2a1.3 1.3 0 0 1 2.4 0l6.3 15.2-7.5-3.4-7.5 3.4Z" /></svg>
    case 'pin':
      return <svg {...common}><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></svg>
    case 'train':
      return <svg {...common}><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M8 21h8M9 17l-2 4M15 17l2 4M5 11h14M8 7h.01M16 7h.01" /></svg>
    case 'utensils':
      return <svg {...common}><path d="M7 3v7M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 9.5V21M16 3v18M16 3c2.2 1.7 3.2 4.1 3.2 6.5H16" /></svg>
  }
}
