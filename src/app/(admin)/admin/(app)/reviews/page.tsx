import Link from 'next/link'

import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { IPlus } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { SimpleList } from '@/admin/ui/SimpleList'
import { num } from '@/lib/format'

export const metadata = { title: 'ખેડૂતોના અભિપ્રાય' }

const missing = (v: { hi?: string | null; en?: string | null }) => !v.hi?.trim() || !v.en?.trim()

export default async function ReviewsPage() {
  const { payload } = await requireUser()
  const lang = await getAdminLang()
  const t = getStrings(lang)
  const { docs } = await payload.find({ collection: 'reviews', sort: 'order', limit: 100, depth: 0 })
  const rows = docs.map((r) => ({
    id: String(r.id),
    title: `${r.name.gu}, ${r.village.gu}`,
    sub: r.quote.gu ?? '',
    missing: missing(r.quote) || missing(r.name) || missing(r.village),
  }))
  return (
    <>
      <PageHeader title={t.pageReviews} count={num(rows.length, lang)} back="/admin/more" />
      <div className="page" style={{ maxWidth: 760 }}>
        <Link className="btn btn-kesar btn-lg" href="/admin/reviews/new"><IPlus />{t.addReview}</Link>
        <p className="hint">{t.reorderHint}</p>
        <SimpleList collection="reviews" rows={rows} base="/admin/reviews" />
      </div>
    </>
  )
}
