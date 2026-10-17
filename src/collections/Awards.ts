import type { CollectionConfig } from 'payload'

import { i18nText } from '../fields/i18n'
import { collectionHistory } from '../lib/history'

const signedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** “સિદ્ધિઓ”: the awards carousel on the home page. */
export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: { singular: 'સિદ્ધિ', plural: 'સિદ્ધિઓ' },
  trash: true,
  defaultSort: 'order',
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    afterChange: [collectionHistory((doc) => (doc.title as { gu?: string })?.gu || 'સિદ્ધિ')],
  },
  fields: [
    { name: 'order', type: 'number', defaultValue: 0, index: true, admin: { position: 'sidebar' } },
    { name: 'year', label: 'વર્ષ', type: 'number', required: true, min: 1950, max: 2100 },
    {
      name: 'icon',
      label: 'ચિહ્ન',
      type: 'select',
      required: true,
      defaultValue: 'trophy',
      options: [
        { value: 'trophy', label: 'ટ્રોફી' },
        { value: 'medal', label: 'મેડલ' },
        { value: 'cert', label: 'પ્રમાણપત્ર' },
      ],
    },
    i18nText('title', { label: 'સિદ્ધિ', maxLength: 60 }),
    i18nText('by', { label: 'કોના તરફથી', maxLength: 60 }),
  ],
}
