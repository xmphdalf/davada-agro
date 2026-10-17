import { notFound } from 'next/navigation'

import { toRef } from '@/admin/media'
import { requireUser } from '@/admin/server'
import type { Media } from '@/payload-types'
import { PageForm, type PageSlug } from './PageForm'

const SLUGS: PageSlug[] = ['home-text', 'subsidy', 'stats', 'contact']

const i18n = (v: { gu?: string | null; hi?: string | null; en?: string | null } | null | undefined) => ({
  gu: v?.gu ?? '',
  hi: v?.hi ?? '',
  en: v?.en ?? '',
})

export default async function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS.includes(slug as PageSlug)) notFound()
  const { payload } = await requireUser()
  const s = slug as PageSlug

  if (s === 'home-text') {
    const g = await payload.findGlobal({ slug: s, depth: 1 })
    const photo = g.templePhoto && typeof g.templePhoto === 'object' ? toRef(g.templePhoto as Media) : null
    return <PageForm slug={s} initial={{ blessing: i18n(g.blessing), heroTitle: i18n(g.heroTitle), heroSub: i18n(g.heroSub), templePhoto: photo }} />
  }
  if (s === 'subsidy') {
    const g = await payload.findGlobal({ slug: s, depth: 0 })
    return (
      <PageForm
        slug={s}
        initial={{
          title: i18n(g.title),
          body: i18n(g.body),
          note: i18n(g.note),
          steps: (g.steps ?? []).map((st, i) => ({ id: st.id ?? `s${i}`, text: i18n(st.text) })),
          help: i18n(g.help),
        }}
      />
    )
  }
  if (s === 'stats') {
    const g = await payload.findGlobal({ slug: s, depth: 0 })
    const items = (g.items ?? []).map((it, i) => ({ id: it.id ?? `i${i}`, value: it.value, label: i18n(it.label) }))
    return <PageForm slug={s} initial={{ items }} />
  }
  const g = await payload.findGlobal({ slug: 'contact', depth: 0 })
  return (
    <PageForm
      slug={s}
      initial={{
        phone: g.phone,
        whatsapp: g.whatsapp,
        address: i18n(g.address),
        hours: i18n(g.hours),
        closed: i18n(g.closed),
        mapsUrl: g.mapsUrl ?? '',
      }}
    />
  )
}
