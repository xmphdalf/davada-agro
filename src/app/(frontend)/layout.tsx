import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@/site/site.css'
import { THEME_SCRIPT } from '@/site/theme'

export const metadata: Metadata = {
  title: 'દવડા ઍગ્રો ઇન્ડસ્ટ્રીઝ – ચિતલ, અમરેલી',
  description: 'ચિતલથી સૌરાષ્ટ્રના ખેડૂતો માટે મજબૂત અને ટકાઉ સનેડા. વૉટ્સઍપ પર સીધી પૂછપરછ કરો.',
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  openGraph: { images: ['/temple.webp'], locale: 'gu_IN', type: 'website' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#19203F',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="gu" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anek+Gujarati:wdth,wght@75..125,500..800&family=Anek+Devanagari:wdth,wght@75..125,500..800&family=Anek+Latin:wdth,wght@75..125,500..800&family=Hind+Vadodara:wght@400;500;600&family=Hind:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
