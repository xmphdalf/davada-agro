import type { ReactNode } from 'react'

import { getAdminLang, requireUser } from '@/admin/server'
import { purgeOld } from '@/lib/purge'
import { AdminProvider } from '@/admin/ui/AdminContext'
import { Sidebar, TabBar } from '@/admin/ui/Shell'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { payload, user } = await requireUser()
  const lang = await getAdminLang()
  void purgeOld(payload)
  return (
    <AdminProvider lang={lang}>
      <div className="shell">
        <Sidebar name={user.name || user.email} email={user.email} />
        <div className="main">{children}</div>
      </div>
      <TabBar />
    </AdminProvider>
  )
}
