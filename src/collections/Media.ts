import path from 'path'
import type { CollectionConfig } from 'payload'

const webp = { format: 'webp' as const, options: { quality: 78 } }

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: {
    // On Railway this points at the mounted volume so photos survive redeploys.
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    // Every photo is stored as WebP: 1200 px (lightbox), 600 px (cards), 300 px (thumbnails).
    resizeOptions: { width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true },
    formatOptions: webp,
    imageSizes: [
      { name: 'md', width: 600, height: 600, fit: 'inside', withoutEnlargement: true, formatOptions: webp },
      { name: 'sm', width: 300, height: 300, fit: 'inside', withoutEnlargement: true, formatOptions: webp },
    ],
    adminThumbnail: 'sm',
  },
}
