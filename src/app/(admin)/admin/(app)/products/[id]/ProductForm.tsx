'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { saveDoc, trashDoc } from '@/admin/actions'
import type { MediaRef } from '@/admin/media'
import { useAdmin } from '@/admin/ui/AdminContext'
import {
  Chips,
  I18nInput,
  LangScope,
  MoneyInput,
  NumberUnit,
  SaveBar,
  TextInput,
  ToggleRow,
  useConfirm,
  useForm,
  type FormApi,
  type I18n,
  type Loc,
} from '@/admin/ui/form'
import { ITrash } from '@/admin/ui/icons'
import { PhotoPicker } from '@/admin/ui/PhotoPicker'
import { PageHeader } from '@/admin/ui/Shell'
import { money, num, pick } from '@/lib/format'

export type ProductData = {
  modelId: string
  cat: '3' | '4' | 'impl'
  price: number | null
  hidePrice: boolean
  stock: boolean
  best: boolean
  name: I18n
  desc: I18n
  specs: {
    hp: number | null
    gearsFwd: number | null
    gearsRev: number | null
    load: number | null
    tank: number | null
    start: 'self' | 'kick' | null
    width: number | null
    tipping: boolean
    warranty: number | null
  }
  photos: MediaRef[]
}

const MODEL_ID = /^[A-Z]{1,3}-\d{1,3}$/

export function ProductForm({ id, initial, art, title }: { id: string | null; initial: ProductData; art: string | null; title?: string }) {
  const { t, lang, toast } = useAdmin()
  const router = useRouter()
  const { ask, dialog } = useConfirm()
  const [loc, setLoc] = useState<Loc>('gu')

  const form = useForm<ProductData>(
    initial,
    (d) =>
      saveDoc('products', id, {
        ...d,
        modelId: d.modelId.trim().toUpperCase(),
        photos: d.photos.map((m) => Number(m.id)),
      }),
    {
      validate: (d) => {
        const e: Record<string, string> = {}
        if (!MODEL_ID.test(d.modelId.trim().toUpperCase())) e.modelId = t.modelIdInvalid
        if (!d.name.gu?.trim()) e['name.gu'] = t.required
        if (!d.desc.gu?.trim()) e['desc.gu'] = t.required
        if (e['name.gu'] || e['desc.gu']) setLoc('gu')
        return e
      },
      onSaved: (res) => {
        if (!id && res.id) router.replace(`/admin/products/${res.id}`)
      },
    },
  )
  const d = form.data
  const err = (k: string) => {
    const v = form.errors[k]
    if (!v) return undefined
    if (k === 'modelId' && v === 'taken') return t.modelIdTaken
    return v
  }
  const vehicle = d.cat !== 'impl'
  const fullName = (l: Loc) => {
    const n = pick(d.name, l)
    return vehicle && d.specs.hp ? `${n} ${num(d.specs.hp, l)}` : n
  }
  const heading = id ? fullName(lang === 'gu' ? 'gu' : 'en') || title : title

  const onDelete = async () => {
    if (!id || !(await ask(fullName('gu')))) return
    const res = await trashDoc('products', id)
    if (res.ok) {
      toast(t.deleted, res.historyId)
      router.replace('/admin/products')
      router.refresh()
    } else toast(t.saveFailed)
  }

  return (
    <>
      <PageHeader
        title={heading}
        back="/admin/products"
        siteLink={false}
        right={
          id ? (
            <a className="site-link" href={`/#p-${initial.modelId}`} target="_blank" rel="noopener" style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>
              {t.preview}
            </a>
          ) : undefined
        }
      />
      <div className="page form">
        <div className="edit-cols">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <section className="card pad" aria-labelledby="s-photos">
              <h2 id="s-photos">{t.photos}</h2>
              <PhotoPicker
                value={d.photos}
                onChange={(v) => form.set('photos', v)}
                hint={t.photosHint}
                hintDesktop={t.photosHintDesktop}
              />
            </section>

            <section className="card pad" aria-labelledby="s-name">
              <h2 id="s-name">{t.nameDesc}</h2>
              <LangScope values={[d.name, d.desc]} loc={loc} onLoc={setLoc}>
                <I18nInput
                  label={t.name}
                  value={d.name}
                  onChange={(v) => form.set('name', v)}
                  guide={40}
                  error={err(`name.${loc}`)}
                  hint={vehicle && d.specs.hp && d.name[loc] ? t.hpAuto(fullName(loc)) : undefined}
                />
                <I18nInput
                  label={t.shortDesc}
                  value={d.desc}
                  onChange={(v) => form.set('desc', v)}
                  guide={120}
                  multiline
                  error={err(`desc.${loc}`)}
                />
              </LangScope>
            </section>

            <section className="card pad" aria-labelledby="s-cat">
              <h2 id="s-cat">{t.category}</h2>
              <Chips
                options={[
                  { value: '3', label: t.catVehicle3 },
                  { value: '4', label: t.catVehicle4 },
                  { value: 'impl', label: t.catImpl },
                ]}
                value={d.cat}
                onChange={(v) => form.set('cat', v)}
              />
            </section>

            <section className="card pad" aria-labelledby="s-price">
              <h2 id="s-price">{t.priceStatus}</h2>
              {!d.hidePrice && <MoneyInput label={t.exShowroom} value={d.price} onChange={(v) => form.set('price', v)} error={err('price')} />}
              <div className="trows" style={{ borderTop: d.hidePrice ? 0 : '1px solid var(--line)' }}>
                <ToggleRow label={t.hidePriceLabel} hint={t.hidePriceHint} checked={d.hidePrice} onChange={(v) => form.set('hidePrice', v)} />
                <ToggleRow label={t.stockLabel} hint={t.stockHint} checked={d.stock} onChange={(v) => form.set('stock', v)} />
                <ToggleRow label={t.bestLabel} hint={t.bestHint} checked={d.best} onChange={(v) => form.set('best', v)} />
              </div>
            </section>

            <section className="card pad" aria-labelledby="s-specs">
              <h2 id="s-specs">{t.details}</h2>
              <Specs form={form} vehicle={vehicle} />
            </section>

            <section className="card pad" aria-labelledby="s-link">
              <h2 id="s-link">{t.link}</h2>
              <TextInput
                label={t.modelId}
                value={d.modelId}
                onChange={(v) => form.set('modelId', v.toUpperCase())}
                hint={t.modelIdHint}
                error={err('modelId')}
                latin
                readOnly={Boolean(id)}
                autoComplete="off"
              />
            </section>

            {id && (
              <button className="linkbtn danger" style={{ alignSelf: 'flex-start' }} onClick={onDelete}>
                <ITrash />
                {t.deleteProduct}
              </button>
            )}
          </div>

          <aside className="preview" aria-label={t.previewTitle}>
            <span className="sec-label">{t.previewTitle}</span>
            <PreviewCard d={d} loc={loc} art={art} name={fullName(loc)} />
            <p className="hint">{t.previewNote}</p>
          </aside>
        </div>
      </div>
      <SaveBar form={form} />
      {dialog}
    </>
  )
}

function Specs({ form, vehicle }: { form: FormApi<ProductData>; vehicle: boolean }) {
  const { t } = useAdmin()
  const s = form.data.specs
  const set = (k: keyof ProductData['specs']) => (v: unknown) => form.set(`specs.${k}`, v)
  if (!vehicle)
    return (
      <>
        <div className="grid2">
          <NumberUnit label={t.load} unit={t.unitTon} value={s.load} onChange={set('load')} decimal />
          <NumberUnit label={t.width} unit={t.unitFeet} value={s.width} onChange={set('width')} decimal />
          <NumberUnit label={t.warranty} unit={t.unitYear} value={s.warranty} onChange={set('warranty')} />
        </div>
        <ToggleRow label={t.tipping} hint={t.tippingHint} checked={s.tipping} onChange={set('tipping')} />
      </>
    )
  return (
    <>
      <div className="grid2">
        <NumberUnit label={t.power} unit="HP" value={s.hp} onChange={set('hp')} decimal />
        <NumberUnit label={t.warranty} unit={t.unitYear} value={s.warranty} onChange={set('warranty')} />
        <NumberUnit label={t.gearsFwd} value={s.gearsFwd} onChange={set('gearsFwd')} />
        <NumberUnit label={t.gearsRev} value={s.gearsRev} onChange={set('gearsRev')} />
        <NumberUnit label={t.load} unit={t.unitTon} value={s.load} onChange={set('load')} decimal />
        <NumberUnit label={t.tank} unit={t.unitLitre} value={s.tank} onChange={set('tank')} />
      </div>
      <Chips
        label={t.start}
        options={[
          { value: 'self', label: t.selfStart },
          { value: 'kick', label: t.kickStart },
        ]}
        value={s.start}
        onChange={set('start')}
      />
    </>
  )
}

/* The site's own labels for the preview (word for word from the prototype). */
const SITE = {
  gu: { best: 'સૌથી વધુ વેચાતો', in: 'સ્ટૉકમાં', order: 'ઑર્ડર પર તૈયાર', ex: 'એક્સ-શોરૂમ કિંમત', ask: 'કિંમત માટે પૂછો', wa: 'વૉટ્સઍપ પર પૂછપરછ', power: 'પાવર', gears: 'ગિયર', fwd: 'આગળ', rev: 'રિવર્સ', load: 'વહન ક્ષમતા', ton: 'ટન', width: 'કામની પહોળાઈ', feet: 'ફૂટ', tip: 'ટિપિંગ', hyd: 'હાઇડ્રોલિક', fits: 'જોડાણ', fitsAll: 'અમારા બધા સનેડા સાથે' },
  hi: { best: 'सबसे ज़्यादा बिकने वाला', in: 'स्टॉक में', order: 'ऑर्डर पर तैयार', ex: 'एक्स-शोरूम कीमत', ask: 'कीमत के लिए पूछें', wa: 'व्हाट्सऐप पर पूछताछ', power: 'पावर', gears: 'गियर', fwd: 'आगे', rev: 'रिवर्स', load: 'भार क्षमता', ton: 'टन', width: 'काम की चौड़ाई', feet: 'फ़ुट', tip: 'टिपिंग', hyd: 'हाइड्रोलिक', fits: 'जोड़', fitsAll: 'हमारे सभी सनेडो के साथ' },
  en: { best: 'Best seller', in: 'In stock', order: 'Made to order', ex: 'Ex-showroom price', ask: 'Ask for price', wa: 'Enquire on WhatsApp', power: 'Power', gears: 'Gears', fwd: 'forward', rev: 'reverse', load: 'Load capacity', ton: 'tonne', width: 'Working width', feet: 'ft', tip: 'Tipping', hyd: 'Hydraulic', fits: 'Fits', fitsAll: 'All our sanedos' },
}

/** Mirror of the site's product card, in the language picked in the form. */
function PreviewCard({ d, loc, art, name }: { d: ProductData; loc: Loc; art: string | null; name: string }) {
  const s = SITE[loc]
  const n = (v: number | null) => (v == null ? '—' : num(v, loc))
  const vehicle = d.cat !== 'impl'
  const specs: [string, string][] = vehicle
    ? [
        [s.power, `${n(d.specs.hp)} HP`],
        [s.gears, `${n(d.specs.gearsFwd)} ${s.fwd}, ${n(d.specs.gearsRev)} ${s.rev}`],
      ]
    : ([
        d.specs.load != null ? [s.load, `${n(d.specs.load)} ${s.ton}`] : null,
        d.specs.width != null ? [s.width, `${n(d.specs.width)} ${s.feet}`] : null,
        d.specs.tipping ? [s.tip, s.hyd] : null,
        [s.fits, s.fitsAll],
      ].filter(Boolean) as [string, string][]).slice(0, 2)
  const img = d.photos[0]?.url || art
  const askPrice = d.hidePrice || d.price == null
  return (
    <div className="pcard" lang={loc}>
      <div className="pic">
        {d.best && <span className="tag">{s.best}</span>}
        <span className={`stk${d.stock ? ' in' : ''}`}>{d.stock ? s.in : s.order}</span>
        {img ? <img src={img} alt="" className={d.photos[0] ? 'photo' : undefined} /> : <div style={{ aspectRatio: '16/10' }} />}
      </div>
      <div className="body">
        <h3>{name || '—'}</h3>
        <p className="desc">{pick(d.desc, loc)}</p>
        <dl>
          {specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="price">
          {askPrice ? (
            <>
              <small>&nbsp;</small>
              <b className="ask">{s.ask}</b>
            </>
          ) : (
            <>
              <small>{s.ex}</small>
              <b>{money(d.price, loc)}</b>
            </>
          )}
        </div>
        <div className="wa">{s.wa}</div>
      </div>
    </div>
  )
}
