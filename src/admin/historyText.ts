import { money } from '@/lib/format'
import type { History } from '@/payload-types'

import type { AdminLang, Strings } from './strings'
import { whenLabel } from './time'

type Change = { field: string; from?: unknown; to?: unknown }

const SECTION: Record<string, (t: Strings) => string> = {
  gallery: (t) => t.gallery,
  awards: (t) => t.pageAwards,
  reviews: (t) => t.pageReviews,
}

const value = (field: string, v: unknown, lang: AdminLang, t: Strings) => {
  if (field === 'price') return v == null ? '—' : money(v as number, lang)
  if (field === 'stock') return v ? t.inStock : t.toOrder
  return v ? '✓' : '✕'
}

/** “દવડા શક્તિ ૧૦ · કિંમત” / “₹૧,૬૦,૦૦૦ → ₹૧,૬૫,૦૦૦ · આજે ૧૧:૪૦” */
export function describe(h: History, lang: AdminLang, t: Strings) {
  const changes = (h.changes as Change[] | null) ?? []
  const when = whenLabel(h.createdAt, lang, t)
  const section = SECTION[h.target]?.(t)
  const name = h.title || ''
  const head = (suffix?: string) => [section && h.target !== 'products' ? section : null, name, suffix].filter(Boolean).join(' · ')

  if (h.action !== 'update') {
    const verb = { create: t.actCreate, delete: t.actDelete, restore: t.actRestore }[h.action]
    return { head: head(), detail: `${verb} · ${when}` }
  }
  const named = changes.map((c) => t.fieldNames[c.field] ?? c.field)
  if (changes.length === 1 && 'from' in changes[0]) {
    const c = changes[0]
    return { head: head(named[0]), detail: `${value(c.field, c.from, lang, t)} → ${value(c.field, c.to, lang, t)} · ${when}` }
  }
  return { head: head(changes.length === 1 ? named[0] : undefined), detail: `${named.join(', ')} ${t.actUpdate.toLowerCase()} · ${when}` }
}
