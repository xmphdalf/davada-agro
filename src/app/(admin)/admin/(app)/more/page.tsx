import Link from 'next/link'

import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { IChevron, IClock, IExternal, ILock } from '@/admin/ui/icons'
import { AdminLangSwitch, LogoutButton, PageHeader } from '@/admin/ui/Shell'
import { num } from '@/lib/format'

export const metadata = { title: 'વધુ' }

/** “વધુ” tab: the website-text sections, history, account and admin language. */
export default async function MorePage() {
  const { payload, user } = await requireUser()
  const lang = await getAdminLang()
  const t = getStrings(lang)
  const [awards, reviews] = await Promise.all([payload.count({ collection: 'awards' }), payload.count({ collection: 'reviews' })])
  const chev = <IChevron className="chev" />
  const rows: [string, string, number?][] = [
    ['/admin/pages/home-text', t.pageHome],
    ['/admin/pages/subsidy', t.pageSubsidy],
    ['/admin/pages/stats', t.pageStats],
    ['/admin/awards', t.pageAwards, awards.totalDocs],
    ['/admin/reviews', t.pageReviews, reviews.totalDocs],
    ['/admin/pages/contact', t.pageContact],
  ]
  return (
    <>
      <PageHeader title={t.navMore} />
      <div className="page" style={{ maxWidth: 760, gap: 20 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="sec-label">{t.websiteText}</span>
          <div className="card">
            {rows.map(([href, label, count]) => (
              <Link key={href} href={href} className="row">
                <span className="grow" style={{ fontWeight: 500 }}>{label}</span>
                {count != null && <span className="hint">{num(count, lang)}</span>}
                {chev}
              </Link>
            ))}
          </div>
        </section>

        <div className="card">
          <Link href="/admin/history" className="row"><IClock size={20} /><span className="grow" style={{ fontWeight: 500 }}>{t.history}</span>{chev}</Link>
          <Link href="/admin/account" className="row"><ILock size={20} /><span className="grow" style={{ fontWeight: 500 }}>{t.account}</span>{chev}</Link>
          <a href="/" target="_blank" rel="noopener" className="row"><IExternal size={20} /><span className="grow" style={{ fontWeight: 500 }}>{t.viewSite}</span></a>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="sec-label">{t.adminLanguage}</span>
          <AdminLangSwitch />
        </section>

        <div className="card pad" style={{ gap: 4 }}>
          <span className="hint">{t.signedInAs}</span>
          <b style={{ fontWeight: 600 }}>{user.name || user.email}</b>
          <span className="hint latin">{user.email}</span>
          <LogoutButton className="linkbtn danger" />
        </div>
      </div>
    </>
  )
}
