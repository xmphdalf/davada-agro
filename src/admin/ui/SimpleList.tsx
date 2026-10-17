'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { reorder } from '../actions'
import { useAdmin } from './AdminContext'
import { IChevron, IHandle } from './icons'
import { Sortable } from './Sortable'
import { useSynced } from './useSynced'

export type SimpleRow = { id: string; title: string; sub?: string; missing?: boolean; icon?: ReactNode }

/** list: rows with a drag handle and open-to-edit (awards, reviews). */
export function SimpleList({ collection, rows: initial, base }: { collection: 'awards' | 'reviews'; rows: SimpleRow[]; base: string }) {
  const { t, toast } = useAdmin()
  const [rows, setRows] = useSynced(initial)
  return (
    <Sortable
      className="card"
      items={rows}
      onReorder={async (next) => {
        setRows(next)
        const res = await reorder(collection, next.map((r) => r.id))
        if (!res.ok) {
          toast(t.saveFailed)
          setRows(initial)
        }
      }}
      render={(r, _i, h) => (
        <div ref={h.ref} style={h.style} className={`prow${h.dragging ? ' dragging' : ''}`}>
          <button className="handle" aria-label={`${t.reorder}: ${r.title}`} {...h.handle}>
            <IHandle />
          </button>
          <Link href={`${base}/${r.id}`} className="open">
            {r.icon && <span className="thumb">{r.icon}</span>}
            <span className="info">
              <span className="ellipsis" style={{ fontWeight: 600 }}>{r.title}</span>
              {r.sub && <span className="hint ellipsis">{r.sub}</span>}
              {r.missing && <span className="missing"><span className="dot-miss" />{t.langNameHi} / {t.langNameEn}</span>}
            </span>
          </Link>
          <IChevron className="chev" />
        </div>
      )}
    />
  )
}
