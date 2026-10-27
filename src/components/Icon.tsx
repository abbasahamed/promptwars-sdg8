import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'activity'
  | 'alert'
  | 'book'
  | 'briefcase'
  | 'building'
  | 'check'
  | 'chevron-down'
  | 'chevron-right'
  | 'clock'
  | 'close'
  | 'file'
  | 'filter'
  | 'globe'
  | 'graduation'
  | 'hammer'
  | 'info'
  | 'lock'
  | 'map-pin'
  | 'minus'
  | 'people'
  | 'plus'
  | 'refresh'
  | 'receipt'
  | 'shield'
  | 'sliders'
  | 'spark'
  | 'trash'
  | 'user'
  | 'wallet'
  | 'wrench'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

/** A single, rounded line icon language for the application chrome. */
export function Icon({ name, size = 20, ...props }: IconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  const paths: Record<IconName, ReactNode> = {
    activity: <><path d="M3 12h3l2-7 4 14 2-7h4" /></>,
    alert: <><path d="M10.3 3.5 2.4 17a1 1 0 0 0 .9 1.5h13.4a1 1 0 0 0 .9-1.5L9.7 3.5a1 1 0 0 0-1.4 0Z" /><path d="M9 8v4M9 15.5h.01" /></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H19v16H6.5A2.5 2.5 0 0 0 4 20.5v-16Z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19" /></>,
    briefcase: <><rect x="2.5" y="6" width="15" height="12" rx="2" /><path d="M6.5 6V4.5A1.5 1.5 0 0 1 8 3h4a1.5 1.5 0 0 1 1.5 1.5V6M2.5 10h15M8 10v2h4v-2" /></>,
    building: <><path d="M4 20V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M2 20h16M7 7h2M7 11h2M7 15h2M12 7h1M12 11h1M12 15h1" /></>,
    check: <path d="m4 10 3.5 3.5L16 5" />,
    'chevron-down': <path d="m5 8 5 5 5-5" />,
    'chevron-right': <path d="m8 5 5 5-5 5" />,
    clock: <><circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l2.5 1.5" /></>,
    close: <><path d="m5 5 10 10M15 5 5 15" /></>,
    file: <><path d="M5 2.5h6l4 4V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" /><path d="M11 2.5V7h4M7 10h5M7 13h5" /></>,
    filter: <><path d="M3 4h14l-5.5 6v5l-3 1.5V10L3 4Z" /></>,
    globe: <><circle cx="10" cy="10" r="7.5" /><path d="M2.8 10h14.4M10 2.5c2 2.1 3 4.6 3 7.5s-1 5.4-3 7.5c-2-2.1-3-4.6-3-7.5s1-5.4 3-7.5Z" /></>,
    graduation: <><path d="m2 8 8-4 8 4-8 4-8-4Z" /><path d="M5 10.2V14c2.8 2.2 7.2 2.2 10 0v-3.8M18 8v5" /></>,
    hammer: <><path d="m4 4 6 6M3 7l4-4 3 3-4 4-3-3ZM10 10l6.5 6.5M14 16l2-2 2 2-2 2-2-2Z" /></>,
    info: <><circle cx="10" cy="10" r="7.5" /><path d="M10 9v5M10 6.5h.01" /></>,
    lock: <><rect x="3.5" y="8" width="13" height="10" rx="2" /><path d="M6 8V5.8a4 4 0 0 1 8 0V8M10 12v2" /></>,
    'map-pin': <><path d="M16 8.3c0 4.2-6 9.2-6 9.2s-6-5-6-9.2a6 6 0 1 1 12 0Z" /><circle cx="10" cy="8" r="1.8" /></>,
    minus: <path d="M5 10h10" />,
    people: <><circle cx="8" cy="7" r="2.5" /><path d="M3 17a5 5 0 0 1 10 0M14 5.5a2.5 2.5 0 0 1 0 4.8M15 12a4 4 0 0 1 3 5" /></>,
    plus: <><path d="M10 4v12M4 10h12" /></>,
    refresh: <><path d="M16 6V3l-2.2 2.2A6.5 6.5 0 1 0 16.3 12" /></>,
    receipt: <><path d="M5 2.5h10v15l-2-1-3 1-3-1-2 1v-15Z" /><path d="M7.5 6.5h5M7.5 9.5h5M7.5 12.5h3" /></>,
    shield: <><path d="M10 2.5 17 5v5.2c0 4.2-2.9 6.7-7 7.8-4.1-1.1-7-3.6-7-7.8V5l7-2.5Z" /><path d="m6.8 10 2.1 2.1 4.3-4.3" /></>,
    sliders: <><path d="M4 5h12M4 10h12M4 15h12" /><circle cx="7" cy="5" r="1.5" /><circle cx="13" cy="10" r="1.5" /><circle cx="8" cy="15" r="1.5" /></>,
    spark: <><path d="m10 2 1.3 5.7L17 9l-5.7 1.3L10 16l-1.3-5.7L3 9l5.7-1.3L10 2ZM16 14l.5 2.2L19 17l-2.5.8L16 20l-.5-2.2L13 17l2.5-.8L16 14Z" /></>,
    trash: <><path d="M3.5 5.5h13M8 2.5h4l1 3H7l1-3ZM5 5.5l.7 12h8.6l.7-12M8 9v5M12 9v5" /></>,
    user: <><circle cx="10" cy="6" r="3" /><path d="M4 18a6 6 0 0 1 12 0" /></>,
    wallet: <><path d="M3.5 5.5h12a1 1 0 0 1 1 1V17a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" /><path d="M2.5 7V4.5a1 1 0 0 1 1-1h11M12 12h4.5M13 12h.01" /></>,
    wrench: <><path d="M13.5 4.5a4 4 0 0 0-5 5L3 15a1.4 1.4 0 1 0 2 2l5.5-5.5a4 4 0 0 0 5-5l-2.2 2.2-2.5-.7-.7-2.5 2.2-2Z" /></>,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" {...common} {...props}>
      {paths[name]}
    </svg>
  )
}
