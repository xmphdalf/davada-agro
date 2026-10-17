'use client'

import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

import { undoChange } from '../actions'
import { getStrings, type AdminLang, type Strings } from '../strings'
import { ICheck } from './icons'

type Toast = { msg: string; historyId?: string; key: number }
type Ctx = {
  lang: AdminLang
  t: Strings
  toast: (msg: string, historyId?: string) => void
  /** Set by forms with a sticky save bar so the toast sits above it. */
  setOverSavebar: (v: boolean) => void
}

const AdminCtx = createContext<Ctx | null>(null)

export const useAdmin = () => {
  const c = useContext(AdminCtx)
  if (!c) throw new Error('useAdmin outside AdminProvider')
  return c
}

const UNDO_MS = 10_000

export function AdminProvider({ lang, children }: { lang: AdminLang; children: ReactNode }) {
  const t = getStrings(lang)
  const router = useRouter()
  const [current, setCurrent] = useState<Toast | null>(null)
  const [overSavebar, setOverSavebar] = useState(false)
  const [offline, setOffline] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const toast = useCallback((msg: string, historyId?: string) => {
    clearTimeout(timer.current)
    setCurrent({ msg, historyId, key: Date.now() })
    timer.current = setTimeout(() => setCurrent(null), historyId ? UNDO_MS : 4000)
  }, [])

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  const onUndo = async () => {
    if (!current?.historyId) return
    const id = current.historyId
    setCurrent(null)
    const res = await undoChange(id)
    if (res.ok) {
      toast(t.undone)
      router.refresh()
    } else toast(t.saveFailed)
  }

  return (
    <AdminCtx.Provider value={{ lang, t, toast, setOverSavebar }}>
      {offline && (
        <div className="banner" role="status" style={{ margin: 12, position: 'sticky', top: 8, zIndex: 30 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
          <span>{t.offline}</span>
        </div>
      )}
      {children}
      {current && (
        <div key={current.key} className={`toast${overSavebar ? ' over-savebar' : ''}`} role="status" aria-live="polite">
          <ICheck style={{ flex: 'none' }} />
          <span className="msg">{current.msg}</span>
          {current.historyId && <button onClick={onUndo}>{t.undo}</button>}
        </div>
      )}
    </AdminCtx.Provider>
  )
}
