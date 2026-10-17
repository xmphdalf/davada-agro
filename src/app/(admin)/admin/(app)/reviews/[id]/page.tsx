import { notFound } from 'next/navigation'

import { requireUser } from '@/admin/server'
import { EntryForm } from '@/admin/ui/EntryForm'

const i18n = (v?: { gu?: string | null; hi?: string | null; en?: string | null } | null) => ({ gu: v?.gu ?? '', hi: v?.hi ?? '', en: v?.en ?? '' })

export default async function ReviewEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await requireUser()
  if (id === 'new') return <EntryForm kind="reviews" id={null} initial={{ quote: i18n(), name: i18n(), village: i18n() }} />
  const r = await payload.findByID({ collection: 'reviews', id, depth: 0, disableErrors: true })
  if (!r) notFound()
  return <EntryForm kind="reviews" id={String(r.id)} initial={{ quote: i18n(r.quote), name: i18n(r.name), village: i18n(r.village) }} />
}
