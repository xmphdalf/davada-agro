'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getStrings, type AdminLang } from '@/admin/strings'
import { IAlert, IEye } from '@/admin/ui/icons'

export function LoginForm({ lang }: { lang: AdminLang }) {
  const t = getStrings(lang)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (res.ok) {
        router.replace('/admin')
        router.refresh()
        return
      }
      const body = await res.json().catch(() => ({}))
      const locked = JSON.stringify(body).toLowerCase().includes('lock')
      setError(locked ? t.loginLocked : t.loginFailed)
    } catch {
      setError(t.offline)
    }
    setBusy(false)
  }

  return (
    <main>
      <h2>{t.loginTitle}</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
        <div className="f">
          <label className="fl" htmlFor="email">{t.email}</label>
          <div className={`inp${error ? ' bad' : ''}`}>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              className="latin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="f">
          <label className="fl" htmlFor="password">{t.password}</label>
          <div className={`inp${error ? ' bad' : ''}`}>
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              className="latin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="iconbtn"
              style={{ marginRight: -10, color: show ? 'var(--night)' : 'var(--muted)' }}
              aria-label={show ? t.hidePassword : t.showPassword}
              aria-pressed={show}
              onClick={() => setShow(!show)}
            >
              <IEye />
            </button>
          </div>
          {error && <span className="err" role="alert"><IAlert />{error}</span>}
        </div>
        <button className="btn btn-kesar btn-lg" type="submit" disabled={busy || !email || !password} style={{ marginTop: 4 }}>
          {busy ? t.loggingIn : t.login}
        </button>
      </form>
      <p className="hint note">{t.loginNote}</p>
    </main>
  )
}
