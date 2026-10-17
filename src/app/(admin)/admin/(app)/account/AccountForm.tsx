'use client'

import { useState } from 'react'

import { changePassword } from '@/admin/actions'
import { useAdmin } from '@/admin/ui/AdminContext'
import { TextInput } from '@/admin/ui/form'
import { PageHeader } from '@/admin/ui/Shell'

/** There is no reset email yet, so the owner changes his own password here. */
export function AccountForm() {
  const { t, toast } = useAdmin()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (next.length < 8) return setErrors({ newPassword: t.passwordShort })
    setBusy(true)
    const res = await changePassword(current, next)
    setBusy(false)
    if (res.ok) {
      setCurrent('')
      setNext('')
      setErrors({})
      toast(t.passwordChanged)
    } else if (res.errors?.currentPassword) setErrors({ currentPassword: t.passwordWrong })
    else if (res.errors?.newPassword) setErrors({ newPassword: t.passwordShort })
    else toast(t.saveFailed)
  }

  return (
    <>
      <PageHeader title={t.account} back="/admin/more" />
      <form className="page" style={{ maxWidth: 520 }} onSubmit={submit}>
        <section className="card pad">
          <TextInput label={t.currentPassword} type="password" value={current} onChange={setCurrent} autoComplete="current-password" latin error={errors.currentPassword} />
          <TextInput label={t.newPassword} type="password" value={next} onChange={setNext} autoComplete="new-password" latin hint={t.newPasswordHint} error={errors.newPassword} />
          <button className="btn btn-kesar btn-lg" type="submit" disabled={busy || !current || !next}>
            {busy ? t.saving : t.save}
          </button>
        </section>
      </form>
    </>
  )
}
