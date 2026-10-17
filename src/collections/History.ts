import type { CollectionConfig } from 'payload'

/**
 * “ફેરફારનો ઇતિહાસ”: one row per saved change, kept for 30 days.
 * Rows are written by the history hooks, never by hand.
 */
export const History: CollectionConfig = {
  slug: 'history',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'action', 'target', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'kind', type: 'select', options: ['collection', 'global'], required: true },
    { name: 'target', type: 'text', required: true, index: true },
    { name: 'docId', type: 'text', index: true },
    { name: 'action', type: 'select', options: ['create', 'update', 'delete', 'restore'], required: true },
    { name: 'title', type: 'text' },
    { name: 'changes', type: 'json' },
    { name: 'before', type: 'json' },
    { name: 'after', type: 'json' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'undone', type: 'checkbox', defaultValue: false },
  ],
}
