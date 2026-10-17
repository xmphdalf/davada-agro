/** Icons from the design boards: 24 grid, ~1.8 stroke, round caps. */
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = (size = 22) => ({ width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const })
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const Mark = ({ size = 28, flag = true, ground = '#19203F' }: { size?: number; flag?: boolean; ground?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill={ground} />
    <path d="M13 32c0-7 3-13 6-17h2c3 4 6 10 6 17z" fill="#E07B16" />
    <ellipse cx="20" cy="14.5" rx="3" ry="1.2" fill="#E07B16" />
    {flag && <path d="M20 13V6l6 1.6L20 9" fill="#F4A94E" stroke="#F4A94E" strokeWidth=".6" />}
  </svg>
)

export const IHome = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={1.9} {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
)
export const ISanedo = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><circle cx="7" cy="16.5" r="3" /><circle cx="17.5" cy="17.5" r="2" /><path d="M7 13.5V8h5l2.5 6H20v3.5M10 8V5" /></svg>
)
export const IGallery = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M4 17l5-4.5 3.5 3 3-2.5L20 17" /></svg>
)
export const IMore = ({ size, ...p }: P) => (
  <svg {...base(size)} fill="currentColor" {...p}><circle cx="5.5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="18.5" cy="12" r="1.8" /></svg>
)
export const ICamera = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.5" /></svg>
)
export const ITag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
)
export const IPlus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2.2} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const IChevron = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2} {...p}><path d="M9 6l6 6-6 6" /></svg>
)
export const IBack = ({ size, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2} {...p}><path d="M15 5l-7 7 7 7" /></svg>
)
export const IExternal = ({ size = 16, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
)
export const IClock = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={1.9} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IAlert = ({ size = 16, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
)
export const ICheck = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} fill="none" stroke="#F4A94E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
export const IHandle = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} fill="currentColor" {...p}><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" /></svg>
)
export const IPlay = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M8 5.5v13l11-6.5z" /></svg>
)
export const IPlayFill = ({ size = 16, ...p }: P) => (
  <svg {...base(size)} fill="#19203F" {...p}><path d="M8 5.5v13l11-6.5z" /></svg>
)
export const IUpload = ({ size = 24, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
)
export const ILink = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
)
export const ITrash = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
)
export const IClose = ({ size = 18, ...p }: P) => (
  <svg {...base(size)} {...stroke} strokeWidth={2.2} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const ICaret = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" stroke="#1C1F26" strokeWidth="1.5" fill="none" /></svg>
)
export const IPhoto = ({ size = 24, ...p }: P) => (
  <svg {...base(size)} fill="none" stroke="#8E92A3" strokeWidth={1.4} strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M4 17l5-4.5 3.5 3 3-2.5L20 17" /></svg>
)
export const IEye = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
)
export const ILock = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
)
export const IGlobe = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...stroke} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
)

/** Progress ring used on uploading tiles. */
export const Ring = ({ pct, size = 44, light = false }: { pct: number; size?: number; light?: boolean }) => {
  const c = 2 * Math.PI * 15
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="none" stroke={light ? 'rgba(255,255,255,.25)' : '#E3E3EA'} strokeWidth="3.5" />
      <circle cx="18" cy="18" r="15" fill="none" stroke={light ? '#F4A94E' : '#19203F'} strokeWidth="3.5"
        strokeDasharray={`${(c * pct) / 100} ${c}`} strokeLinecap="round" transform="rotate(-90 18 18)" />
    </svg>
  )
}

export const AwardIcon = ({ kind, size = 28 }: { kind: string; size?: number }) => {
  const d: Record<string, React.ReactNode> = {
    trophy: <path d="M7 4h10v4a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6v4H9z" />,
    medal: <><circle cx="12" cy="15" r="5" /><path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8M12 13v4" /></>,
    cert: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M7 9h10M7 12h6M16 17v4l2-1.3 2 1.3v-4" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#E07B16" strokeWidth={1.6} strokeLinejoin="round" aria-hidden="true">
      {d[kind] ?? d.trophy}
    </svg>
  )
}
