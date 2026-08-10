const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconHome = (p) => (
  <svg {...base} {...p}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    <path d="M10 20v-6h4v6" />
  </svg>
)

export const IconSparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5c.5 3 2 4.5 5 5-3 .5-4.5 2-5 5-.5-3-2-4.5-5-5 3-.5 4.5-2 5-5Z" />
    <path d="M19 15c.25 1.4.9 2.05 2.3 2.3-1.4.25-2.05.9-2.3 2.3-.25-1.4-.9-2.05-2.3-2.3 1.4-.25 2.05-.9 2.3-2.3Z" />
  </svg>
)

export const IconBag = (p) => (
  <svg {...base} {...p}>
    <path d="M7 8V6.5a5 5 0 0 1 10 0V8" />
    <rect x="4" y="8" width="16" height="12.5" rx="2" />
  </svg>
)

export const IconStar = (p) => (
  <svg {...base} {...p}>
    <path d="m12 3.5 2.47 5.18 5.53.68-4.05 3.94.98 5.7L12 16.2l-4.93 2.8.98-5.7-4.05-3.94 5.53-.68L12 3.5Z" />
  </svg>
)

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
  </svg>
)

export const IconCalendar = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8 3.5v3.5M16 3.5v3.5" />
  </svg>
)

export const IconGift = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="9.5" width="16" height="10.5" rx="1.5" />
    <path d="M4 9.5h16v3.5H4z" />
    <path d="M12 9.5V20M12 9.5c-1.4 0-3-1-3-2.7A2 2 0 0 1 11 4.8c1.6 0 1.9 2.4 1 4.7Zm0 0c1.4 0 3-1 3-2.7a2 2 0 0 0-2-2c-1.6 0-1.9 2.4-1 4.7Z" />
  </svg>
)

export const IconUsers = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3 20c.9-3.2 3.1-4.8 6-4.8s5.1 1.6 6 4.8" />
    <path d="M15.5 6a2.8 2.8 0 0 1 0 5.4" />
    <path d="M17.5 15.6c2.3.5 3.7 2 4.5 4.4" />
  </svg>
)

export const IconGrid = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="16" y="16" width="4" height="4" rx="0.5" />
    <path d="M14 14h3M17 14v3" />
  </svg>
)

export const IconChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
)
