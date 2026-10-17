/** Formatting shared by the site and the admin. Gujarati numerals for display; inputs stay 0–9. */

const GU_DIGITS = '૦૧૨૩૪૫૬૭૮૯'

export const toGu = (v: string | number) => String(v).replace(/[0-9]/g, (d) => GU_DIGITS[Number(d)])

/** Numbers in the given language's numerals (Gujarati only for `gu`). */
export const num = (v: string | number, lang: string) => (lang === 'gu' ? toGu(v) : String(v))

/** Indian grouping, e.g. ₹૧,૬૫,૦૦૦ */
export const money = (p: number | null | undefined, lang: string) =>
  p == null ? null : num('₹' + new Intl.NumberFormat('en-IN').format(p), lang)

type Named = { name?: { gu?: string | null; hi?: string | null; en?: string | null } | null; specs?: { hp?: number | null } | null }

/** Text in the requested locale, falling back to Gujarati. */
export const pick = (v: { gu?: string | null; hi?: string | null; en?: string | null } | null | undefined, locale: string) =>
  (v?.[locale as 'gu'] || v?.gu || '').trim()

/** Product name with HP appended, as on the site: “દવડા શક્તિ ૧૦”. */
export const productName = (p: Named, locale: string) => {
  const name = pick(p.name, locale)
  return p.specs?.hp ? `${name} ${num(p.specs.hp, locale)}` : name
}

/** Display a 10-digit Indian mobile number as “+91 98765 43210” (always Latin digits). */
export const phoneDisplay = (n: string | null | undefined) =>
  n ? `+91 ${n.slice(0, 5)} ${n.slice(5)}` : ''

/** Accepts any YouTube URL form (watch, youtu.be, shorts, embed) or a bare id. */
export const youtubeId = (input: string) => {
  const s = input.trim()
  if (/^[\w-]{11}$/.test(s)) return s
  const m = s.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/)
  return m ? m[1] : null
}
