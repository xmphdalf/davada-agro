# Davada Agro Industries: website and admin

Gujarati-first website for Davada Agro Industries (દવડા ઍગ્રો ઇન્ડસ્ટ્રીઝ), Chital, Amreli, plus a
phone-first admin panel so the owner can change prices, stock, photos and page text himself.

- **Design source of truth:** [`design/`](design/README.md): approved prototype, design boards, assets.
- **Stack:** Next.js 16 + [Payload CMS](https://payloadcms.com) 3 + Postgres, deployed on Railway.

## What's built

| Part | Status |
|---|---|
| Admin panel at `/admin` (the designed, Gujarati-first UI) | ✅ |
| Payload's built-in admin at `/cms` (fallback for anything not in `/admin`) | ✅ |
| Public website (home → product sheet → gallery) | ⏳ next. `/` is a placeholder |

### Admin panel (`/admin`)

Built from `design/canvas/AdminPlan.dc.html`, `AdminKit.dc.html` and the `Admin*` boards.

- **Login:** email + password (no SMS/OTP), stays signed in for 30 days. No public sign-up.
- **મુખ્ય:** greeting, quick actions, “બાકી કામ” (missing translations, empty prices), recent changes.
- **સનેડા:** drag to reorder, stock / best-seller switches in the list, full edit form with photos
  (up to 6, first is the main one), gu / hi / en name and description, price with live
  “સાઇટ પર: ₹૧,૬૫,૦૦૦” preview, specs, and a live card preview on desktop.
- **ગેલેરી:** multi-photo upload in the background, YouTube videos, category filter, caption in three
  languages, “which model is in the photo”, drag to reorder.
- **વધુ:** home page text, subsidy, stats, awards, farmer reviews, contact and hours, change history,
  change password, admin language (ગુજરાતી / English).
- **Saving** is live: no drafts. Every save shows a toast with **પાછું લો (undo)** for 10 seconds.
- **ફેરફારનો ઇતિહાસ:** every change is kept for 30 days and can be undone; deleted items can be
  restored (they go to trash and are purged after 30 days).
- **Photos** are shrunk on the phone before upload, then stored as WebP at 1200 / 600 / 300 px.

All admin labels live in [`src/admin/strings.ts`](src/admin/strings.ts) (gu + en). **The Gujarati admin
labels are drafts for Pratik Davda to review.**

## Placeholders: confirm before launch

All seeded content is copied word for word from the prototype
([`src/seed/data.ts`](src/seed/data.ts)), and much of it is placeholder:

- Phone / WhatsApp `+91 98765 43210`, the address
- Every price, spec and stock status
- Stats (૧૨+ yrs, ૩,૨૦૦+ deliveries, ૪૫૦+ villages, ૧૨ awards)
- All 5 awards and all 3 reviews, the IndiaMART ૫.૦ rating
- Subsidy amount (૪૦% / ₹૬૦,૦૦૦): verify on i-Khedut
- Product pictures are the design illustrations until real photos are uploaded

Everything except the rating can be corrected from the admin panel after deploying.

## Deploy on Railway

Railway builds the repo from its `Dockerfile`. The service is set up with health check path
`/health` (timeout 120 s) and restart policy *on failure*. `/health` starts Payload, so pending
migrations and the first-boot seed run before a deploy goes live.

1. **New project** → **Deploy from GitHub repo** → pick `davada-agro` (and the branch).
2. In the project: **+ New** → **Database** → **PostgreSQL**.
3. Open the web service → **Variables** and add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference to the Postgres service) |
   | `PAYLOAD_SECRET` | a long random string (e.g. `openssl rand -hex 32`) |
   | `ADMIN_EMAIL` | the owner's login email |
   | `ADMIN_PASSWORD` | a first password (change it later in the admin) |
   | `ADMIN_NAME` | e.g. `પ્રતીકભાઈ` (shown as “નમસ્તે, …”) |
   | `SITE_URL` | the public address once you have one, e.g. `https://davadaagro.in` |
   | `MEDIA_DIR` | `/data/media` |

4. Web service → **Settings** → **Volumes** → add a volume mounted at **`/data`**.
   Uploaded photos are stored in `/data/media` and survive redeploys.
5. **Settings** → **Networking** → **Generate domain** (or add `davadaagro.in` as a custom domain).
6. Deploy. On first boot the app creates the database tables, the admin account from
   `ADMIN_EMAIL` / `ADMIN_PASSWORD`, and the prototype content. Then open `/admin`.

The first admin account is only created when the database has no users, so after the first
deploy you can remove `ADMIN_PASSWORD` from the variables. To add another person, sign in at
`/cms` → Users → Create.

**Forgot password?** There is no reset email yet. Sign in as another user at `/cms` and set a new
password, or temporarily set a new admin in the env vars on an empty `users` table.

## Local development

Requires Node 22, pnpm and Postgres.

```bash
cp .env.example .env          # fill in DATABASE_URL, PAYLOAD_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
pnpm install
pnpm dev                      # http://localhost:3000/admin
```

In development Payload pushes schema changes straight to the database. Before deploying a schema
change, create a migration and commit it; production applies pending migrations on boot:

```bash
pnpm payload migrate:create <name>
pnpm generate:types           # refresh src/payload-types.ts
```

Checks: `pnpm lint`, `npx tsc --noEmit`, `pnpm build`.

## Layout

```
design/                     design handoff (prototype, boards, assets): read-only reference
public/                     product illustrations, temple photo
src/
  payload.config.ts         Payload: collections, globals, Postgres, migrations, seed on first boot
  collections/              Products, Gallery, Awards, Reviews, Media, History, Users
  globals/                  Home text, Subsidy, Stats, Contact
  fields/i18n.ts            translated text field { gu, hi, en }: empty hi/en falls back to gu
  lib/                      formatting (Gujarati numerals, ₹ grouping), history hooks, purge
  seed/                     prototype content for an empty database
  migrations/               Postgres migrations (applied automatically in production)
  admin/                    the designed admin: strings, server actions, UI kit (ui/), styles
  app/(admin)/admin/        admin routes
  app/(payload)/            Payload REST API (/api) and built-in admin (/cms)
  app/(frontend)/           public site (placeholder for now) and /health
```
