import type { CollectionConfig } from 'payload'

const THIRTY_DAYS = 60 * 60 * 24 * 30

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // The design keeps the owner signed in on his phone for 30 days.
    tokenExpiration: THIRTY_DAYS,
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // No public sign-up: only a signed-in user can add another user.
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      label: 'નામ',
      type: 'text',
    },
  ],
}
