# VANIKARA

Website, admin console and client payments for **VANIKARA Intelligence Private Limited** (CIN U47912AP2026PTC125340), Guntur, Andhra Pradesh.

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (database and storage), Firebase Authentication (Google sign-in) and Razorpay (payments). Hosted on Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

## Environment

All settings live in `.env.local` (git-ignored — never commit it). `.env.example` lists every variable.

| Area | Variables | Without them |
| --- | --- | --- |
| Database (required) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | The server refuses to start |
| Admin sign-in | `ADMIN_ACCOUNTS`, `ADMIN_SESSION_SECRET` | Admin and Google sign-in are disabled |
| Google sign-in | `NEXT_PUBLIC_FIREBASE_*` | The Google button is disabled |
| Payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Online payments return "not available" |
| Email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Form submissions are saved but no email is sent |
| Shared rate limits | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Limits apply per server instance |

**Admin accounts** are fixed — there is no registration. Add or change one with:

```bash
node scripts/hash-admin-password.mjs <username>
```

It prompts for the password (hidden) and prints a `username:salt:hash` entry. Join entries with `;` in `ADMIN_ACCOUNTS`. Removing an entry signs that admin out immediately.

**Vercel:** copy the settings from `.env.local` to the linked Vercel project with `bash scripts/sync-vercel-env.sh`.

## Database

Run `supabase/setup_new_project.sql` once in the Supabase SQL Editor. It is idempotent: it creates the tables, locks private data so only the server can read it (RLS with no public policies), creates the private `resumes` bucket, and repairs tables created by older scripts.

## Sign-in model

- **Visitors** browse everything without an account. Optional **Google sign-in** creates an account (name, email, photo) but grants no extra access.
- **Admins** sign in with username and password at `/login` → "Team member? Admin sign in", and reach `/admin`.
- The two sessions are signed with different keys, so a visitor session can never act as an admin one.

In Firebase: enable the Google provider and add every domain the site runs on (`localhost`, `www.vanikara.com`, the Vercel domain) under Authentication → Settings → Authorized domains.

## Legal pages

All policy facts (effective date, grievance officer, payment and refund terms, packages and prices) come from `src/data/legal.ts`. Update them there, then have the pages reviewed by a legal professional before publishing.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright tests (site pages and security checks) |

## Project layout

```
src/app/            pages and API routes (App Router)
src/proxy.ts        request guard for /admin, /api/admin, /login (Next.js 16 "proxy")
src/components/     UI, layout, admin console, auth, legal document layout
src/sections/       home and contact page sections
src/data/           company facts and legal facts (single sources of truth)
src/lib/            auth, sessions, rate limiting, security helpers
supabase/           database setup script
scripts/            admin password hashing, Vercel env sync, route checks
e2e/                Playwright tests
```

## Design system

- **Colours:** brand primitives are `--vanikara-*` CSS variables; components use semantic tokens (`text-fg`, `text-intel`, `text-ambition`, `bg-surface`, `border-line` …). Contexts that cannot read CSS variables (charts, emails, generated images) use `src/lib/brandColors.ts`.
- **Styles:** `globals.css` (tokens, base, components), `motion.css` (animation), `surfaces.css` (background layers, liquid glass, accessibility modes).
- **Theme:** Light, Dark or Auto (by time of day, `src/lib/daypart.ts`), applied before first paint by a script in `<head>`.
- **Motion:** respects `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.
- **Logo:** always render the supplied asset through `BrandSymbol` / `BrandMark` (`public/brand/`, derived from `public/logo.png`). Never redraw, recolour or distort it.
