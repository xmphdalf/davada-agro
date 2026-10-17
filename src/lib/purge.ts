import type { Payload } from 'payload'

const DAY = 24 * 60 * 60 * 1000
export const KEEP_DAYS = 30
let lastRun = 0

/** Deletes trashed items and history rows older than 30 days. Runs at most once an hour per server. */
export const purgeOld = async (payload: Payload) => {
  if (Date.now() - lastRun < 60 * 60 * 1000) return
  lastRun = Date.now()
  const cutoff = new Date(Date.now() - KEEP_DAYS * DAY).toISOString()
  try {
    for (const collection of ['products', 'gallery', 'awards', 'reviews'] as const) {
      await payload.delete({
        collection,
        trash: true,
        where: { deletedAt: { less_than: cutoff } },
        context: { skipHistory: true },
      })
    }
    await payload.delete({ collection: 'history', where: { createdAt: { less_than: cutoff } } })
  } catch (err) {
    payload.logger.error({ err }, 'Purging old history failed')
  }
}
