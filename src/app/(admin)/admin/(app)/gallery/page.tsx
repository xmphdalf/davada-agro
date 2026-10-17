import { loadGallery, loadProducts } from '@/admin/data'
import { productOptions, toItem } from '@/admin/galleryView'
import { requireUser } from '@/admin/server'
import { GalleryBoard } from './GalleryBoard'

export const metadata = { title: 'ગેલેરી' }

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ sel?: string }> }) {
  const { payload } = await requireUser()
  const { sel } = await searchParams
  const [gallery, products] = await Promise.all([loadGallery(payload), loadProducts(payload)])
  return <GalleryBoard items={gallery.map(toItem)} products={productOptions(products)} selected={sel ?? null} />
}
