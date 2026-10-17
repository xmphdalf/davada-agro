'use client'

import { useEffect, useRef, useState } from 'react'

import { num } from '@/lib/format'
import { useAdmin } from './AdminContext'
import { IAlert, ICamera, IClose, IUpload, Ring } from './icons'
import { Sortable } from './Sortable'
import { uploadPhoto, type MediaRef } from './upload'

type Pending = { key: string; file: File; pct: number; failed?: boolean }

/**
 * images: camera / gallery picker. The first photo is the main one; press and hold (or drag on
 * desktop) to reorder. Photos upload in the background while the rest of the form is filled.
 */
export function PhotoPicker({ value, onChange, max = 6, hint, hintDesktop }: {
  value: MediaRef[]
  onChange: (v: MediaRef[]) => void
  max?: number
  hint?: string
  hintDesktop?: string
}) {
  const { t, lang } = useAdmin()
  const [pending, setPending] = useState<Pending[]>([])
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const latest = useRef(value)
  useEffect(() => {
    latest.current = value
  }, [value])

  const start = (p: Pending) => {
    setPending((list) => [...list.filter((x) => x.key !== p.key), { ...p, pct: 0, failed: false }])
    uploadPhoto(p.file, (pct) => setPending((list) => list.map((x) => (x.key === p.key ? { ...x, pct } : x))))
      .then((ref) => {
        setPending((list) => list.filter((x) => x.key !== p.key))
        onChange([...latest.current, ref].slice(0, max))
      })
      .catch(() => setPending((list) => list.map((x) => (x.key === p.key ? { ...x, failed: true } : x))))
  }

  const addFiles = (files: FileList | File[]) => {
    const room = max - value.length - pending.length
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, Math.max(0, room))
      .forEach((file) => start({ key: `${file.name}-${file.size}-${Math.random()}`, file, pct: 0 }))
  }

  const full = value.length + pending.length >= max
  const items = value.map((m) => ({ ...m, id: m.id }))

  return (
    <div className="f" style={{ gap: 10 }}>
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
        <span>
          {t.dropPhotos} <button type="button" onClick={() => input.current?.click()}>{t.choose}</button>
        </span>
      </div>
      <Sortable
        grid
        className="ptiles"
        items={items}
        onReorder={(next) => onChange(next)}
        render={(m, i, h) => (
          <div ref={h.ref} style={h.style} {...h.handle} className="ptile">
            <img className="photo" src={m.thumb} alt={`${t.photos} ${num(i + 1, lang)}`} draggable={false} />
            {i === 0 && <span className="badge">{t.main}</span>}
            {i > 0 && (
              <button type="button" className="mk" onPointerDown={(e) => e.stopPropagation()} onClick={() => onChange([m, ...value.filter((x) => x.id !== m.id)])}>
                {t.makeMain}
              </button>
            )}
            <button
              type="button"
              className="x"
              aria-label={t.removePhoto}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onChange(value.filter((x) => x.id !== m.id))}
            >
              <IClose size={16} />
            </button>
          </div>
        )}
      />
      {(pending.length > 0 || !full) && (
        <div className="ptiles">
          {pending.map((p) =>
            p.failed ? (
              <button key={p.key} type="button" className="ptile failed" onClick={() => start(p)} aria-label={t.retry}>
                <IAlert size={26} />
                <span>{t.retry}</span>
              </button>
            ) : (
              <div key={p.key} className="ptile" style={{ background: 'var(--wash-2)' }}>
                <Ring pct={p.pct} />
                <span className="pct">{num(p.pct, lang)}%</span>
              </div>
            ),
          )}
          {!full && (
            <button type="button" className="addtile mob" onClick={() => input.current?.click()}>
              <ICamera size={24} />
              <span>{t.add}</span>
            </button>
          )}
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
      {(hint || hintDesktop) && (
        <p className="hint">
          <span className="mob-only">{hint}</span>
          <span className="desk-only">{hintDesktop ?? hint}</span>
        </p>
      )}
    </div>
  )
}
