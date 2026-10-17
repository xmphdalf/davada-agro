'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition, type ReactNode } from 'react'

import { setAdminLang } from '../actions'
import { useAdmin } from './AdminContext'
import { IBack, IClock, IExternal, IGallery, IHome, IMore, ISanedo, Mark } from './icons'

const TAB_ROUTES = ['/admin', '/admin/products', '/admin/gallery', '/admin/more', '/admin/history', '/admin/awards', '/admin/reviews']

const isActive = (path: string, href: string) => (href === '/admin' ? path === '/admin' : path === href || path.startsWith(href + '/'))

/** Phone: four tabs at the bottom. Hidden on edit screens, where the save bar takes its place. */
export function TabBar() {
  const { t } = useAdmin()
  const path = usePathname()
  if (!TAB_ROUTES.includes(path)) return null
  const more = ['/admin/more', '/admin/history', '/admin/awards', '/admin/reviews'].includes(path)
  const tabs = [
    { href: '/admin', label: t.navHome, icon: <IHome />, on: path === '/admin' },
    { href: '/admin/products', label: t.navProducts, icon: <ISanedo />, on: path === '/admin/products' },
    { href: '/admin/gallery', label: t.navGallery, icon: <IGallery />, on: path === '/admin/gallery' },
    { href: '/admin/more', label: t.navMore, icon: <IMore />, on: more },
  ]
  return (
    <nav className="tabbar" aria-label={t.admin}>
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={tab.on ? 'page' : undefined}>
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

/** Desktop: indigo sidebar with the same sections. */
export function Sidebar({ name, email }: { name: string; email: string }) {
  const { t } = useAdmin()
  const path = usePathname()
  const a = (href: string, label: string, icon?: ReactNode) => (
    <Link href={href} aria-current={isActive(path, href) ? 'page' : undefined}>
      {icon}
      {label}
    </Link>
  )
  return (
    <aside className="side">
      <div className="brand">
        <Mark size={34} />
        <div>
          <b>{t.brandShort}</b>
          <span>{t.websiteAdmin}</span>
        </div>
      </div>
      <nav aria-label={t.admin}>
        {a('/admin', t.navHome, <IHome size={20} />)}
        {a('/admin/products', t.navProducts, <ISanedo size={20} />)}
        {a('/admin/gallery', t.navGallery, <IGallery size={20} />)}
        <span className="grp">{t.websiteText}</span>
        {a('/admin/pages/home-text', t.pageHome)}
        {a('/admin/pages/subsidy', t.pageSubsidy)}
        {a('/admin/pages/stats', t.pageStats)}
        {a('/admin/awards', t.pageAwards)}
        {a('/admin/reviews', t.pageReviews)}
        {a('/admin/pages/contact', t.pageContact)}
        <span className="grp" />
        {a('/admin/history', t.history, <IClock size={20} />)}
        {a('/admin/account', t.account)}
      </nav>
      <div className="me">
        <b style={{ fontWeight: 600 }}>{name}</b>
        <span>{email}</span>
        <LogoutButton />
      </div>
    </aside>
  )
}

export function LogoutButton({ className }: { className?: string }) {
  const { t } = useAdmin()
  const router = useRouter()
  return (
    <button
      className={className}
      onClick={async () => {
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
        router.replace('/admin/login')
        router.refresh()
      }}
    >
      {t.logout}
    </button>
  )
}

export function AdminLangSwitch() {
  const { t, lang } = useAdmin()
  const router = useRouter()
  const [pending, start] = useTransition()
  const pick = (l: 'gu' | 'en') =>
    start(async () => {
      await setAdminLang(l)
      router.refresh()
    })
  return (
    <div className="seg" role="group" aria-label={t.adminLanguage} style={{ opacity: pending ? 0.6 : 1 }}>
      <button type="button" aria-pressed={lang === 'gu'} onClick={() => pick('gu')}>ગુજરાતી</button>
      <button type="button" aria-pressed={lang === 'en'} lang="en" onClick={() => pick('en')}>English</button>
    </div>
  )
}

/** Top bar: back arrow on sub-pages; on desktop also the admin language and “સાઇટ જુઓ”. */
export function PageHeader({ title, count, back, right, siteLink = true }: {
  title: ReactNode
  count?: string
  back?: string
  right?: ReactNode
  siteLink?: boolean
}) {
  const { t } = useAdmin()
  return (
    <header className={`top${back ? ' has-back' : ''}`}>
      {back ? (
        <Link href={back} className="iconbtn" aria-label={t.back}>
          <IBack />
        </Link>
      ) : (
        <span className="top-mark mob-only">
          <Mark size={28} flag={false} />
        </span>
      )}
      <h1 className="ellipsis">
        {title}
        {count != null && <span className="hint count"> · {count}</span>}
      </h1>
      {right}
      <span className="desk-only">
        <AdminLangSwitch />
      </span>
      {siteLink && (
        <>
          <a className="btn btn-ghost desk-only" href="/" target="_blank" rel="noopener">
            {t.viewSite}
            <IExternal />
          </a>
          {!back && !right && (
            <a className="site-link mob-only" href="/" target="_blank" rel="noopener">
              {t.viewSite}
              <IExternal />
            </a>
          )}
        </>
      )}
    </header>
  )
}
