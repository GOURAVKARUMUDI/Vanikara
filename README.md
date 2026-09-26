# VANIKARA

<p align="center">
  <img src="./public/brand/vanikara-symbol.png" alt="VANIKARA" width="140"/>
</p>

The corporate website of **VANIKARA Intelligence Private Limited** — a student-founded technology company from Guntur, Andhra Pradesh.

The site presents the company and its two initiatives:

- **Food Delivery Platform** — in development, targeting launch in Guntur in November 2026.
- **CYGMA AI** — a proprietary, long-term intelligence initiative (not a public chatbot or consumer product).

It also includes a contact form, a sign-in flow, a user dashboard and an internal admin area.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 with a single token system in `src/app/globals.css`
- Supabase (Postgres, Auth, Storage)
- Deployed on Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys (required) and optional SMTP / Razorpay
npm run dev
```

`next.config.mjs` stops the server if the required Supabase variables are missing.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright tests (Chromium) |

## Project structure

```
src/
  app/                 Routes, metadata, API route handlers
  components/
    brand/             BrandMark, BrandSymbol, BrandStage (hero symbol)
    layout/            Theme, background, consent, site-wide enhancements
    ui/                Button, Card, Eyebrow, SectionHeader
    people/            Founder cards
    admin/             Admin dashboard modules
  sections/            Page sections (home, contact)
  data/company.ts      Company facts and public copy — single source of truth
  lib/                 Security, rate limiting, audit logging, brand colours
supabase/              SQL schema files
public/brand/          Optimised symbol derived from public/logo.png
```

## Design system

- **Colours:** brand primitives are `--vanikara-*` CSS variables; components use semantic tokens (`text-fg`, `text-intel`, `text-ambition`, `bg-surface`, `border-line` …). Contexts that cannot read CSS variables (charts, emails, generated images) use `src/lib/brandColors.ts`.
- **Type:** Manrope throughout.
- **Theme:** light and dark are set before first paint by a small script in `<head>`; Tailwind's `dark:` variant follows the site toggle.
- **Motion:** CSS only. Scroll reveals use a single `IntersectionObserver`; everything respects `prefers-reduced-motion`.
- **Logo:** always render the supplied asset through `BrandSymbol` / `BrandMark`. Never redraw, recolour or distort it.
