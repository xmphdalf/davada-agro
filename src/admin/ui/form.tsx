'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useId, useMemo, useState, type ReactNode } from 'react'

import { money, num } from '@/lib/format'
import type { ActionResult } from '../actions'
import { useAdmin } from './AdminContext'
import { IAlert, ICaret } from './icons'

/* ---------------- Form state ---------------- */

type Obj = Record<string, unknown>

const setIn = (obj: Obj, path: string, value: unknown): Obj => {
  const [head, ...rest] = path.split('.')
  if (!rest.length) return { ...obj, [head]: value }
  return { ...obj, [head]: setIn((obj[head] as Obj) || {}, rest.join('.'), value) }
}
export const getIn = (obj: Obj, path: string): unknown =>
  path.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Obj)[k]), obj)

const norm = (v: unknown): unknown => {
  if (v === '' || v === undefined) return null
  if (Array.isArray(v)) return v.map(norm)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, norm(x)]))
  return v
}
const equal = (a: unknown, b: unknown) => JSON.stringify(norm(a)) === JSON.stringify(norm(b))

export type FormApi<T extends Obj> = {
  data: T
  set: (path: string, value: unknown) => void
  dirty: boolean
  saving: boolean
  errors: Record<string, string>
  reset: () => void
  submit: () => Promise<void>
}

/**
 * Local form state with a dirty flag. `save` returns an ActionResult; on success the
 * toast confirms and offers undo for 10 seconds.
 */
export function useForm<T extends Obj>(
  initial: T,
  save: (data: T) => Promise<ActionResult>,
  opts: { onSaved?: (res: Extract<ActionResult, { ok: true }>) => void; validate?: (data: T) => Record<string, string> } = {},
): FormApi<T> {
  const { t, toast } = useAdmin()
  const router = useRouter()
  const [base, setBase] = useState(initial)
  const [data, setData] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dirty = useMemo(() => !equal(base, data), [base, data])

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const h = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  return {
    data,
    dirty,
    saving,
    errors,
    set: (path, value) => {
      setData((d) => setIn(d, path, value) as T)
      setErrors((e) => {
        if (!e[path]) return e
        const n = { ...e }
        delete n[path]
        return n
      })
    },
    reset: () => {
      setData(base)
      setErrors({})
    },
    submit: async () => {
      if (!navigator.onLine) {
        toast(t.offline)
        return
      }
      const local = opts.validate?.(data) ?? {}
      if (Object.keys(local).length) {
        setErrors(local)
        return
      }
      setSaving(true)
      try {
        const res = await save(data)
        if (res.ok) {
          setBase(data)
          setErrors({})
          toast(t.saved, res.historyId)
          opts.onSaved?.(res)
          router.refresh()
        } else {
          setErrors(res.errors ?? {})
          toast(t.saveFailed)
        }
      } catch {
        toast(t.saveFailed)
      } finally {
        setSaving(false)
      }
    },
  }
}

/** Sticky bottom bar: grey when nothing changed, kesar “સાચવો” once something has. */
export function SaveBar<T extends Obj>({ form }: { form: FormApi<T> }) {
  const { t, setOverSavebar } = useAdmin()
  useEffect(() => {
    setOverSavebar(true)
    return () => setOverSavebar(false)
  }, [setOverSavebar])
  return (
    <div className="savebar">
      {form.dirty ? (
        <>
          <span className="msg">{t.unsaved}</span>
          <button className="btn btn-ghost" onClick={form.reset} disabled={form.saving}>{t.cancel}</button>
          <button className="btn btn-kesar" onClick={form.submit} disabled={form.saving}>
            {form.saving ? t.saving : t.save}
          </button>
        </>
      ) : (
        <>
          <span className="msg idle">{t.allSaved}</span>
          <button className="btn" disabled>{t.save}</button>
        </>
      )}
    </div>
  )
}

/* ---------------- Language tabs ---------------- */

export type Loc = 'gu' | 'hi' | 'en'
export type I18n = { gu?: string | null; hi?: string | null; en?: string | null }
const LOCS: { id: Loc; label: string }[] = [
  { id: 'gu', label: 'ગુજરાતી' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'en', label: 'English' },
]

const LocCtx = createContext<{ loc: Loc; setLoc: (l: Loc) => void }>({ loc: 'gu', setLoc: () => {} })
export const useLoc = () => useContext(LocCtx)

const filled = (v: I18n | null | undefined, l: Loc) => Boolean(v?.[l]?.trim())

/**
 * Language switch for the translated fields below it. A hollow kesar dot marks a
 * language that still has an empty field.
 */
export function LangScope({ values, children, loc: controlled, onLoc }: {
  values: (I18n | null | undefined)[]
  children?: ReactNode
  loc?: Loc
  onLoc?: (l: Loc) => void
}) {
  const [own, setOwn] = useState<Loc>('gu')
  const loc = controlled ?? own
  const setLoc = onLoc ?? setOwn
  return (
    <LocCtx.Provider value={{ loc, setLoc }}>
      <LangTabs values={values} />
      {children}
    </LocCtx.Provider>
  )
}

export function LangTabs({ values }: { values: (I18n | null | undefined)[] }) {
  const { loc, setLoc } = useLoc()
  return (
    <div className="seg" role="tablist" aria-label="ભાષા / Language">
      {LOCS.map((l) => {
        const ok = values.every((v) => filled(v, l.id))
        return (
          <button key={l.id} type="button" role="tab" aria-selected={loc === l.id} lang={l.id} onClick={() => setLoc(l.id)}>
            <span className={ok ? 'dot-ok' : 'dot-miss'} />
            {l.label}
          </button>
        )
      })}
    </div>
  )
}

/** A provider without visible tabs, for fields that follow a page-level switch. */
export const LocProvider = ({ loc, children }: { loc: Loc; children: ReactNode }) => (
  <LocCtx.Provider value={{ loc, setLoc: () => {} }}>{children}</LocCtx.Provider>
)

/* ---------------- Fields ---------------- */

export function Field({ label, hint, error, children, htmlFor, right }: {
  label?: ReactNode
  hint?: ReactNode
  error?: string
  children: ReactNode
  htmlFor?: string
  right?: ReactNode
}) {
  return (
    <div className="f">
      {label && (
        <label className="fl" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="err" role="alert"><IAlert />{error}</span>
      ) : (
        (hint || right) && (
          <span className="hint f-row">
            <span>{hint}</span>
            {right && <span style={{ flex: 'none' }}>{right}</span>}
          </span>
        )
      )}
    </div>
  )
}

/** text.i18n / longtext.i18n: edits the language picked in the surrounding LangScope. */
export function I18nInput({ label, value, onChange, guide, multiline, hint, error, showMissing = true, hideLabel, rows = 3 }: {
  label: string
  /** Keep the label for screen readers only (when a heading above already names the field). */
  hideLabel?: boolean
  rows?: number
  value: I18n | null | undefined
  onChange: (v: I18n) => void
  guide?: number
  multiline?: boolean
  hint?: ReactNode
  error?: string
  showMissing?: boolean
}) {
  const { loc } = useLoc()
  const { t, lang } = useAdmin()
  const id = useId()
  const v = value?.[loc] ?? ''
  const gu = value?.gu ?? ''
  const langName = loc === 'hi' ? t.langNameHi : t.langNameEn
  const count = guide ? `${num(v.length, lang)} / ${num(guide, lang)}` : undefined
  const missing = loc !== 'gu' && !v.trim() && gu.trim()
  const common = {
    id,
    lang: loc,
    value: v,
    placeholder: loc !== 'gu' ? gu : undefined,
    onChange: (e: { target: { value: string } }) => onChange({ ...value, [loc]: e.target.value }),
  }
  return (
    <div className="f">
      <label className={hideLabel ? 'sr-only' : 'fl'} htmlFor={id}>{label}</label>
      <div className={`inp${error ? ' bad' : ''}`}>
        {multiline ? <textarea rows={rows} {...common} style={rows < 3 ? { minHeight: 0 } : undefined} /> : <input type="text" {...common} />}
      </div>
      {error ? (
        <span className="err" role="alert"><IAlert />{error}</span>
      ) : missing && showMissing ? (
        <span className="warn"><IAlert />{t.langMissing(langName)}</span>
      ) : (
        (hint || count) && (
          <span className="hint f-row">
            <span>{loc !== 'gu' && gu ? <>{t.guText} {gu}{hint ? <> · {hint}</> : null}</> : hint}</span>
            {count && <span style={{ flex: 'none' }}>{count}</span>}
          </span>
        )
      )}
    </div>
  )
}

export function TextInput({ label, value, onChange, hint, error, type = 'text', inputMode, latin, readOnly, autoComplete, prefix }: {
  label: string
  value: string | null | undefined
  onChange?: (v: string) => void
  hint?: ReactNode
  error?: string
  type?: string
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'url' | 'email'
  latin?: boolean
  readOnly?: boolean
  autoComplete?: string
  prefix?: ReactNode
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div className={`inp${error ? ' bad' : ''}${readOnly ? ' ro' : ''}`}>
        {prefix && <span className="pre">{prefix}</span>}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          className={latin ? 'latin' : undefined}
          value={value ?? ''}
          readOnly={readOnly}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </Field>
  )
}

/** money: ₹ prefix, digits only while typing, live “સાઇટ પર: ₹૧,૬૫,૦૦૦”. */
export function MoneyInput({ label, value, onChange, error }: {
  label: string
  value: number | null | undefined
  onChange: (v: number | null) => void
  error?: string
}) {
  const { t } = useAdmin()
  const id = useId()
  const [raw, setRaw] = useState(value == null ? '' : String(value))
  // Follow outside changes (cancel, undo) without fighting the user's typing.
  const [prev, setPrev] = useState(value)
  if (prev !== value) {
    setPrev(value)
    if (!(Number(raw.replace(/,/g, '')) === value || (raw === '' && value == null))) setRaw(value == null ? '' : String(value))
  }
  const bad = raw !== '' && !/^\d+$/.test(raw.replace(/,/g, ''))
  return (
    <Field
      label={label}
      htmlFor={id}
      error={bad ? t.digitsOnly : error}
      hint={raw && !bad ? <>{t.onSite} <b style={{ color: 'var(--ink)' }}>{money(Number(raw.replace(/,/g, '')), 'gu')}</b></> : undefined}
    >
      <div className={`inp${bad || error ? ' bad' : ''}`}>
        <span className="pre">₹</span>
        <input
          id={id}
          inputMode="numeric"
          className="latin"
          value={raw}
          onChange={(e) => {
            const v = e.target.value
            setRaw(v)
            const clean = v.replace(/,/g, '')
            if (clean === '') onChange(null)
            else if (/^\d+$/.test(clean)) onChange(Number(clean))
          }}
        />
      </div>
    </Field>
  )
}

/** number.unit: number with a fixed unit label after it (HP, ટન, લિટર…). */
export function NumberUnit({ label, unit, value, onChange, decimal, error }: {
  label: string
  unit?: string
  value: number | null | undefined
  onChange: (v: number | null) => void
  decimal?: boolean
  error?: string
}) {
  const id = useId()
  const [raw, setRaw] = useState(value == null ? '' : String(value))
  const [prev, setPrev] = useState(value)
  if (prev !== value) {
    setPrev(value)
    if (!(Number(raw) === value || (raw === '' && value == null))) setRaw(value == null ? '' : String(value))
  }
  return (
    <Field label={label} htmlFor={id} error={error}>
      <div className={`inp${error ? ' bad' : ''}`}>
        <input
          id={id}
          inputMode={decimal ? 'decimal' : 'numeric'}
          className="latin"
          value={raw}
          onChange={(e) => {
            const v = e.target.value.replace(',', '.')
            if (v !== '' && !(decimal ? /^\d*\.?\d*$/ : /^\d*$/).test(v)) return
            setRaw(v)
            onChange(v === '' || v === '.' ? null : Number(v))
          }}
        />
        {unit && <span className="unit">{unit}</span>}
      </div>
    </Field>
  )
}

/** toggle: the whole row is the tap target; on = indigo. */
export function ToggleRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="trow" onClick={() => onChange(!checked)}>
      <div>
        <div className="fl">{label}</div>
        {hint && <div className="hint">{hint}</div>}
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      className="sw"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
    >
      <span />
    </button>
  )
}

/** choice: chips, single select. */
export function Chips<V extends string>({ label, options, value, onChange, scroll }: {
  label?: string
  options: { value: V; label: string }[]
  value: V | null | undefined
  onChange: (v: V) => void
  scroll?: boolean
}) {
  const chips = (
    <div className={`chips${scroll ? ' scroll' : ''}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
  if (!label) return chips
  return (
    <div className="f">
      <span className="fl">{label}</span>
      {chips}
    </div>
  )
}

/** ref: picker listing items from another collection (native select so the phone's own picker opens). */
export function RefSelect({ label, hint, value, onChange, options, empty }: {
  label: ReactNode
  hint?: string
  value: string | null | undefined
  onChange: (v: string | null) => void
  options: { value: string; label: string; sub?: string }[]
  empty: string
}) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="inp">
        <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">{empty}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}{o.sub ? ` · ${o.sub}` : ''}
            </option>
          ))}
        </select>
        <ICaret />
      </div>
    </Field>
  )
}

/** Confirm before a delete; the copy promises 30 days in history. */
export function useConfirm() {
  const { t } = useAdmin()
  const [state, setState] = useState<{ title: string; resolve: (ok: boolean) => void } | null>(null)
  const ask = (what: string, fem = false) => new Promise<boolean>((resolve) => setState({ title: t.confirmDeleteTitle(what, fem), resolve }))
  const close = (ok: boolean) => {
    state?.resolve(ok)
    setState(null)
  }
  const dialog = state ? (
    <dialog
      className="confirm"
      ref={(el) => {
        if (el && !el.open) el.showModal()
      }}
      onCancel={(e) => {
        e.preventDefault()
        close(false)
      }}
      aria-labelledby="confirm-title"
    >
      <div className="in">
        <h3 id="confirm-title">{state.title}</h3>
        <p className="hint">{t.confirmDeleteBody}</p>
        <div className="acts">
          <button className="btn btn-ghost" onClick={() => close(false)}>{t.cancel}</button>
          <button className="btn btn-danger" onClick={() => close(true)}>{t.delete}</button>
        </div>
      </div>
    </dialog>
  ) : null
  return { ask, dialog }
}
