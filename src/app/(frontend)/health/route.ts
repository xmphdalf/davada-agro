import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Railway health check. Starting Payload here runs pending migrations and the first-boot seed
 * before the deploy goes live, and a database problem fails the deploy instead of serving errors.
 */
export const dynamic = 'force-dynamic'

export const GET = async () => {
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users', overrideAccess: true })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('Health check failed', err)
    return Response.json({ ok: false }, { status: 503 })
  }
}
