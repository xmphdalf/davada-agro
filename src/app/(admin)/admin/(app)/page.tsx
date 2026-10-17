import Link from 'next/link'

import { loadGallery, loadProducts, todoList } from '@/admin/data'
import { describe } from '@/admin/historyText'
import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { whenLabel } from '@/admin/time'
import { ICamera, IChevron, IClock, IPlus, ITag } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { UndoButton } from '@/admin/ui/UndoButton'
import { num } from '@/lib/format'

export const metadata = { title: 'મુખ્ય' }

export default async function AdminHome() {
  const { payload, user } = await requireUser()
  const lang = await getAdminLang()
  const t = getStrings(lang)
  const n = (v: number) => num(v, lang)

  const [products, gallery, history, awards, reviews] = await Promise.all([
    loadProducts(payload),
    loadGallery(payload),
    payload.find({ collection: 'history', sort: '-createdAt', limit: 4, depth: 0, where: { undone: { not_equals: true } } }),
    payload.count({ collection: 'awards' }),
    payload.count({ collection: 'reviews' }),
  ])
  const todo = todoList(products, gallery, t, n)
  const last = history.docs[0]
  const first = (user.name || '').split(' ')[0]

  const chev = <IChevron className="chev" />
  const sectionRows: [string, string, number?][] = [
    ['/admin/products', t.navProducts, products.length],
    ['/admin/gallery', t.navGallery, gallery.length],
    ['/admin/pages/home-text', t.pageHome],
    ['/admin/pages/subsidy', t.pageSubsidy],
    ['/admin/pages/stats', t.pageStats],
    ['/admin/awards', t.pageAwards, awards.totalDocs],
    ['/admin/reviews', t.pageReviews, reviews.totalDocs],
    ['/admin/pages/contact', t.pageContact],
  ]

  return (
    <>
      <PageHeader title={<><span className="mob-only" style={{ fontFamily: 'var(--body)', fontSize: 16, fontWeight: 600 }}>{t.admin}</span><span className="desk-only">{t.navHome}</span></>} />
      <div className="page wide">
        <div className="hello">
          <h1>{t.hello}{first ? `, ${first}` : ''}</h1>
          <p className="hint status">
            {t.siteLive}
            {last ? ` · ${t.lastChange} ${whenLabel(last.createdAt, lang, t)}` : ''}
          </p>
        </div>

        <div className="quick">
          <Link href="/admin/gallery?add=1" className="primary"><ICamera size={26} />{t.addPhoto}</Link>
          <Link href="/admin/products/new" className="desk-only"><IPlus size={26} style={{ color: 'var(--night)' }} />{t.addProduct}</Link>
          <Link href="/admin/products"><ITag size={26} style={{ color: 'var(--night)' }} /><span className="mob-only">{t.priceStock}</span><span className="desk-only">{t.priceStockChange}</span></Link>
        </div>

        <div className="home-cols">
          <section aria-labelledby="todo" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="sec-label mob-only" id="todo-m">{t.todo}</span>
            <div className="card">
              <h3 id="todo" className="desk-only">{t.todo}</h3>
              {todo.length === 0 && <div className="row hint">{t.todoNone}</div>}
              {todo.map((item) => (
                <Link key={item.label} href={item.href} className="row">
                  <span className="dot-miss dot-big" />
                  <span className="grow">{item.label}</span>
                  {chev}
                </Link>
              ))}
            </div>
          </section>

          <section className="recent-desk card" aria-labelledby="recent">
            <div className="card-head">
              <h3 id="recent">{t.recent}</h3>
              <Link href="/admin/history" style={{ fontWeight: 600, textUnderlineOffset: 4, fontSize: 15 }}>{t.seeAll}</Link>
            </div>
            {history.docs.length === 0 && <div className="row hint">{t.historyEmpty}</div>}
            {history.docs.map((h) => {
              const d = describe(h, lang, t)
              return (
                <div key={h.id} className="row">
                  <div className="grow">
                    <div style={{ fontWeight: 500 }}>{d.head}</div>
                    <div className="hint">{d.detail}</div>
                  </div>
                  <UndoButton id={String(h.id)} />
                </div>
              )
            })}
          </section>

          <section className="home-sections" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="sec-label">{t.sections}</span>
            <div className="card">
              {sectionRows.map(([href, label, count]) => (
                <Link key={href} href={href} className="row">
                  <span className="grow" style={{ fontWeight: 500 }}>{label}</span>
                  {count != null && <span className="hint">{n(count)}</span>}
                  {chev}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <Link href="/admin/history" className="linkbtn home-history-link" style={{ alignSelf: 'flex-start' }}>
          <IClock />
          {t.history}
        </Link>
      </div>
    </>
  )
}
