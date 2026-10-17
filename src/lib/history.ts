import type { CollectionAfterChangeHook, GlobalAfterChangeHook, PayloadRequest } from 'payload'

/** Fields that never count as a change worth showing. */
const IGNORED = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt', 'globalType', '_status'])

/** Fields whose before/after values are stored so the admin can show “₹૧,૬૦,૦૦૦ → ₹૧,૬૫,૦૦૦”. */
const TRACKED_VALUES = new Set(['price', 'hidePrice', 'stock', 'best'])

export type Change = { field: string; from?: unknown; to?: unknown }

/** Relations come back populated in hooks; history stores plain ids so they can be written back. */
const stripValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripValue)
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    // A populated upload/relationship document
    if ('id' in o && ('filename' in o || 'modelId' in o || 'mimeType' in o)) return o.id
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, stripValue(v)]))
  }
  return value
}

/** A document with every populated relation inside it replaced by its id (the document itself is kept). */
export const stripRelations = (doc: unknown): Record<string, unknown> =>
  Object.fromEntries(Object.entries((doc as Record<string, unknown>) ?? {}).map(([k, v]) => [k, stripValue(v)]))

/** Empty, false and missing all mean “off/blank”, so they don't count as a change. */
const blank = (v: unknown): unknown => {
  if (v === undefined || v === null || v === '' || v === false) return null
  if (Array.isArray(v)) return v.length ? v.map(blank) : null
  if (typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>)
      .filter(([k]) => k !== 'id')
      .map(([k, x]) => [k, blank(x)] as const)
      .filter(([, x]) => x !== null)
    return entries.length ? Object.fromEntries(entries) : null
  }
  return v
}

export const diff = (before: Record<string, unknown> | undefined, after: Record<string, unknown>): Change[] => {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after)])
  const changes: Change[] = []
  for (const field of keys) {
    if (IGNORED.has(field)) continue
    const from = before?.[field]
    const to = after[field]
    if (JSON.stringify(blank(stripValue(from))) === JSON.stringify(blank(stripValue(to)))) continue
    changes.push(TRACKED_VALUES.has(field) ? { field, from, to } : { field })
  }
  return changes
}

const clean = (doc: Record<string, unknown>) => {
  const out = stripRelations(doc)
  for (const k of ['createdAt', 'updatedAt', 'globalType']) delete out[k]
  return out
}

type Write = {
  req: PayloadRequest
  target: string
  kind: 'collection' | 'global'
  docId?: string
  action: 'create' | 'update' | 'delete' | 'restore'
  title: string
  changes: Change[]
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

const record = async ({ req, ...data }: Write) => {
  await req.payload.create({
    collection: 'history',
    req,
    overrideAccess: true,
    context: { skipHistory: true },
    data: {
      ...data,
      before: data.before ? clean(data.before) : null,
      after: data.after ? clean(data.after) : null,
      user: req.user?.id ?? null,
    },
  })
}

/** Records every create, edit, trash and restore of a collection so it can be undone later. */
export const collectionHistory =
  (titleOf: (doc: Record<string, unknown>) => string): CollectionAfterChangeHook =>
  async ({ collection, doc, previousDoc, operation, req, context }) => {
    if (context?.skipHistory) return doc
    const wasTrashed = Boolean(previousDoc?.deletedAt)
    const isTrashed = Boolean(doc.deletedAt)
    let action: Write['action'] = operation
    if (operation === 'update' && !wasTrashed && isTrashed) action = 'delete'
    if (operation === 'update' && wasTrashed && !isTrashed) action = 'restore'

    const changes = operation === 'create' ? [] : diff(previousDoc, doc)
    if (action === 'update' && changes.length === 0) return doc

    await record({
      req,
      kind: 'collection',
      target: collection.slug,
      docId: String(doc.id),
      action,
      title: titleOf(doc),
      changes,
      before: operation === 'create' ? undefined : previousDoc,
      after: doc,
    })
    return doc
  }

export const globalHistory =
  (title: string): GlobalAfterChangeHook =>
  async ({ global, doc, previousDoc, req, context }) => {
    if (context?.skipHistory) return doc
    const changes = diff(previousDoc, doc)
    if (changes.length === 0) return doc
    await record({
      req,
      kind: 'global',
      target: global.slug,
      action: 'update',
      title,
      changes,
      before: previousDoc,
      after: doc,
    })
    return doc
  }
