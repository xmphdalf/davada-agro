'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { reorder, setFlag } from '@/admin/actions'
import type { ProductRow } from '@/admin/productView'
import { useAdmin } from '@/admin/ui/AdminContext'
import { Switch } from '@/admin/ui/form'
import { IHandle, ISanedo } from '@/admin/ui/icons'
import { Sortable } from '@/admin/ui/Sortable'
import { useSynced } from '@/admin/ui/useSynced'

const Thumb = ({ p }: { p: ProductRow }) => (
  <span className="thumb">
    {p.img ? <img src={p.img} alt="" className={p.photo ? 'photo' : undefined} /> : <ISanedo style={{ color: 'var(--muted)' }} />}
  </span>
)

export function ProductsList({ initial }: { initial: ProductRow[] }) {
  const { t, toast } = useAdmin()
  const router = useRouter()
  const [rows, setRows] = useSynced(initial)

  const onReorder = async (next: ProductRow[]) => {
    setRows(next)
    const res = await reorder('products', next.map((r) => r.id))
    if (!res.ok) {
      toast(t.saveFailed)
      setRows(initial)
    }
  }

  const flip = async (p: ProductRow, field: 'stock' | 'best', value: boolean) => {
    setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, [field]: value } : r)))
    const res = await setFlag(p.id, field, value)
    if (res.ok) {
      const msg = field === 'stock' ? `${p.name}: ${value ? t.inStock : t.toOrder}` : `${p.name}: ${t.bestLabel} ${value ? '✓' : '✕'}`
      toast(msg, res.historyId)
      router.refresh()
    } else {
      toast(t.saveFailed)
      setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, [field]: !value } : r)))
    }
  }

  const dots = (p: ProductRow) => (
    <span className="langdots" aria-label={t.colLang}>
      <span><span className="dot-ok" />ગુ</span>
      <span lang="hi"><span className={p.hi ? 'dot-ok' : 'dot-miss'} />हि</span>
      <span lang="en"><span className={p.en ? 'dot-ok' : 'dot-miss'} />En</span>
    </span>
  )

  return (
    <>
      {/* Phone: rows with a drag handle and the stock switch */}
      <Sortable
        className="card plist"
        items={rows}
        onReorder={onReorder}
        render={(p, _i, h) => (
          <div ref={h.ref} style={h.style} className={`prow${h.dragging ? ' dragging' : ''}`}>
            <button className="handle" aria-label={`${t.reorder}: ${p.name}`} {...h.handle}>
              <IHandle />
            </button>
            <Link href={`/admin/products/${p.id}`} className="open">
              <Thumb p={p} />
              <span className="info">
                <span className="ellipsis" style={{ fontWeight: 600 }}>{p.name}</span>
                <span className="hint">{p.price}</span>
                {!p.hi && (
                  <span className="missing"><span className="dot-miss" />{t.hiMissing}</span>
                )}
              </span>
            </Link>
            <span className="sw-col">
              <Switch checked={p.stock} onChange={(v) => flip(p, 'stock', v)} label={`${p.name}: ${t.inStock}`} />
              {t.stock}
            </span>
          </div>
        )}
      />

      {/* Desktop: table with both switches and the language status */}
      <Sortable
        items={rows}
        onReorder={onReorder}
        container={(body) => (
          <div className="card ptable">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 56 }}>{t.colOrder}</th>
                  <th>{t.colProduct}</th>
                  <th>{t.colModelId}</th>
                  <th>{t.colCat}</th>
                  <th>{t.colPrice}</th>
                  <th>{t.colLang}</th>
                  <th>{t.colStock}</th>
                  <th>{t.colBest}</th>
                  <th />
                </tr>
              </thead>
              <tbody>{body}</tbody>
            </table>
          </div>
        )}
        render={(p, _i, h) => (
          <tr ref={h.ref as (el: HTMLTableRowElement | null) => void} style={h.style} className={h.dragging ? 'dragging' : undefined}>
            <td>
              <button className="handle" aria-label={`${t.reorder}: ${p.name}`} {...h.handle}>
                <IHandle />
              </button>
            </td>
            <td>
              <Link href={`/admin/products/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', fontWeight: 600 }}>
                <Thumb p={p} />
                {p.name}
              </Link>
            </td>
            <td className="latin">{p.modelId}</td>
            <td>{p.cat}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{p.price}</td>
            <td>{dots(p)}</td>
            <td><Switch checked={p.stock} onChange={(v) => flip(p, 'stock', v)} label={`${p.name}: ${t.colStock}`} /></td>
            <td><Switch checked={p.best} onChange={(v) => flip(p, 'best', v)} label={`${p.name}: ${t.colBest}`} /></td>
            <td>
              <Link className="btn btn-ghost btn-sm" href={`/admin/products/${p.id}`}>{t.edit}</Link>
            </td>
          </tr>
        )}
      />
    </>
  )
}
