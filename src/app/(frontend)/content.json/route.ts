import { loadSite } from '@/site/data'
import { requestOrigin } from '@/site/origin'

/** The site's full content as one JSON file (also handy as a quick backup). */
export const dynamic = 'force-dynamic'

export const GET = async () => Response.json(await loadSite(await requestOrigin()))
