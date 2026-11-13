<div align="center">

<img src="public/logo.png" alt="VANIKARA" width="96" />

# VANIKARA

**Building what comes next.**

The official website, admin console and client payments platform for
**VANIKARA Intelligence Private Limited**.

[Website](https://www.vanikara.com) · [Contact](mailto:contact@vanikara.com) · [Support](mailto:support@vanikara.com)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## Contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Database](#database)
- [Authentication](#authentication)
- [Content management](#content-management)
- [Testing and quality](#testing-and-quality)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Security](#security)
- [Legal](#legal)
- [Contact](#contact)

## About

VANIKARA Intelligence Private Limited (CIN U47912AP2026PTC125340) is a student-founded technology company based in Guntur, Andhra Pradesh, building products around real-world problems while developing a long-term vision for intelligent systems.

This repository powers the company's public website, its internal admin console, and online payments for clients.

## Features

- **Company website** — home, about, leadership, technology, products (Food Delivery Platform, CYGMA AI), pricing, careers and contact pages.
- **Admin console** (`/admin`) — dashboards for leads, clients and job applications, plus a live website content editor.
- **Live content publishing** — admins edit site copy, people, timeline, products and pricing without a redeploy.
- **Careers** — application form with private résumé storage.
- **Payments** — Razorpay checkout for client packages.
- **Email notifications** — form submissions delivered over Zoho SMTP.
- **Google sign-in** for visitors and separate, fixed admin accounts.
- **Light, dark and auto themes**, fully responsive, with reduced-motion, reduced-transparency and high-contrast support.
- **SEO ready** — sitemap, web manifest, Open Graph and Twitter images.
- **Analytics** — Vercel Web Analytics and Speed Insights.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS design tokens |
| Database and storage | [Supabase](https://supabase.com) (Postgres with RLS, private storage) |
| Authentication | Firebase Authentication (Google), signed admin sessions (`jose`) |
| Payments | [Razorpay](https://razorpay.com) |
| Email | Nodemailer over Zoho SMTP |
| Rate limiting | Upstash Redis |
| Validation | Zod, DOMPurify |
| Testing | Playwright, ESLint |
| Hosting | [Vercel](https://vercel.com) |

## Getting started

**Requirements:** Node.js 20 or later (24 LTS recommended) and npm.

```bash
git clone git@github.com:GOURAVKARUMUDI/Vanikara.git
cd Vanikara
npm install
cp .env.example .env.local   # fill in the values, see Configuration
npm run dev                  # http://localhost:3000
```

## Configuration

All settings live in `.env.local`, which is git-ignored and must never be committed. `.env.example` lists every variable.

| Area | Variables | If missing |
| --- | --- | --- |
| Database **(required)** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | The server refuses to start |
| Admin sign-in | `ADMIN_ACCOUNTS`, `ADMIN_SESSION_SECRET` | Admin and Google sign-in are disabled |
| Google sign-in | `NEXT_PUBLIC_FIREBASE_*` | The Google button is disabled |
| Payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Online payments return "not available" |
| Email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Submissions are saved but no email is sent |
| Shared rate limits | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Limits apply per server instance |
| Google Forms mirroring | `GOOGLE_FORM_*`, `GOOGLE_MAPPING_*` | Submissions are not mirrored to Google Forms |

### Admin accounts

Admin accounts are fixed; there is no public registration. To add or change one:

```bash
node scripts/hash-admin-password.mjs <username>
```

The script prompts for the password (hidden) and prints a `username:salt:hash` entry. Join multiple entries with `;` in `ADMIN_ACCOUNTS`. Removing an entry signs that admin out immediately.

## Database

Run `supabase/setup_new_project.sql` once in the Supabase SQL Editor. The script is idempotent. It:

- creates all tables, including `site_content` for published edits;
- locks private data so only the server can read it (RLS enabled, no public policies);
- creates the private `resumes` storage bucket;
- repairs tables created by older scripts.

## Authentication

| Role | How they sign in | Access |
| --- | --- | --- |
| Visitor | No account needed; optional Google sign-in | Public site |
| Admin | Username and password at `/login` → "Team member? Admin sign in" | `/admin` and `/api/admin` |

Visitor and admin sessions are signed with different keys, so a visitor session can never act as an admin.

**Firebase setup:** enable the Google provider and add every domain the site runs on (`localhost`, `www.vanikara.com`, the Vercel domain) under *Authentication → Settings → Authorized domains*.

## Content management

Admins edit the site at **/admin → Website content**. Each content group (company details, home sections, story, principles, people, timeline, products, pricing packages, legal facts, navigation labels) has an edit field per item.

- **Save & publish** updates the live site immediately.
- **Restore original** returns a group to its built-in text.
- Edits are stored in the `site_content` table; only the server can read or write it.
- Defaults come from `src/content/defaults.ts` (built from `src/data/*`). Unedited content falls back to them, and the site serves them if the database is unreachable.
- Every save is validated against the default's shape (`src/content/validate.ts`): field types, length limits, https-only links, valid emails and fixed menu links.

## Testing and quality

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npm run test:e2e` | Playwright tests (site pages and security checks) |

Run lint, type check and build before opening a pull request.

## Deployment

The site is hosted on **Vercel** and deploys automatically from GitHub:

- every push to a branch creates a **preview deployment**;
- merging into `main` deploys to **production** at [www.vanikara.com](https://www.vanikara.com).

To copy environment variables from `.env.local` to the linked Vercel project:

```bash
bash scripts/sync-vercel-env.sh
```

A health check is available at `/api/health`.

## Project structure

```
src/
├── app/            pages and API routes (App Router)
├── proxy.ts        request guard for /admin, /api/admin and /login
├── components/     UI, layout, admin console, auth, legal layout
├── sections/       home and contact page sections
├── content/        editable content defaults and validation
├── data/           company and legal facts (single source of truth)
└── lib/            auth, sessions, email, rate limiting, security helpers
supabase/           database setup script
scripts/            admin password hashing, Vercel env sync, route checks
e2e/                Playwright tests
public/             logo, brand assets and static files
```

## Design system

- **Colours** — brand primitives are `--vanikara-*` CSS variables; components use semantic tokens (`text-fg`, `text-intel`, `text-ambition`, `bg-surface`, `border-line`, …). Places that cannot read CSS variables (charts, emails, generated images) use `src/lib/brandColors.ts`.
- **Styles** — `globals.css` (tokens, base, components), `motion.css` (animation), `surfaces.css` (backgrounds, liquid glass, accessibility modes).
- **Theme** — Light, Dark or Auto (by time of day, `src/lib/daypart.ts`), applied before first paint to avoid flashes.
- **Motion** — respects `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.
- **Logo** — always render the supplied asset through `BrandSymbol` / `BrandMark` (`public/brand/`, derived from `public/logo.png`). Never redraw, recolour or distort it.

## Security

- Private tables and storage are reachable only from the server (Supabase RLS with no public policies).
- Admin routes are guarded by `src/proxy.ts` and signed, short-lived session cookies.
- All input is validated with Zod and sanitised with DOMPurify; requests are rate limited.
- Secrets live only in environment variables, never in the repository.

To report a security issue, email [support@vanikara.com](mailto:support@vanikara.com) rather than opening a public issue.

## Legal

All policy facts (effective date, grievance officer, payment and refund terms, packages and prices) come from `src/data/legal.ts`. Update them there, and have the pages reviewed by a legal professional before publishing.

## Contact

**VANIKARA Intelligence Private Limited**
Guntur, Andhra Pradesh, India

- General: [contact@vanikara.com](mailto:contact@vanikara.com)
- Support: [support@vanikara.com](mailto:support@vanikara.com)
- Website: [www.vanikara.com](https://www.vanikara.com)

---

<sub>© VANIKARA Intelligence Private Limited. All rights reserved. This is proprietary software; no licence is granted to copy, modify or distribute it.</sub>
