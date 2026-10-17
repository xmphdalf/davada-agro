import type { Metadata } from 'next'

import { GalleryPage } from '@/site/Gallery'
import { loadSite } from '@/site/data'
import { requestOrigin } from '@/site/origin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ફોટો ગેલેરી – દવડા ઍગ્રો ઇન્ડસ્ટ્રીઝ',
  description: 'વર્કશૉપથી ખેતર સુધી: અમારા સનેડા, ગામેગામ ડિલિવરી અને સન્માનની ઝલક.',
}

export default async function Page() {
  return <GalleryPage d={await loadSite(await requestOrigin())} />
}
