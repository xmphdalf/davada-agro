import type { GlobalConfig } from 'payload'

import { i18nText } from '../fields/i18n'
import { globalHistory } from '../lib/history'

const signedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)
const access = { read: signedIn, update: signedIn }

/** “હોમ પેજ લખાણ”: the hero at the top of the home page. */
export const HomeText: GlobalConfig = {
  slug: 'home-text',
  label: 'હોમ પેજ લખાણ',
  access,
  hooks: { afterChange: [globalHistory('હોમ પેજ લખાણ')] },
  fields: [
    i18nText('blessing', { label: 'આશીર્વાદ લીટી', maxLength: 40 }),
    i18nText('heroTitle', { label: 'મુખ્ય હેડિંગ', maxLength: 40 }),
    i18nText('heroSub', { label: 'પેટા લખાણ', multiline: true, maxLength: 120 }),
    { name: 'templePhoto', label: 'મંદિરનો ફોટો', type: 'upload', relationTo: 'media' },
  ],
}

/** “સરકારી સહાય”: the subsidy panel. */
export const Subsidy: GlobalConfig = {
  slug: 'subsidy',
  label: 'સરકારી સહાય',
  access,
  hooks: { afterChange: [globalHistory('સરકારી સહાય')] },
  fields: [
    i18nText('title', { label: 'હેડિંગ', maxLength: 60 }),
    i18nText('body', { label: 'વિગત', multiline: true, maxLength: 260 }),
    i18nText('note', { label: 'નોંધ', multiline: true, maxLength: 200 }),
    {
      name: 'steps',
      label: 'પગલાં',
      type: 'array',
      maxRows: 6,
      fields: [i18nText('text', { label: 'પગલું', maxLength: 80 })],
    },
    i18nText('help', { label: 'મદદનું લખાણ', multiline: true, maxLength: 140 }),
  ],
}

/** “આંકડા”: the four numbers in the band under the hero. */
export const Stats: GlobalConfig = {
  slug: 'stats',
  label: 'આંકડા',
  access,
  hooks: { afterChange: [globalHistory('આંકડા')] },
  fields: [
    {
      name: 'items',
      label: 'આંકડા',
      type: 'array',
      maxRows: 4,
      fields: [
        // Typed with 0–9 (e.g. “3,200+”); the site shows Gujarati numerals.
        { name: 'value', label: 'આંકડો', type: 'text', required: true, maxLength: 10 },
        i18nText('label', { label: 'લખાણ', maxLength: 30 }),
      ],
    },
  ],
}

/** “સંપર્ક અને સમય”: phone, WhatsApp, address and opening hours. */
export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'સંપર્ક અને સમય',
  access,
  hooks: { afterChange: [globalHistory('સંપર્ક અને સમય')] },
  fields: [
    {
      name: 'phone',
      label: 'ફોન નંબર',
      type: 'text',
      required: true,
      validate: (v: string | null | undefined) => /^\d{10}$/.test(v || '') || '૧૦ આંકડાનો મોબાઇલ નંબર લખો',
    },
    {
      name: 'whatsapp',
      label: 'વૉટ્સઍપ નંબર',
      type: 'text',
      required: true,
      validate: (v: string | null | undefined) => /^\d{10}$/.test(v || '') || '૧૦ આંકડાનો મોબાઇલ નંબર લખો',
    },
    i18nText('address', { label: 'સરનામું', multiline: true, maxLength: 140 }),
    i18nText('hours', { label: 'સમય', maxLength: 60 }),
    i18nText('closed', { label: 'રજાનો દિવસ', maxLength: 40 }),
    { name: 'mapsUrl', label: 'Google Maps લિંક', type: 'text' },
  ],
}

export const globals = [HomeText, Subsidy, Stats, Contact]
