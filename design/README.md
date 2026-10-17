# Davada Agro Industries — design handoff

Source of truth for building the website and admin panel. Live canvas (owner only):
https://claude.ai/code/artifact/1d1d9b27-2b8d-46cd-98cb-c8bf0350309e

## What's here

- `prototype/prototype.html` — the approved, working prototype. Its structure, colours, typography,
  copy (gu / hi / en, word for word) and behaviour are **locked**. Build from this.
- `canvas/` — the design boards as HTML (`*.dc.html`). Open them in a browser to view; ignore the
  `<x-dc>`, `<sc-for>`, `<sc-if>` tags and `{{ }}` holes, they are the canvas tool's template syntax.
  - `Main.dc.html` — 01 Foundations (tokens, type, numerals, spacing, radii, icons, a11y)
  - `Components.dc.html` — 02 Components
  - `Home*`, `Product*`, `Gallery*`, `Lightbox*` — public site, desktop 1440 / mobile 360
  - `AdminPlan.dc.html` — admin IA, field types, template config, suggested stack
  - `AdminKit.dc.html` + `Admin*` — admin screens, mobile + desktop
  - `canvas.json` — board list and the sticky notes (placeholders, behaviour, gallery data format)
- `assets/` — real temple photo (`temple.webp`) and the product illustrations (`K*.svg`).

## Rules that matter most

1. Gujarati-first. Default locale `gu`; Hindi and English via the header picker. Never rewrite or
   machine-translate prototype strings.
2. Gujarati numerals in prose, prices, stats, specs and counters (૧૨+, ₹૧,૬૫,૦૦૦, ૩ / ૨૪).
   Phone numbers and model IDs stay Latin.
3. Colours: indigo #19203F / #10142C, kesar #E07B16, wash #F4F4F8. WhatsApp green #1DA851 only on
   inquiry buttons (label 19 px bold for contrast). Stock dot is indigo, not green.
4. Fonts: Anek Gujarati / Devanagari / Latin for headings, Hind Vadodara / Hind for body, line-height 1.7.
5. Mobile-first at 360 px, tap targets ≥ 44 px, safe areas, reduced motion, alt text per language.
6. Phone, address, prices, specs, stats, awards, testimonials are **placeholders** — keep them in one
   content file and mark them clearly.
7. New Gujarati strings (gallery subtitle, admin labels) are drafts pending the owner's review.

## Build order

1. Public site: home → product detail sheet/dialog (`#p-ID`) → gallery page + lightbox (`#g-N`).
2. Content in one `content.json` (products, gallery, awards, reviews, pages) that the site reads.
3. Admin panel from `AdminPlan.dc.html`: schema-driven, phone-first, live save with undo + history,
   OTP login, photo upload with WebP resizing.
