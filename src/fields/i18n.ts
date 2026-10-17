import type { GroupField } from 'payload'

export const LOCALES = ['gu', 'hi', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export type I18nText = { gu?: string | null; hi?: string | null; en?: string | null }

type Opts = {
  label: string
  multiline?: boolean
  /** Soft guide shown as a counter in the admin (“૩૨ / ૪૦”). The hard limit is twice this. */
  maxLength?: number
  /** Gujarati is the fallback language, so it is required unless stated otherwise. */
  required?: boolean
}

/**
 * A translated text field: one value per locale, stored as a group { gu, hi, en }.
 * An empty hi/en falls back to Gujarati on the site.
 */
export const i18nText = (name: string, { label, multiline, maxLength, required = true }: Opts): GroupField => ({
  name,
  label,
  type: 'group',
  custom: { guide: maxLength, multiline: Boolean(multiline) },
  fields: LOCALES.map((locale) => ({
    name: locale,
    label: locale === 'gu' ? 'ગુજરાતી' : locale === 'hi' ? 'हिंदी' : 'English',
    type: multiline ? 'textarea' : 'text',
    required: required && locale === 'gu',
    maxLength: maxLength ? maxLength * 2 : undefined,
  })) as GroupField['fields'],
})
