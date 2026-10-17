import { notFound } from 'next/navigation'

import { toRef } from '@/admin/media'
import { artFor } from '@/admin/productView'
import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import type { Media, Product } from '@/payload-types'
import { ProductForm, type ProductData } from './ProductForm'

export const metadata = { title: 'સનેડો' }

const EMPTY: ProductData = {
  modelId: '',
  cat: '3',
  price: null,
  hidePrice: false,
  stock: true,
  best: false,
  name: { gu: '', hi: '', en: '' },
  desc: { gu: '', hi: '', en: '' },
  specs: { hp: null, gearsFwd: null, gearsRev: null, load: null, tank: null, start: 'self', width: null, tipping: false, warranty: 1 },
  photos: [],
}

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await requireUser()
  const t = getStrings(await getAdminLang())

  if (id === 'new') return <ProductForm id={null} initial={EMPTY} art={null} title={t.newProduct} />

  const p = (await payload.findByID({ collection: 'products', id, depth: 1, disableErrors: true })) as Product | null
  if (!p) notFound()
  const initial: ProductData = {
    modelId: p.modelId,
    cat: p.cat,
    price: p.price ?? null,
    hidePrice: Boolean(p.hidePrice),
    stock: Boolean(p.stock),
    best: Boolean(p.best),
    name: { gu: p.name.gu ?? '', hi: p.name.hi ?? '', en: p.name.en ?? '' },
    desc: { gu: p.desc.gu ?? '', hi: p.desc.hi ?? '', en: p.desc.en ?? '' },
    specs: {
      hp: p.specs?.hp ?? null,
      gearsFwd: p.specs?.gearsFwd ?? null,
      gearsRev: p.specs?.gearsRev ?? null,
      load: p.specs?.load ?? null,
      tank: p.specs?.tank ?? null,
      start: p.specs?.start ?? 'self',
      width: p.specs?.width ?? null,
      tipping: Boolean(p.specs?.tipping),
      warranty: p.specs?.warranty ?? null,
    },
    photos: (p.photos ?? []).filter((m): m is Media => typeof m === 'object' && m !== null).map(toRef),
  }
  return <ProductForm id={String(p.id)} initial={initial} art={artFor(p.modelId)} />
}
