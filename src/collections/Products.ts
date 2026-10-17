import type { CollectionConfig } from 'payload'

import { i18nText } from '../fields/i18n'
import { collectionHistory } from '../lib/history'

const signedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** “સનેડા”: the product catalogue shown on the home page and in the detail sheet (#p-ID). */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'સનેડો', plural: 'સનેડા' },
  trash: true,
  defaultSort: 'order',
  admin: {
    useAsTitle: 'modelId',
    defaultColumns: ['modelId', 'name', 'cat', 'price', 'stock'],
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    afterChange: [collectionHistory((doc) => (doc.name as { gu?: string })?.gu || String(doc.modelId))],
  },
  fields: [
    {
      name: 'modelId',
      label: 'મોડેલ ID',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'વૉટ્સઍપ મેસેજ અને લિંકમાં વપરાય છે, જેમ કે KS-10.' },
      validate: (v: string | null | undefined) =>
        /^[A-Z]{1,3}-\d{1,3}$/.test(v || '') || 'મોડેલ ID આ રીતે લખો: KS-10',
    },
    { name: 'order', type: 'number', defaultValue: 0, index: true, admin: { position: 'sidebar' } },
    {
      name: 'photos',
      label: 'ફોટા',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 6,
    },
    i18nText('name', { label: 'નામ', maxLength: 40 }),
    i18nText('desc', { label: 'ટૂંકું વર્ણન', multiline: true, maxLength: 120 }),
    {
      name: 'cat',
      label: 'વિભાગ',
      type: 'select',
      required: true,
      defaultValue: '3',
      options: [
        { value: '3', label: 'ત્રણ પૈડાં' },
        { value: '4', label: 'ચાર પૈડાં' },
        { value: 'impl', label: 'ઓજારો અને ટ્રોલી' },
      ],
    },
    { name: 'price', label: 'એક્સ-શોરૂમ કિંમત', type: 'number', min: 0 },
    { name: 'hidePrice', label: 'કિંમત છુપાવો', type: 'checkbox', defaultValue: false },
    { name: 'stock', label: 'સ્ટૉકમાં છે', type: 'checkbox', defaultValue: true },
    { name: 'best', label: 'સૌથી વધુ વેચાતો', type: 'checkbox', defaultValue: false },
    {
      name: 'specs',
      label: 'વિગતો',
      type: 'group',
      fields: [
        { name: 'hp', label: 'પાવર (HP)', type: 'number', min: 0 },
        { name: 'gearsFwd', label: 'ગિયર આગળ', type: 'number', min: 0 },
        { name: 'gearsRev', label: 'ગિયર રિવર્સ', type: 'number', min: 0 },
        { name: 'load', label: 'વહન ક્ષમતા (ટન)', type: 'number', min: 0 },
        { name: 'tank', label: 'ડીઝલ ટાંકી (લિટર)', type: 'number', min: 0 },
        {
          name: 'start',
          label: 'સ્ટાર્ટ',
          type: 'select',
          options: [
            { value: 'self', label: 'સેલ્ફ સ્ટાર્ટ' },
            { value: 'kick', label: 'કિક સ્ટાર્ટ' },
          ],
        },
        { name: 'width', label: 'કામની પહોળાઈ (ફૂટ)', type: 'number', min: 0 },
        { name: 'tipping', label: 'હાઇડ્રોલિક ટિપિંગ', type: 'checkbox' },
        { name: 'warranty', label: 'વૉરંટી (વર્ષ)', type: 'number', min: 0, defaultValue: 1 },
      ],
    },
  ],
}
