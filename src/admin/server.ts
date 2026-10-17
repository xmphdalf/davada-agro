import config from '@payload-config'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { AdminLang } from './strings'
import type { User } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

export const getAdminLang = async (): Promise<AdminLang> => {
  const v = (await cookies()).get('admin-lang')?.value
  return v === 'en' ? 'en' : 'gu'
}

/** The signed-in user for this request, or a redirect to the login page. */
export const requireUser = cache(async () => {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')
  return { payload, user: user as User }
})
