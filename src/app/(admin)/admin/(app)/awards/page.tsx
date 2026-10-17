import Link from 'next/link'

import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { AwardIcon, IPlus } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { SimpleList } from '@/admin/ui/SimpleList'
import { num } from '@/lib/format'

export const metadata = { title: 'સિદ્ધિઓ' }

const missing = (v: { hi?: string | null; en?: string | null }) => !v.hi?.trim() || !v.en?.trim()

export default async function AwardsPage() {
  const { payload } = await requireUser()
  const lang = await getAdminLang()
  const t = getStrings(lang)
  const { docs } = await payload.find({ collection: 'awards', sort: 'order', limit: 100, depth: 0 })
  const rows = docs.map((a) => ({
    id: String(a.id),
    title: `${num(a.year, lang)} · ${a.title.gu}`,
    sub: a.by.gu ?? '',
    missing: missing(a.title) || missing(a.by),
    icon: <AwardIcon kind={a.icon} />,
  }))
  return (
    <>
      <PageHeader title={t.pageAwards} count={num(rows.length, lang)} back="/admin/more" />
      <div className="page" style={{ maxWidth: 760 }}>
        <Link className="btn btn-kesar btn-lg" href="/admin/awards/new"><IPlus />{t.addAward}</Link>
        <p className="hint">{t.reorderHint}</p>
        <SimpleList collection="awards" rows={rows} base="/admin/awards" />
      </div>
    </>
  )
}
