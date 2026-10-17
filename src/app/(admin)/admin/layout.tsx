import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@/admin/admin.css'
import { getAdminLang } from '@/admin/server'

export const metadata: Metadata = {
  title: { default: 'ઍડમિન · દવડા ઍગ્રો', template: '%s · દવડા ઍગ્રો ઍડમિન' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#19203F',
}

export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const lang = await getAdminLang()
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anek+Gujarati:wdth,wght@75..125,500..800&family=Anek+Latin:wdth,wght@75..125,500..800&family=Hind+Vadodara:wght@400;500;600;700&family=Hind:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="adm">{children}</body>
    </html>
  )
}
