'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { addGalleryPhotos, reorder } from '@/admin/actions'
import { ytThumb, type GalleryCat, type GalleryItem } from '@/admin/galleryView'
import { useAdmin } from '@/admin/ui/AdminContext'
import { Chips } from '@/admin/ui/form'
import { ICamera, IPhoto, IPlay, IPlayFill, IUpload, Ring } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { Sortable } from '@/admin/ui/Sortable'
import { uploadPhoto } from '@/admin/ui/upload'
import { useSynced } from '@/admin/ui/useSynced'
import { num } from '@/lib/format'
import { PhotoForm } from './PhotoForm'

type Up = { key: string; file: File; pct: number; failed?: boolean; mediaId?: string }

export function GalleryBoard({ items: initial, products, selected }: {
  items: GalleryItem[]
  products: { value: string; label: string; sub?: string }[]
  selected: string | null
}) {
  const { t, lang, toast } = useAdmin()
  const router = useRouter()
  const [items, setItems] = useSynced(initial)
  const [filter, setFilter] = useState<'all' | GalleryCat>('all')
  const [ups, setUps] = useState<Up[]>([])
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const cats: { value: 'all' | GalleryCat; label: string }[] = [
    { value: 'all', label: t.all },
    { value: 'sanedo', label: t.catSanedo },
    { value: 'impl', label: t.catImplG },
    { value: 'delivery', label: t.catDelivery },
    { value: 'workshop', label: t.catWorkshop },
    { value: 'honours', label: t.catHonours },
  ]
  const shown = filter === 'all' ? items : items.filter((i) => i.cat === filter)
  const sel = selected ? items.find((i) => i.id === selected) : undefined

  /* Uploads: each photo goes up in the background; once all finish they join the gallery. */
  const run = (list: Up[]) => {
    const cat = filter === 'all' ? 'delivery' : filter
    const done: string[] = []
    let left = list.length
    const finish = async () => {
      if (--left > 0) return
      if (done.length) {
        const res = await addGalleryPhotos(done, cat)
        if (!res.ok) toast(t.saveFailed)
        router.refresh()
      }
      setUps((u) => u.filter((x) => x.failed))
    }
    for (const u of list) {
      uploadPhoto(u.file, (pct) => setUps((all) => all.map((x) => (x.key === u.key ? { ...x, pct } : x))))
        .then((ref) => {
          done.push(ref.id)
          setUps((all) => all.map((x) => (x.key === u.key ? { ...x, pct: 100, mediaId: ref.id } : x)))
        })
        .catch(() => {
          setUps((all) => all.map((x) => (x.key === u.key ? { ...x, failed: true } : x)))
          toast(t.uploadFailed)
        })
        .finally(finish)
    }
  }
  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ key: `${file.name}-${file.size}-${Math.random()}`, file, pct: 0 }))
    if (!list.length) return
    setUps((u) => [...u.filter((x) => !x.failed), ...list])
    run(list)
  }
  const retry = (u: Up) => {
    const again = { ...u, failed: false, pct: 0 }
    setUps((all) => all.map((x) => (x.key === u.key ? again : x)))
    run([again])
  }
  const active = ups.filter((u) => !u.failed)
  const doneCount = active.filter((u) => u.mediaId).length

  const open = (id: string) => (e: React.MouseEvent) => {
    if (window.matchMedia('(min-width: 1000px)').matches) {
      e.preventDefault()
      router.push(`/admin/gallery?sel=${id}`, { scroll: false })
    }
  }

  const onReorder = async (next: GalleryItem[]) => {
    setItems(next)
    const res = await reorder('gallery', next.map((i) => i.id))
    if (!res.ok) {
      toast(t.saveFailed)
      setItems(initial)
    }
  }

  const tile = (g: GalleryItem, h?: { ref: (el: HTMLElement | null) => void; style: React.CSSProperties; handle: React.HTMLAttributes<HTMLElement> }) => (
    <Link
      key={g.id}
      ref={h?.ref}
      style={h?.style}
      {...h?.handle}
      href={`/admin/gallery/${g.id}`}
      onClick={open(g.id)}
      className={`gtile${g.kind === 'video' ? ' video' : ''}`}
      aria-current={g.id === selected ? 'true' : undefined}
      aria-label={g.caption.gu || (g.kind === 'video' ? t.video : t.photoDetails)}
      draggable={false}
    >
      {g.kind === 'video' && g.youtube ? (
        <>
          <img className="photo" src={ytThumb(g.youtube)} alt="" loading="lazy" draggable={false} />
          <span className="play"><IPlayFill /></span>
        </>
      ) : g.image ? (
        <img className="photo" src={g.image.thumb} alt="" loading="lazy" draggable={false} />
      ) : (
        <IPhoto />
      )}
      {g.missing && <span className="mdot" aria-label={t.captionMissingShort} />}
    </Link>
  )

  return (
    <>
      <PageHeader
        title={t.gallery}
        count={num(items.length, lang)}
        siteLink={false}
        right={
          <span className="desk-only" style={{ gap: 10 }}>
            <Link className="btn btn-ghost" href="/admin/gallery/video"><IPlay />{t.addVideo}</Link>
            <button className="btn btn-kesar" onClick={() => input.current?.click()}><ICamera />{t.addPhotos}</button>
          </span>
        }
      />
      <div className="page">
        <div className={`gal-wrap${sel ? ' has-panel' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            <div className="mob-only" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 10 }}>
              <button className="btn btn-kesar btn-lg" onClick={() => input.current?.click()}><ICamera />{t.addPhoto}</button>
              <Link className="btn btn-ghost btn-lg" href="/admin/gallery/video"><IPlay />{t.video}</Link>
            </div>
            <div
              className={`drop${over ? ' over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setOver(true)
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setOver(false)
                addFiles(e.dataTransfer.files)
              }}
            >
              <IUpload />
              <span>{t.dropPhotos} <button type="button" onClick={() => input.current?.click()}>{t.choose}</button></span>
            </div>
            <Chips label={t.category} scroll options={cats} value={filter} onChange={setFilter} />

            {(ups.length > 0 || shown.length > 0) && (
              <div className="gtiles" style={{ marginBottom: -6 }}>
                {ups.map((u) =>
                  u.failed ? (
                    <button key={u.key} className="ptile failed" onClick={() => retry(u)}>
                      <span>{t.retry}</span>
                    </button>
                  ) : (
                    <div key={u.key} className="ptile" style={{ background: 'var(--wash-2)' }}>
                      <Ring pct={u.pct} size={36} />
                    </div>
                  ),
                )}
              </div>
            )}
            {filter === 'all' ? (
              <Sortable grid className="gtiles" items={shown} onReorder={onReorder} render={(g, _i, h) => tile(g, h)} />
            ) : (
              <div className="gtiles">{shown.map((g) => tile(g))}</div>
            )}

            {shown.length === 0 && ups.length === 0 && (
              <div className="card pad" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
                <IPhoto size={40} />
                <p className="hint">{items.length === 0 ? t.galleryEmpty : t.galleryCatEmpty}</p>
                {filter !== 'all' && <button className="btn btn-ghost" onClick={() => setFilter('all')}>{t.all}</button>}
              </div>
            )}
            {shown.some((g) => g.missing) && (
              <p className="hint" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="dot-miss" style={{ width: 10, height: 10, borderWidth: 2 }} />
                {t.captionMissing}
              </p>
            )}
          </div>

          {sel && (
            <aside className="gal-panel">
              <PhotoForm key={sel.id} item={sel} products={products} inline index={items.indexOf(sel)} total={items.length} />
            </aside>
          )}
        </div>
      </div>

      {active.length > 0 && (
        <div className="toast" role="status">
          <Ring pct={(doneCount / active.length) * 100} size={22} light />
          <span className="msg">{t.uploadedOf(num(doneCount, lang), num(active.length, lang))}</span>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </>
  )
}
