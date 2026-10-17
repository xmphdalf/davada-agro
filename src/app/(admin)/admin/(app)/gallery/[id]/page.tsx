import { notFound } from 'next/navigation'

import { loadGallery, loadProducts } from '@/admin/data'
import { productOptions, toItem, type GalleryItem } from '@/admin/galleryView'
import { requireUser } from '@/admin/server'
import { PhotoForm } from '../PhotoForm'

export const metadata = { title: 'ફોટાની વિગત' }

const NEW_VIDEO: GalleryItem = {
  id: '',
  kind: 'video',
  image: null,
  youtube: null,
  cat: 'delivery',
  caption: { gu: '', hi: '', en: '' },
  product: null,
  missing: true,
}

/** /admin/gallery/:id edits one photo; /admin/gallery/video adds a YouTube video. */
export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await requireUser()
  const products = productOptions(await loadProducts(payload))
  if (id === 'video') return <PhotoForm item={NEW_VIDEO} products={products} />

  const items = (await loadGallery(payload)).map(toItem)
  const index = items.findIndex((g) => g.id === id)
  if (index < 0) notFound()
  return <PhotoForm item={items[index]} products={products} index={index} total={items.length} />
}
