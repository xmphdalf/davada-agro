import type { ReactNode } from 'react'

export const metadata = {
  title: 'દવડા ઍગ્રો ઇન્ડસ્ટ્રીઝ – ચિતલ, અમરેલી',
  description: 'ચિતલથી સૌરાષ્ટ્રના ખેડૂતો માટે મજબૂત અને ટકાઉ સનેડા.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="gu">
      <body style={{ margin: 0, fontFamily: '"Hind Vadodara", system-ui, sans-serif', background: '#19203F', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
