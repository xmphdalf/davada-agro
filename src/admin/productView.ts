import { money, num, productName } from '@/lib/format'
import type { Media, Product } from '@/payload-types'

import { productMissing } from './data'
import type { AdminLang, Strings } from './strings'
import { toRef } from './media'

/** Illustrations shipped with the design; used until real photos are uploaded. */
const ART = new Set(['KS-07', 'KS-10', 'KS-12', 'KB-10', 'KT-15', 'KC-05'])
export const artFor = (modelId: string) => (ART.has(modelId) ? `/products/${modelId}.svg` : null)

export const firstPhoto = (p: Product) => {
  const m = (p.photos ?? [])[0]
  return m && typeof m === 'object' ? toRef(m as Media) : null
}

export type ProductRow = {
  id: string
  modelId: string
  name: string
  price: string
  cat: string
  stock: boolean
  best: boolean
  img: string | null
  photo: boolean
  hi: boolean
  en: boolean
}

export function toRow(p: Product, lang: AdminLang, t: Strings): ProductRow {
  const photo = firstPhoto(p)
  const cat = { '3': t.catVehicle3, '4': t.catVehicle4, impl: t.catImpl }[p.cat]
  return {
    id: String(p.id),
    modelId: p.modelId,
    name: productName(p, lang === 'gu' ? 'gu' : 'en'),
    price: p.hidePrice || p.price == null ? t.askPrice : (money(p.price, lang) ?? ''),
    cat,
    stock: Boolean(p.stock),
    best: Boolean(p.best),
    img: photo?.thumb ?? artFor(p.modelId),
    photo: Boolean(photo),
    hi: !productMissing(p, 'hi'),
    en: !productMissing(p, 'en'),
  }
}

export { num }
