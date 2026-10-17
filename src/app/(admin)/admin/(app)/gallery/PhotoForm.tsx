'use client'

import { useRouter } from 'next/navigation'

import { saveDoc, trashDoc } from '@/admin/actions'
import { ytThumb, type GalleryCat, type GalleryItem } from '@/admin/galleryView'
import { useAdmin } from '@/admin/ui/AdminContext'
import { Chips, Field, I18nInput, LangScope, RefSelect, SaveBar, useConfirm, useForm } from '@/admin/ui/form'
import { ILink, IPhoto, ITrash } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { num, youtubeId } from '@/lib/format'

type Data = {
  cat: GalleryCat
  caption: { gu: string; hi: string; en: string }
  product: string | null
  link: string
}

/**
 * “ફોટાની વિગત”: category, caption in three languages, and the model in the photo.
 * Also used to add a YouTube video (item.id === '' and kind 'video').
 */
export function PhotoForm({ item, products, inline, index, total }: {
  item: GalleryItem
  products: { value: string; label: string; sub?: string }[]
  inline?: boolean
  index?: number
  total?: number
}) {
  const { t, lang, toast } = useAdmin()
  const router = useRouter()
  const { ask, dialog } = useConfirm()
  const isNew = !item.id
  const video = item.kind === 'video'

  const form = useForm<Data>(
    { cat: item.cat, caption: item.caption, product: item.product, link: item.youtube ?? '' },
    (d) =>
      saveDoc('gallery', item.id || null, {
        kind: item.kind,
        cat: d.cat,
        caption: d.caption,
        product: d.product ? Number(d.product) : null,
        ...(video ? { youtube: youtubeId(d.link) } : {}),
      }),
    {
      validate: (d): Record<string, string> => (video && !youtubeId(d.link) ? { link: t.youtubeInvalid } : {}),
      onSaved: () => {
        if (isNew) router.replace('/admin/gallery')
      },
    },
  )
  const d = form.data
  const yt = video ? youtubeId(d.link) : null

  const onDelete = async () => {
    if (!(await ask(video ? t.thisVideo : t.thisPhoto))) return
    const res = await trashDoc('gallery', item.id)
    if (res.ok) {
      toast(t.deleted, res.historyId)
      router.replace('/admin/gallery')
      router.refresh()
    } else toast(t.saveFailed)
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/gallery#g-${(index ?? 0) + 1}`
    try {
      await navigator.clipboard.writeText(url)
      toast(t.linkCopied)
    } catch {
      window.prompt(t.copyLink, url)
    }
  }

  const cats: { value: GalleryCat; label: string }[] = [
    { value: 'sanedo', label: t.catSanedo },
    { value: 'impl', label: t.catImplG },
    { value: 'delivery', label: t.catDelivery },
    { value: 'workshop', label: t.catWorkshop },
    { value: 'honours', label: t.catHonours },
  ]

  const media = (
    <div className="mediahead">
      {video ? (
        yt ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            title="YouTube"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <IPhoto size={40} />
        )
      ) : item.image ? (
        <img src={item.image.url} alt={d.caption.gu} />
      ) : (
        <IPhoto size={40} />
      )}
    </div>
  )

  const fields = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {video && (
        <Field label={t.youtubeLink} hint={t.youtubeHint} error={form.errors.link}>
          <div className={`inp${form.errors.link ? ' bad' : ''}`}>
            <input
              className="latin"
              inputMode="url"
              placeholder="https://youtu.be/…"
              value={d.link}
              onChange={(e) => form.set('link', e.target.value)}
            />
          </div>
          {yt && <img src={ytThumb(yt)} alt="" style={{ borderRadius: 10, width: 160 }} />}
        </Field>
      )}
      <Chips label={t.category} options={cats} value={d.cat} onChange={(v) => form.set('cat', v)} />
      <div className="f" style={{ gap: 10 }}>
        <span className="fl">{t.caption}</span>
        <LangScope values={[d.caption]}>
          <CaptionInput value={d.caption} onChange={(v) => form.set('caption', v)} />
        </LangScope>
      </div>
      <RefSelect
        label={<>{t.whichModel} <span className="hint" style={{ fontWeight: 400 }}>{t.optional}</span></>}
        hint={t.whichModelHint}
        value={d.product}
        onChange={(v) => form.set('product', v)}
        options={products}
        empty={t.noModel}
      />
      {!isNew && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          {!video && (
            <button className="linkbtn plain" onClick={copyLink}><ILink />{t.copyLink}</button>
          )}
          <button className="linkbtn plain danger" onClick={onDelete}><ITrash />{video ? t.deleteVideo : t.deletePhoto}</button>
        </div>
      )}
    </div>
  )

  if (inline)
    return (
      <div className="card">
        {media}
        <div style={{ padding: 18 }}>{fields}</div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderTop: '1px solid var(--line)', alignItems: 'center' }}>
          <span className="hint" style={{ flexGrow: 1 }}>{form.dirty ? t.unsaved : t.allSaved}</span>
          <button className="btn btn-ghost" onClick={form.reset} disabled={!form.dirty || form.saving}>{t.cancel}</button>
          <button className="btn btn-kesar" onClick={form.submit} disabled={!form.dirty || form.saving}>{form.saving ? t.saving : t.save}</button>
        </div>
        {dialog}
      </div>
    )

  return (
    <>
      <PageHeader
        title={isNew ? t.addVideo : t.photoDetails}
        back="/admin/gallery"
        siteLink={false}
        right={index != null && total ? <span className="hint" style={{ paddingRight: 10 }}>{num(index + 1, lang)} / {num(total, lang)}</span> : undefined}
      />
      {media}
      <div className="page form" style={{ paddingTop: 20, maxWidth: 720 }}>{fields}</div>
      <SaveBar form={form} />
      {dialog}
    </>
  )
}

function CaptionInput({ value, onChange }: { value: Data['caption']; onChange: (v: Data['caption']) => void }) {
  const { t } = useAdmin()
  return (
    <I18nInput
      label={t.caption}
      value={value}
      onChange={(v) => onChange({ gu: v.gu ?? '', hi: v.hi ?? '', en: v.en ?? '' })}
      guide={40}
      hint={t.captionHint}
      showMissing={false}
      hideLabel
    />
  )
}
