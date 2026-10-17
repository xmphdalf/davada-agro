'use server'

import config from '@payload-config'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getPayload, ValidationError } from 'payload'

import { stripRelations } from '@/lib/history'

export type ActionResult = { ok: true; id?: string; historyId?: string } | { ok: false; errors?: Record<string, string>; error?: string }

type CollectionSlug = 'products' | 'gallery' | 'awards' | 'reviews'
type GlobalSlug = 'home-text' | 'subsidy' | 'stats' | 'contact'

const COLLECTIONS: CollectionSlug[] = ['products', 'gallery', 'awards', 'reviews']
const GLOBALS: GlobalSlug[] = ['home-text', 'subsidy', 'stats', 'contact']

const session = async () => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) throw new Error('Not signed in')
  return { payload, user }
}

/** Every save changes the live site, so drop cached pages. */
const refresh = () => revalidatePath('/', 'layout')

const fail = (err: unknown): ActionResult => {
  if (err instanceof ValidationError) {
    const errors: Record<string, string> = {}
    for (const e of err.data.errors) errors[e.path] = e.message
    return { ok: false, errors }
  }
  const message = err instanceof Error ? err.message : String(err)
  // Unique model ID clash from Postgres
  if (/unique|duplicate/i.test(message)) return { ok: false, errors: { modelId: 'taken' } }
  console.error(err)
  return { ok: false, error: message }
}

/** The history row the last write created, so the toast can offer “પાછું લો”. */
const latestHistory = async (payload: Awaited<ReturnType<typeof session>>['payload'], target: string, docId?: string) => {
  const res = await payload.find({
    collection: 'history',
    where: docId ? { and: [{ target: { equals: target } }, { docId: { equals: docId } }] } : { target: { equals: target } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ? String(res.docs[0].id) : undefined
}

const nextOrder = async (payload: Awaited<ReturnType<typeof session>>['payload'], collection: CollectionSlug) => {
  const res = await payload.find({ collection, sort: '-order', limit: 1, depth: 0, trash: true })
  return ((res.docs[0] as { order?: number } | undefined)?.order ?? -1) + 1
}

/** Create (id = null) or update a document in one of the editable collections. */
export async function saveDoc(collection: CollectionSlug, id: string | null, data: Record<string, unknown>): Promise<ActionResult> {
  if (!COLLECTIONS.includes(collection)) return { ok: false, error: 'Unknown collection' }
  try {
    const { payload, user } = await session()
    const clean = { ...data }
    delete clean.id
    delete clean.createdAt
    delete clean.updatedAt
    delete clean.deletedAt
    const doc = id
      ? await payload.update({ collection, id, data: clean as never, user, overrideAccess: false, depth: 0 })
      : await payload.create({
          collection,
          data: { ...clean, order: await nextOrder(payload, collection) } as never,
          user,
          overrideAccess: false,
          depth: 0,
        })
    refresh()
    return { ok: true, id: String(doc.id), historyId: await latestHistory(payload, collection, String(doc.id)) }
  } catch (err) {
    return fail(err)
  }
}

/** Flip one switch from a list row (stock, best seller) without opening the form. */
export async function setFlag(id: string, field: 'stock' | 'best', value: boolean): Promise<ActionResult> {
  return saveDoc('products', id, { [field]: value })
}

/** Soft delete: the item moves to trash and can be restored from history for 30 days. */
export async function trashDoc(collection: CollectionSlug, id: string): Promise<ActionResult> {
  if (!COLLECTIONS.includes(collection)) return { ok: false, error: 'Unknown collection' }
  try {
    const { payload, user } = await session()
    await payload.update({
      collection,
      id,
      data: { deletedAt: new Date().toISOString() } as never,
      user,
      overrideAccess: false,
      depth: 0,
    })
    refresh()
    return { ok: true, historyId: await latestHistory(payload, collection, id) }
  } catch (err) {
    return fail(err)
  }
}

/** Saves a new order after drag-and-drop. Not recorded in history. */
export async function reorder(collection: CollectionSlug, ids: string[]): Promise<ActionResult> {
  if (!COLLECTIONS.includes(collection)) return { ok: false, error: 'Unknown collection' }
  try {
    const { payload, user } = await session()
    for (const [order, id] of ids.entries()) {
      await payload.update({
        collection,
        id,
        data: { order } as never,
        user,
        overrideAccess: false,
        depth: 0,
        context: { skipHistory: true },
      })
    }
    refresh()
    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}

export async function saveGlobal(slug: GlobalSlug, data: Record<string, unknown>): Promise<ActionResult> {
  if (!GLOBALS.includes(slug)) return { ok: false, error: 'Unknown page' }
  try {
    const { payload, user } = await session()
    const clean = { ...data }
    delete clean.id
    delete clean.createdAt
    delete clean.updatedAt
    delete clean.globalType
    await payload.updateGlobal({ slug, data: clean as never, user, overrideAccess: false, depth: 0 })
    refresh()
    return { ok: true, historyId: await latestHistory(payload, slug) }
  } catch (err) {
    return fail(err)
  }
}

/** Turns freshly uploaded media into gallery photos (the gallery is live as soon as a photo lands). */
export async function addGalleryPhotos(mediaIds: string[], cat: string): Promise<ActionResult> {
  try {
    const { payload, user } = await session()
    let order = await nextOrder(payload, 'gallery')
    for (const image of mediaIds) {
      await payload.create({
        collection: 'gallery',
        data: { kind: 'photo', image: Number(image), cat, order: order++ } as never,
        user,
        overrideAccess: false,
        depth: 0,
      })
    }
    refresh()
    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}

/** Reverts one history row: undo a create (trash it), an edit (write the old values back), a delete (restore). */
export async function undoChange(historyId: string): Promise<ActionResult> {
  try {
    const { payload } = await session()
    const h = await payload.findByID({ collection: 'history', id: historyId, depth: 0 })
    if (h.undone) return { ok: true }
    const ctx = { skipHistory: true }
    const before = (h.before || {}) as Record<string, unknown>

    if (h.kind === 'global') {
      const data = stripRelations(before)
      delete data.id
      await payload.updateGlobal({ slug: h.target as GlobalSlug, data: data as never, context: ctx, depth: 0 })
    } else {
      const collection = h.target as CollectionSlug
      const id = String(h.docId)
      const now = new Date().toISOString()
      const data =
        h.action === 'create' || h.action === 'restore'
          ? { deletedAt: now }
          : h.action === 'delete'
            ? { deletedAt: null }
            : (() => {
                const d = stripRelations(before)
                for (const k of ['id', 'createdAt', 'updatedAt', 'deletedAt', 'order']) delete d[k]
                return d
              })()
      await payload.update({ collection, id, data: data as never, trash: true, context: ctx, depth: 0 })
    }
    await payload.update({
      collection: 'history',
      id: historyId,
      data: { undone: true },
      overrideAccess: true,
      context: ctx,
    })
    refresh()
    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}

export async function changePassword(current: string, next: string): Promise<ActionResult> {
  try {
    const { payload, user } = await session()
    if (next.length < 8) return { ok: false, errors: { newPassword: 'short' } }
    try {
      await payload.login({ collection: 'users', data: { email: user.email, password: current } })
    } catch {
      return { ok: false, errors: { currentPassword: 'wrong' } }
    }
    await payload.update({ collection: 'users', id: user.id, data: { password: next }, user, overrideAccess: false })
    return { ok: true }
  } catch (err) {
    return fail(err)
  }
}

export async function setAdminLang(lang: 'gu' | 'en') {
  ;(await cookies()).set('admin-lang', lang === 'en' ? 'en' : 'gu', {
    path: '/admin',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
