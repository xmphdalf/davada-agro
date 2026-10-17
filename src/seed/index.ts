import type { Payload } from 'payload'

import * as data from './data'

const ctx = { skipHistory: true }

/** Fills an empty database with the prototype content and creates the first admin from env vars. */
export const seed = async (payload: Payload) => {
  const { totalDocs: users } = await payload.count({ collection: 'users' })
  if (users === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await payload.create({
      collection: 'users',
      data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: process.env.ADMIN_NAME || 'પ્રતીકભાઈ' },
    })
    payload.logger.info(`Created admin user ${process.env.ADMIN_EMAIL}`)
  }

  const { totalDocs: products } = await payload.count({ collection: 'products', trash: true })
  if (products > 0) return

  payload.logger.info('Seeding prototype content…')
  for (const [order, p] of data.products.entries()) {
    await payload.create({ collection: 'products', data: { ...p, order } as never, context: ctx })
  }
  for (const [order, a] of data.awards.entries()) {
    await payload.create({ collection: 'awards', data: { ...a, order } as never, context: ctx })
  }
  for (const [order, r] of data.reviews.entries()) {
    await payload.create({ collection: 'reviews', data: { ...r, order } as never, context: ctx })
  }
  await payload.updateGlobal({ slug: 'home-text', data: data.homeText, context: ctx })
  await payload.updateGlobal({ slug: 'subsidy', data: data.subsidy, context: ctx })
  await payload.updateGlobal({ slug: 'stats', data: data.stats, context: ctx })
  await payload.updateGlobal({ slug: 'contact', data: data.contact, context: ctx })
}
