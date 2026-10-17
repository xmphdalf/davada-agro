'use client'

import { useRef, useState } from 'react'

import { saveGlobal } from '@/admin/actions'
import type { MediaRef } from '@/admin/media'
import { useAdmin } from '@/admin/ui/AdminContext'
import { getIn, I18nInput, LangScope, SaveBar, TextInput, useForm, type I18n } from '@/admin/ui/form'
import { ICamera, IClose, IHandle, IPlus, Ring } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { Sortable } from '@/admin/ui/Sortable'
import { uploadPhoto } from '@/admin/ui/upload'
import { num } from '@/lib/format'

export type PageSlug = 'home-text' | 'subsidy' | 'stats' | 'contact'
type Data = Record<string, unknown>

const TITLE = { 'home-text': 'pageHome', subsidy: 'pageSubsidy', stats: 'pageStats', contact: 'pageContact' } as const

/** Fixed home-page sections with editable text. One language switch at the top changes every field. */
export function PageForm({ slug, initial }: { slug: PageSlug; initial: Data }) {
  const { t } = useAdmin()
  const form = useForm<Data>(initial, (d) => saveGlobal(slug, toPayload(slug, d)), {
    validate: (d) => {
      const e: Record<string, string> = {}
      if (slug === 'contact') {
        if (!/^\d{10}$/.test(String(d.phone ?? ''))) e.phone = t.phoneInvalid
        if (!/^\d{10}$/.test(String(d.whatsapp ?? ''))) e.whatsapp = t.phoneInvalid
      }
      return e
    },
  })
  const d = form.data
  const i = (k: string) => getIn(d, k) as I18n
  const set = (k: string) => (v: unknown) => form.set(k, v)
  const err = (k: string) => form.errors[k] || form.errors[`${k}.gu`]

  const i18nValues: I18n[] =
    slug === 'home-text'
      ? [i('blessing'), i('heroTitle'), i('heroSub')]
      : slug === 'subsidy'
        ? [i('title'), i('body'), i('note'), i('help'), ...(d.steps as { text: I18n }[]).map((s) => s.text)]
        : slug === 'stats'
          ? (d.items as { label: I18n }[]).map((s) => s.label)
          : [i('address'), i('hours'), i('closed')]

  return (
    <>
      <PageHeader title={t[TITLE[slug]]} back="/admin/more" />
      <div className="page form" style={{ maxWidth: 760 }}>
        <LangScope values={i18nValues}>
          <p className="hint" style={{ marginTop: -6 }}>{t.langSwitchAll}</p>

          {slug === 'home-text' && (
            <section className="card pad">
              <h2>{t.heroSection}</h2>
              <I18nInput label={t.blessing} value={i('blessing')} onChange={set('blessing')} guide={30} error={err('blessing')} />
              <I18nInput label={t.heroTitle} value={i('heroTitle')} onChange={set('heroTitle')} guide={40} hint={t.heroTitleHint} error={err('heroTitle')} />
              <I18nInput label={t.heroSub} value={i('heroSub')} onChange={set('heroSub')} guide={120} multiline error={err('heroSub')} />
              <TemplePhoto value={d.templePhoto as MediaRef | null} onChange={set('templePhoto')} />
            </section>
          )}

          {slug === 'subsidy' && (
            <section className="card pad">
              <h2>{t.pageSubsidy}</h2>
              <I18nInput label={t.heading} value={i('title')} onChange={set('title')} guide={50} error={err('title')} />
              <I18nInput label={t.body} value={i('body')} onChange={set('body')} guide={220} multiline error={err('body')} />
              <Steps value={d.steps as Step[]} onChange={set('steps')} />
              <I18nInput label={t.helpText} value={i('help')} onChange={set('help')} guide={100} multiline error={err('help')} />
              <I18nInput label={t.note} value={i('note')} onChange={set('note')} guide={140} multiline error={err('note')} />
            </section>
          )}

          {slug === 'stats' &&
            (d.items as { id: string; value: string; label: I18n }[]).map((it, n) => (
              <StatCard key={it.id} n={n} item={it} set={(k, v) => form.set('items', (d.items as object[]).map((x, j) => (j === n ? { ...x, [k]: v } : x)))} />
            ))}

          {slug === 'contact' && (
            <section className="card pad">
              <h2>{t.pageContact}</h2>
              <div className="grid2">
                <TextInput label={t.phone} value={d.phone as string} onChange={set('phone')} inputMode="tel" latin prefix="+91" error={form.errors.phone} />
                <TextInput label={t.whatsapp} value={d.whatsapp as string} onChange={set('whatsapp')} inputMode="tel" latin prefix="+91" error={form.errors.whatsapp} />
              </div>
              <p className="hint" style={{ marginTop: -6 }}>{t.phoneHint}</p>
              <I18nInput label={t.address} value={i('address')} onChange={set('address')} guide={90} multiline error={err('address')} />
              <I18nInput label={t.hours} value={i('hours')} onChange={set('hours')} guide={45} error={err('hours')} />
              <I18nInput label={t.closedDay} value={i('closed')} onChange={set('closed')} guide={25} error={err('closed')} />
              <TextInput label={t.mapsUrl} value={d.mapsUrl as string} onChange={set('mapsUrl')} inputMode="url" latin />
            </section>
          )}
        </LangScope>
      </div>
      <SaveBar form={form} />
    </>
  )
}

const toPayload = (slug: PageSlug, d: Data): Data => {
  if (slug === 'home-text') return { ...d, templePhoto: d.templePhoto ? Number((d.templePhoto as MediaRef).id) : null }
  if (slug === 'subsidy') return { ...d, steps: (d.steps as Step[]).map((s) => ({ text: s.text })) }
  if (slug === 'stats') return { items: (d.items as { value: string; label: I18n }[]).map((s) => ({ value: s.value, label: s.label })) }
  return d
}

function StatCard({ n, item, set }: { n: number; item: { value: string; label: I18n }; set: (k: string, v: unknown) => void }) {
  const { t, lang } = useAdmin()
  return (
    <section className="card pad">
      <h2>{t.statN(num(n + 1, lang))}</h2>
      <TextInput label={t.statValue} value={item.value} onChange={(v) => set('value', v)} hint={t.statValueHint} latin />
      <I18nInput label={t.statLabel} value={item.label} onChange={(v) => set('label', v)} guide={25} />
    </section>
  )
}

type Step = { id: string; text: I18n }

/** list: rows with a drag handle, add at the bottom. */
function Steps({ value, onChange }: { value: Step[]; onChange: (v: Step[]) => void }) {
  const { t, lang } = useAdmin()
  return (
    <div className="f" style={{ gap: 10 }}>
      <span className="fl">{t.steps}</span>
      <Sortable
        items={value}
        onReorder={onChange}
        className="card"
        render={(s, n, h) => (
          <div ref={h.ref} style={{ ...h.style, display: 'flex', gap: 2, padding: '8px 4px 8px 0', borderBottom: '1px solid var(--line)', background: 'var(--paper)', alignItems: 'flex-start' }}>
            <button type="button" className="handle" aria-label={t.reorder} {...h.handle} style={{ marginTop: 28 }}><IHandle /></button>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <I18nInput label={`${t.step} ${num(n + 1, lang)}`} value={s.text} onChange={(v) => onChange(value.map((x) => (x.id === s.id ? { ...x, text: v } : x)))} guide={60} multiline rows={2} />
            </div>
            <button type="button" className="iconbtn" aria-label={t.delete} onClick={() => onChange(value.filter((x) => x.id !== s.id))} style={{ marginTop: 26 }}>
              <IClose />
            </button>
          </div>
        )}
      />
      {value.length < 6 && (
        <button
          type="button"
          className="btn btn-ghost"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => onChange([...value, { id: `new-${Date.now()}`, text: { gu: '', hi: '', en: '' } }])}
        >
          <IPlus />
          {t.addStep}
        </button>
      )}
    </div>
  )
}

/** Single photo with “ફોટો બદલો”; falls back to the photo shipped with the design. */
function TemplePhoto({ value, onChange }: { value: MediaRef | null; onChange: (v: MediaRef | null) => void }) {
  const { t, lang, toast } = useAdmin()
  const input = useRef<HTMLInputElement>(null)
  const [pct, setPct] = useState<number | null>(null)
  return (
    <div className="f">
      <span className="fl">{t.templePhoto}</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="ptile" style={{ width: 120, flex: 'none' }}>
          {pct != null ? (
            <>
              <Ring pct={pct} />
              <span className="pct">{num(pct, lang)}%</span>
            </>
          ) : (
            <img className="photo" src={value?.thumb || '/temple.webp'} alt="" />
          )}
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => input.current?.click()} disabled={pct != null}>
          <ICamera />
          {t.changePhoto}
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setPct(0)
          try {
            onChange(await uploadPhoto(file, setPct))
          } catch {
            toast(t.uploadFailed)
          }
          setPct(null)
        }}
      />
    </div>
  )
}
