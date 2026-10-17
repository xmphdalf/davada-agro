import type { CollectionConfig } from 'payload'

import { i18nText } from '../fields/i18n'
import { collectionHistory } from '../lib/history'

const signedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** “ખેડૂતોના અભિપ્રાય”: testimonials on the home page. */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'અભિપ્રાય', plural: 'ખેડૂતોના અભિપ્રાય' },
  trash: true,
  defaultSort: 'order',
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    afterChange: [collectionHistory((doc) => (doc.name as { gu?: string })?.gu || 'અભિપ્રાય')],
  },
  fields: [
    { name: 'order', type: 'number', defaultValue: 0, index: true, admin: { position: 'sidebar' } },
    i18nText('quote', { label: 'અભિપ્રાય', multiline: true, maxLength: 200 }),
    i18nText('name', { label: 'ખેડૂતનું નામ', maxLength: 40 }),
    i18nText('village', { label: 'ગામ', maxLength: 30 }),
  ],
}
