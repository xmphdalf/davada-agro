import type { CollectionConfig } from 'payload'

import { i18nText } from '../fields/i18n'
import { collectionHistory } from '../lib/history'

const signedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const GALLERY_CATS = ['sanedo', 'impl', 'delivery', 'workshop', 'honours'] as const

/** “ગેલેરી”: photos and YouTube videos on the gallery page (#g-N). */
export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'ફોટો', plural: 'ગેલેરી' },
  trash: true,
  defaultSort: 'order',
  admin: { defaultColumns: ['kind', 'cat', 'caption', 'product'] },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    afterChange: [
      collectionHistory((doc) => (doc.caption as { gu?: string })?.gu || (doc.kind === 'video' ? 'વિડિયો' : 'ફોટો')),
    ],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'photo',
      options: [
        { value: 'photo', label: 'ફોટો' },
        { value: 'video', label: 'વિડિયો' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, index: true, admin: { position: 'sidebar' } },
    {
      name: 'image',
      label: 'ફોટો',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.kind !== 'video' },
    },
    {
      name: 'youtube',
      label: 'YouTube વિડિયો ID',
      type: 'text',
      admin: { condition: (data) => data?.kind === 'video' },
      validate: (v: string | null | undefined, { siblingData }: { siblingData: { kind?: string } }) =>
        siblingData?.kind !== 'video' || /^[\w-]{11}$/.test(v || '') || 'YouTube લિંક સાચી નથી',
    },
    {
      name: 'cat',
      label: 'વિભાગ',
      type: 'select',
      required: true,
      defaultValue: 'delivery',
      options: [
        { value: 'sanedo', label: 'સનેડા' },
        { value: 'impl', label: 'ટ્રોલી અને ઓજારો' },
        { value: 'delivery', label: 'ડિલિવરી' },
        { value: 'workshop', label: 'વર્કશૉપ' },
        { value: 'honours', label: 'સન્માન' },
      ],
    },
    // Captions are optional: a fresh upload has none until the owner writes one.
    i18nText('caption', { label: 'કૅપ્શન', maxLength: 80, required: false }),
    {
      name: 'product',
      label: 'ફોટામાં કયું મોડેલ છે?',
      type: 'relationship',
      relationTo: 'products',
    },
  ],
}
