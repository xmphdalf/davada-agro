import { productName } from '@/lib/format'
import type { Gallery, Media, Product } from '@/payload-types'

import { captionMissing } from './data'
import { toRef, type MediaRef } from './media'

export type GalleryCat = 'sanedo' | 'impl' | 'delivery' | 'workshop' | 'honours'

export type GalleryItem = {
  id: string
  kind: 'photo' | 'video'
  image: MediaRef | null
  youtube: string | null
  cat: GalleryCat
  caption: { gu: string; hi: string; en: string }
  product: string | null
  missing: boolean
}

export const toItem = (g: Gallery): GalleryItem => ({
  id: String(g.id),
  kind: g.kind,
  image: g.image && typeof g.image === 'object' ? toRef(g.image as Media) : null,
  youtube: g.youtube ?? null,
  cat: g.cat,
  caption: { gu: g.caption?.gu ?? '', hi: g.caption?.hi ?? '', en: g.caption?.en ?? '' },
  product: g.product ? String(typeof g.product === 'object' ? g.product.id : g.product) : null,
  missing: captionMissing(g),
})

export const productOptions = (products: Product[]) =>
  products.map((p) => ({ value: String(p.id), label: productName(p, 'gu'), sub: p.modelId }))

export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
