export type MediaRef = { id: string; url: string; thumb: string }

type MediaDoc = { id: number | string; url?: string | null; sizes?: { sm?: { url?: string | null } | null; md?: { url?: string | null } | null } | null }

/** The bits of a Payload media document the admin needs: id plus card and thumbnail URLs. */
export const toRef = (doc: MediaDoc): MediaRef => ({
  id: String(doc.id),
  url: doc.sizes?.md?.url || doc.url || '',
  thumb: doc.sizes?.sm?.url || doc.url || '',
})
