# VANIKARA V2 — Environment Setup

All secrets live in `.env.local` (git-ignored) and Vercel Environment Variables. Never commit secrets to Git.

## 1. Required Production Variables
| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key (restricted by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Trusted server database & private storage access |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL (`https://www.vanikara.com`) |

## 2. Authentication & RBAC Variables
| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `ADMIN_ACCOUNTS` | Server-only | Scrypt-hashed staff accounts (`user:saltHex:hashHex;...`) |
| `ADMIN_SESSION_SECRET` | Server-only | Minimum 32-char random key for HMAC-SHA256 cookies |
| `ADMIN_ROLES` | Server-only (Optional) | Optional RBAC role overrides (`user:content_manager;...`) |
| `NEXT_PUBLIC_FIREBASE_*` | Public | Firebase project keys enabling public Google Sign-In |

## 3. Optional / External Integration Variables
| Variable | Scope | Current Local Status | Behavior When Missing |
| :--- | :--- | :--- | :--- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Server-only | `SMTP_PASS` missing in `.env.local` | Submissions persist to DB; email alerts skipped |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Server-only | Missing in `.env.local` | Falls back to per-instance in-memory rate limiter |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Server-only | Missing (Intentionally disabled) | `/api/payment` safely returns `503` |
| `GOOGLE_FORM_*` & `GOOGLE_MAPPING_*` | Server-only | Configured | Dual-write backup to Google Sheets |
