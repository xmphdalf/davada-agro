import { notFound } from 'next/navigation'

import { requireUser } from '@/admin/server'
import { EntryForm } from '@/admin/ui/EntryForm'

const i18n = (v?: { gu?: string | null; hi?: string | null; en?: string | null } | null) => ({ gu: v?.gu ?? '', hi: v?.hi ?? '', en: v?.en ?? '' })

export default async function AwardEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload } = await requireUser()
  if (id === 'new')
    return <EntryForm kind="awards" id={null} initial={{ year: new Date().getFullYear(), icon: 'trophy', title: i18n(), by: i18n() }} />
  const a = await payload.findByID({ collection: 'awards', id, depth: 0, disableErrors: true })
  if (!a) notFound()
  return <EntryForm kind="awards" id={String(a.id)} initial={{ year: a.year, icon: a.icon, title: i18n(a.title), by: i18n(a.by) }} />
}
