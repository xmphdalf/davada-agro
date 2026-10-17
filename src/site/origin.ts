import { headers } from 'next/headers'

/** The address this request came in on (Railway sets x-forwarded-*), e.g. https://web-production-bb891.up.railway.app */
export async function requestOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || ''
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
  return host ? `${proto}://${host}` : ''
}
