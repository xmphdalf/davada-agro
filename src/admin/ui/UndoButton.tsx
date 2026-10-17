'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { undoChange } from '../actions'
import { useAdmin } from './AdminContext'

/** “પાછું લો” on a history row. */
export function UndoButton({ id, label }: { id: string; label?: string }) {
  const { t, toast } = useAdmin()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  return (
    <button
      className="btn btn-ghost btn-sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        const res = await undoChange(id)
        setBusy(false)
        if (res.ok) {
          toast(t.undone)
          router.refresh()
        } else toast(t.saveFailed)
      }}
    >
      {label ?? t.undo}
    </button>
  )
}
