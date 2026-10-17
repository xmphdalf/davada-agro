import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getAdminLang, getPayloadClient } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { Mark } from '@/admin/ui/icons'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (user) redirect('/admin')
  const lang = await getAdminLang()
  const t = getStrings(lang)
  return (
    <div className="login">
      <div className="band">
        <Mark size={44} ground="#10142C" />
        <div>
          <h1>{t.brand}</h1>
          <p>{t.websiteAdmin}</p>
        </div>
      </div>
      <LoginForm lang={lang} />
    </div>
  )
}
