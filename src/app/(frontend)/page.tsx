import { HomePage } from '@/site/Home'
import { loadSite } from '@/site/data'
import { requestOrigin } from '@/site/origin'

// Content changes in the admin show up at once (saves call revalidatePath).
export const dynamic = 'force-dynamic'

export default async function Page() {
  return <HomePage d={await loadSite(await requestOrigin())} />
}
