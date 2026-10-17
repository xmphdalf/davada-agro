import type { Payload } from 'payload'

import { productName } from '@/lib/format'
import type { Gallery, Product } from '@/payload-types'

import type { Strings } from './strings'

type I18n = { gu?: string | null; hi?: string | null; en?: string | null } | null | undefined
const has = (v: I18n, l: 'gu' | 'hi' | 'en') => Boolean(v?.[l]?.trim())

export const productMissing = (p: Product, l: 'hi' | 'en') => !has(p.name, l) || !has(p.desc, l)
export const captionMissing = (g: Gallery) => !has(g.caption, 'gu') || !has(g.caption, 'hi') || !has(g.caption, 'en')

export const loadProducts = async (payload: Payload) =>
  (await payload.find({ collection: 'products', sort: 'order', limit: 200, depth: 1, overrideAccess: true })).docs

export const loadGallery = async (payload: Payload) =>
  (await payload.find({ collection: 'gallery', sort: 'order', limit: 1000, depth: 1, overrideAccess: true })).docs

/** “બાકી કામ”: translations still to write and prices left empty. */
export function todoList(products: Product[], gallery: Gallery[], t: Strings, numLang: (v: number) => string) {
  const items: { href: string; label: string }[] = []
  const hi = products.filter((p) => productMissing(p, 'hi')).length
  const en = products.filter((p) => productMissing(p, 'en')).length
  if (hi) items.push({ href: '/admin/products', label: t.todoProducts(numLang(hi), t.langNameHi) })
  if (en) items.push({ href: '/admin/products', label: t.todoProducts(numLang(en), t.langNameEn) })
  for (const l of ['gu', 'hi', 'en'] as const) {
    const n = gallery.filter((g) => !has(g.caption, l)).length
    const name = l === 'gu' ? t.langNameGu : l === 'hi' ? t.langNameHi : t.langNameEn
    if (n) items.push({ href: '/admin/gallery', label: t.todoCaptions(numLang(n), name) })
  }
  for (const p of products.filter((p) => p.price == null && !p.hidePrice)) {
    items.push({ href: `/admin/products/${p.id}`, label: t.todoPrice(productName(p, 'gu')) })
  }
  return items
}
