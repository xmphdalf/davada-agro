'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { money as fmtMoney, num as fmtNum } from '@/lib/format'
import type { L, SiteData, SiteProduct } from './data'
import { SITE_LANGS, T, type SiteLang, type SiteStrings } from './strings'

/* ===== Language ===== */

type Ctx = {
  lang: SiteLang
  setLang: (l: SiteLang) => void
  t: SiteStrings
  /** Text in the current language, falling back to Gujarati. */
  pick: (v: L | null | undefined) => string
  num: (v: string | number) => string
  money: (p: number | null) => string | null
}

const LangCtx = createContext<Ctx | null>(null)
export const useSite = () => {
  const c = useContext(LangCtx)
  if (!c) throw new Error('useSite outside LangProvider')
  return c
}

/** Gujarati by default; ?lang= or the last choice (localStorage “de-lang”) wins, as in the prototype. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>('gu')
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get('lang')
      const s = localStorage.getItem('de-lang')
      const found = [q, s].find((v) => v && SITE_LANGS.includes(v as SiteLang)) as SiteLang | undefined
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the saved choice is only readable after hydration
      if (found) setLangState(found)
    } catch {}
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = (l: SiteLang) => {
    setLangState(l)
    try {
      localStorage.setItem('de-lang', l)
    } catch {}
  }
  const t = T[lang]
  const value: Ctx = {
    lang,
    setLang,
    t,
    pick: (v) => (v?.[lang] || v?.gu || '').trim(),
    num: (v) => fmtNum(v, lang),
    money: (p) => fmtMoney(p, lang),
  }
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

/* ===== Helpers ported from the prototype ===== */

export const waURL = (text: string, to = '') => `https://wa.me/${to}?text=${encodeURIComponent(text)}`
export const productLink = (d: SiteData, p: SiteProduct) => `${d.site}/#p-${p.id}`

export function useProductText(d: SiteData) {
  const { t, pick, num, money } = useSite()
  const fullName = (p: SiteProduct) => (p.specs.hp ? `${pick(p.name)} ${num(p.specs.hp)}` : pick(p.name))
  const specs = (p: SiteProduct): [string, string][] => {
    const s = p.specs
    const rows: [string, string][] = []
    if (p.cat !== 'impl') {
      rows.push(
        [t.specPower, `${num(s.hp ?? '')} HP`],
        [t.specGears, num(t.gears(s.gearsFwd ?? '', s.gearsRev ?? ''))],
        [t.specLoad, `${num(s.load ?? '')} ${t.ton}`],
        [t.specTank, `${num(s.tank ?? '')} ${t.litre}`],
        [t.specStart, s.start === 'kick' ? t.kick : t.self],
        [t.specWarranty, `${num(s.warranty ?? '')} ${t.year}`],
      )
    } else {
      if (s.load) rows.push([t.specLoad, `${num(s.load)} ${t.ton}`])
      if (s.width) rows.push([t.specWidth, `${num(s.width)} ${t.feet}`])
      if (s.tipping) rows.push([t.specTipping, t.hydraulic])
      rows.push([t.specFits, t.fitsAll], [t.specWarranty, `${num(s.warranty ?? '')} ${t.year}`])
      if (rows.length % 2) rows.push(['', ''])
    }
    return rows
  }
  const enquireLink = (p: SiteProduct) =>
    waURL(t.waProduct(fullName(p), p.id, money(p.price) || t.askPrice, productLink(d, p)), '91' + d.whatsapp)
  return { fullName, specs, enquireLink }
}

/* ===== Icons ===== */

export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
  </svg>
)
export const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3z" />
  </svg>
)
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const PhotoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17l5-4.5 3.5 3 3-2.5L20 17" />
  </svg>
)
const Mark = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill="#19203F" />
    <path d="M13 32c0-7 3-13 6-17h2c3 4 6 10 6 17z" fill="#E07B16" />
    <ellipse cx="20" cy="14.5" rx="3" ry="1.2" fill="#E07B16" />
    <path d="M20 13V6l6 1.6L20 9" fill="#F4A94E" stroke="#F4A94E" strokeWidth=".6" />
  </svg>
)

/* ===== Light / dark ===== */

/** Sun/moon button in the header. It flips whatever is showing now and remembers the choice. */
function ThemeToggle() {
  const { t } = useSite()
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const read = () => {
      const set = document.documentElement.dataset.theme
      setDark(set ? set === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)
    }
    read()
    const mq = matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  const flip = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('de-theme', next)
    } catch {}
    setDark(!dark)
  }
  return (
    <button className="themebtn" onClick={flip} aria-label={dark ? t.toLight : t.toDark} title={dark ? t.toLight : t.toDark}>
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  )
}

/* ===== Shared chrome ===== */

/** Header: brand, nav (≥900px), language picker, call button. `home` is '' on the home page, '/' elsewhere. */
export function Header({ d, home = '', current }: { d: SiteData; home?: string; current?: 'gallery' }) {
  const { t, lang, setLang } = useSite()
  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href={home || '#top'} aria-label={t.brandName}>
          <Mark />
          <span>
            <b>{t.brandName}</b>
            <small>{t.brandPlace}</small>
          </span>
        </a>
        <nav className="nav">
          <a href={`${home}#sanedo`}>{t.navProducts}</a>
          <a href={`${home}#sahay`}>{t.navSubsidy}</a>
          <a href={`${home}#siddhi`}>{t.navAwards}</a>
          {d.gallery.length > 0 && (
            <a href="/gallery" aria-current={current === 'gallery' ? 'page' : undefined}>{t.navGallery}</a>
          )}
          <a href={`${home}#sampark`}>{t.navContact}</a>
        </nav>
        <label className="lang">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
          </svg>
          <select aria-label="ભાષા / भाषा / Language" value={lang} onChange={(e) => setLang(e.target.value as SiteLang)}>
            <option value="gu" lang="gu">ગુજરાતી</option>
            <option value="hi" lang="hi">हिंदी</option>
            <option value="en" lang="en">English</option>
          </select>
        </label>
        <ThemeToggle />
        <a className="callbtn" href={`tel:+91${d.phone}`} aria-label={t.call}>
          <PhoneIcon />
          <span>{t.call}</span>
        </a>
      </div>
    </header>
  )
}

/** Mobile call + WhatsApp bar (hidden ≥900px). */
export function Dock({ d, show }: { d: SiteData; show: boolean }) {
  const { t, lang } = useSite()
  return (
    <div className={`dock${show ? ' show' : ''}`} id="dock">
      <a className="btn btn-ghost" href={`tel:+91${d.phone}`}>
        <PhoneIcon />
        <span>{t.call}</span>
      </a>
      <a className="btn btn-wa" href={waURL(T[lang].wa.general, '91' + d.whatsapp)} target="_blank" rel="noopener">
        <WaIcon />
        <span>{t.askWa}</span>
      </a>
    </div>
  )
}

export function Footer() {
  const { t } = useSite()
  return (
    <footer>
      <div className="wrap">{t.footer}</div>
    </footer>
  )
}
