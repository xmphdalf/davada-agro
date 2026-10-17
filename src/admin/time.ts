import { num } from '@/lib/format'

import type { AdminLang, Strings } from './strings'

const TZ = 'Asia/Kolkata'

const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ })

const partOfDay = (h: number, s: Strings) => (h < 12 ? s.morning : h < 16 ? s.afternoon : h < 20 ? s.evening : s.night)

/** “આજે સવારે ૧૧:૪૦”, “ગઈકાલે ૬:૧૫”, “૨ ઑક્ટોબર” */
export const whenLabel = (iso: string, lang: AdminLang, s: Strings, now = new Date()) => {
  const d = new Date(iso)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const h24 = Number(d.toLocaleString('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }))
  const time =
    lang === 'gu'
      ? num(d.toLocaleTimeString('en-GB', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?[ap]m$/i, ''), 'gu')
      : d.toLocaleTimeString('en-GB', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
  const pod = lang === 'gu' ? `${partOfDay(h24, s)} ` : ''
  if (dayKey(d) === dayKey(now)) return `${s.today} ${pod}${time}`
  if (dayKey(d) === dayKey(yesterday)) return `${s.yesterday} ${pod}${time}`
  const date = d.toLocaleDateString(lang === 'gu' ? 'gu-IN' : 'en-IN', { timeZone: TZ, day: 'numeric', month: 'long' })
  return num(date, lang)
}
