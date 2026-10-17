import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { migrations } from './migrations'
import { Awards } from './collections/Awards'
import { Gallery } from './collections/Gallery'
import { History } from './collections/History'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { Users } from './collections/Users'
import { globals } from './globals'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // The designed, phone-first admin lives at /admin. Payload's own admin stays at /cms as a fallback.
  routes: { admin: '/cms' },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · દવડા ઍગ્રો' },
  },
  serverURL: process.env.SITE_URL || undefined,
  collections: [Products, Gallery, Awards, Reviews, Media, History, Users],
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Dev pushes schema changes directly; production applies src/migrations on boot (see README).
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  onInit: async (payload) => {
    if (process.env.SKIP_SEED !== '1') await seed(payload)
  },
  plugins: [],
})
