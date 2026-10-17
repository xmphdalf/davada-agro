import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'

/** Text in three languages; an empty hi/en falls back to Gujarati when shown. */
export type L = { gu: string; hi: string; en: string }

export type SiteProduct = {
  id: string // model ID, e.g. KS-10 (used in #p-KS-10 and WhatsApp messages)
  cat: '3' | '4' | 'impl'
  name: L
  desc: L
  price: number | null // null = “કિંમત માટે પૂછો”
  stock: boolean
  best: boolean
  img: string | null
  photo: boolean
  specs: {
    hp: number | null
    gearsFwd: number | null
    gearsRev: number | null
    load: number | null
    tank: number | null
    start: 'self' | 'kick' | null
    width: number | null
    tipping: boolean
    warranty: number | null
  }
}

export type SiteGalleryItem = {
  kind: 'photo' | 'video'
  cat: 'sanedo' | 'impl' | 'delivery' | 'workshop' | 'honours'
  cap: L
  thumb: string | null
  full: string | null
  youtube: string | null
  product: string | null // model ID
}

export type SiteData = {
  site: string
  phone: string // 10 digits
  whatsapp: string // 10 digits
  maps: string
  address: L
  hours: L
  closed: L
  hero: { blessing: L; title: L; sub: L; photo: string }
  stats: { value: string; label: L }[]
  subsidy: { title: L; body: L; note: L; steps: L[]; help: L }
  products: SiteProduct[]
  awards: { year: number; icon: string; title: L; by: L }[]
  reviews: { quote: L; name: L; village: L }[]
  gallery: SiteGalleryItem[]
}

type I = { gu?: string | null; hi?: string | null; en?: string | null } | null | undefined
const l = (v: I): L => ({ gu: v?.gu ?? '', hi: v?.hi ?? '', en: v?.en ?? '' })

const ART = new Set(['KS-07', 'KS-10', 'KS-12', 'KB-10', 'KT-15', 'KC-05'])
const media = (m: unknown) => (m && typeof m === 'object' ? (m as Media) : null)

/**
 * Everything the public site shows, from the admin's content. `origin` is the site's address for
 * links inside WhatsApp messages; SITE_URL wins when set.
 */
export async function loadSite(origin = ''): Promise<SiteData> {
  const payload = await getPayload({ config })
  const q = { overrideAccess: true, limit: 1000, sort: 'order', depth: 1 } as const
  const [products, awards, reviews, gallery, home, subsidy, stats, contact] = await Promise.all([
    payload.find({ collection: 'products', ...q }),
    payload.find({ collection: 'awards', ...q, depth: 0 }),
    payload.find({ collection: 'reviews', ...q, depth: 0 }),
    payload.find({ collection: 'gallery', ...q }),
    payload.findGlobal({ slug: 'home-text', depth: 1, overrideAccess: true }),
    payload.findGlobal({ slug: 'subsidy', depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'stats', depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'contact', depth: 0, overrideAccess: true }),
  ])

  const modelOf = new Map(products.docs.map((p) => [p.id, p.modelId]))

  return {
    site: (process.env.SITE_URL || origin).replace(/\/$/, ''),
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    maps: contact.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=Davada+Agro+Industries+Chital+Amreli',
    address: l(contact.address),
    hours: l(contact.hours),
    closed: l(contact.closed),
    hero: {
      blessing: l(home.blessing),
      title: l(home.heroTitle),
      sub: l(home.heroSub),
      photo: media(home.templePhoto)?.url || '/temple.webp',
    },
    stats: (stats.items ?? []).map((s) => ({ value: s.value, label: l(s.label) })),
    subsidy: {
      title: l(subsidy.title),
      body: l(subsidy.body),
      note: l(subsidy.note),
      steps: (subsidy.steps ?? []).map((s) => l(s.text)),
      help: l(subsidy.help),
    },
    products: products.docs.map((p) => {
      const m = media((p.photos ?? [])[0])
      const img = m ? m.sizes?.md?.url || m.url || null : ART.has(p.modelId) ? `/products/${p.modelId}.svg` : null
      return {
        id: p.modelId,
        cat: p.cat,
        name: l(p.name),
        desc: l(p.desc),
        price: p.hidePrice ? null : (p.price ?? null),
        stock: Boolean(p.stock),
        best: Boolean(p.best),
        img,
        photo: Boolean(m),
        specs: {
          hp: p.specs?.hp ?? null,
          gearsFwd: p.specs?.gearsFwd ?? null,
          gearsRev: p.specs?.gearsRev ?? null,
          load: p.specs?.load ?? null,
          tank: p.specs?.tank ?? null,
          start: p.specs?.start ?? null,
          width: p.specs?.width ?? null,
          tipping: Boolean(p.specs?.tipping),
          warranty: p.specs?.warranty ?? null,
        },
      }
    }),
    awards: awards.docs.map((a) => ({ year: a.year, icon: a.icon, title: l(a.title), by: l(a.by) })),
    reviews: reviews.docs.map((r) => ({ quote: l(r.quote), name: l(r.name), village: l(r.village) })),
    gallery: gallery.docs.map((g) => {
      const m = media(g.image)
      const pid = g.product && typeof g.product === 'object' ? g.product.id : g.product
      return {
        kind: g.kind,
        cat: g.cat,
        cap: l(g.caption),
        thumb: m ? m.sizes?.md?.url || m.url || null : null,
        full: m?.url ?? null,
        youtube: g.youtube ?? null,
        product: pid ? (modelOf.get(Number(pid)) ?? null) : null,
      }
    }),
  }
}
