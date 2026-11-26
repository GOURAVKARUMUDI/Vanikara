# VANIKARA — Build and Runtime Verification

Audit date: 2026-11-26 (IST). Branch: `feature/website-refinement` (includes the work in PR #11).

## Environment

| Item | Value |
| --- | --- |
| OS | macOS 27.0.1 (Darwin) |
| Node.js | v24.4.1 |
| npm | 11.5.1 |
| Package manager | npm (lockfile: `package-lock.json`) |
| Browser for tests | Playwright Chromium (bundled) |
| Production server | `npm run start` (Next.js production build) |

Environment values were not printed. Secrets were not written to any file.

## Commands executed

| # | Command | Result |
| --- | --- | --- |
| 1 | `npm ci` | PASS. 551 packages installed from the lockfile. Deprecation warning for `whatwg-encoding` (transitive; not blocking). |
| 2 | `npx tsc --noEmit` | PASS. 0 errors. |
| 3 | `npm run lint` | PASS. 0 errors, 0 warnings. |
| 4 | `npm run test:unit` (`node --test tests/unit/unit-tests.mjs`) | PASS. 4/4. Real code under test, no mocks. |
| 5 | `npm run build` | PASS. Routes compiled, including `/robots.txt`. |
| 6 | `PLAYWRIGHT_PORT=3099 npx playwright test --project=chromium` | PASS. 67/67 against the production build. |
| 7 | `npm run start -- -p 3112` + `curl` smoke checks (see below) | PASS for all expected status codes. |
| 8 | `node tests/audit/responsive-sweep.mjs` (7 viewports × 10 routes) | PASS for overflow (0 px). Console findings explained below. |
| 9 | `npm audit --omit=dev` | 0 vulnerabilities. |
| 10 | `npm audit` (full tree) | 7 moderate, all in the dev-only lint toolchain (`typescript-eslint`, `minimatch`). Not shipped to production. Not force-fixed, because the fix is a breaking toolchain change. |

## Production smoke test (port 3112, production build)

| Route | Status | Expected |
| --- | --- | --- |
| `/`, `/about`, `/leadership`, `/businesses`, `/businesses/travel`, `/businesses/hotels`, `/businesses/quick-commerce`, `/food-delivery`, `/cygma-ai`, `/cygma-ai/resume-intelligence`, `/cygma`, `/technology`, `/what-we-build`, `/careers`, `/contact`, `/legal`, `/legal/*` (7 pages), `/login`, `/account/login`, `/api/health`, `/robots.txt`, `/sitemap.xml` | 200 | Public pages render |
| `/careers/does-not-exist` | 307 → `/careers` | Job pages do not reveal listings while recruitment is closed |
| `/admin`, `/dashboard` | 307 → `/login` | Protected |
| `/admin/login` | 307 → `/login` | Legacy admin login redirects to the staff login |
| `/does-not-exist` | 404 | Not-found page |
| `/api/admin/stats`, `/api/admin/availability`, `/api/leads` (no session) | 401 | Unauthenticated admin APIs rejected |
| `POST /api/contact` (service disabled) | 503 | Disabled submission endpoint |
| `POST /api/careers/apply` (service disabled) | 503 | Disabled submission endpoint |
| `GET /api/careers/apply` | 405 | Method not allowed |

Security headers on `/`: Content-Security-Policy, X-Frame-Options `DENY`, X-Content-Type-Options `nosniff`, Referrer-Policy `strict-origin-when-cross-origin`, Strict-Transport-Security (HSTS), Permissions-Policy. `/admin/login` sends `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`.

## Responsive sweep

Viewports: 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 375×812. Routes: `/`, `/businesses`, `/food-delivery`, `/cygma-ai`, `/cygma-ai/resume-intelligence`, `/careers`, `/contact`, `/login`, `/account/login`, `/legal/privacy`. Total 70 checks.

- **Horizontal overflow:** 0 of 70 checks.
- **Broken images:** none reported.
- **Server errors (5xx):** none.
- **Console errors:** `net::ERR_SSL_PROTOCOL_ERROR` on every route, and one on `/account/login`. Cause: the Content-Security-Policy sends `upgrade-insecure-requests`. On `http://localhost` the browser upgrades subresource and prefetch requests to `https://localhost`, which has no certificate. Production is served over HTTPS, so the upgrade has no effect there. This is a local-testing artifact, not a production defect. Failed `_rsc` prefetches (`ERR_ABORTED`) are the same cause.
- Results: `docs/audit/evidence/responsive-results.json`.
- Screenshots (desktop 1440×900, mobile 390×844): `docs/audit/evidence/`. Pages: homepage, business portfolio, Food Services, CYGMA_AI, CYGMA-RI, Careers (Opening Soon), contact (unavailable notice).

Not captured: the administrative dashboard. Viewing it needs an approved test account, and none is available in this environment.

## Browser console findings

Covered by the responsive sweep above. No JavaScript exceptions (`pageerror`) were reported on any checked route. No hydration errors were reported in the console at the viewports tested.

## Route verification

All public routes in the smoke test return 200. All public routes linked from the footer are present in the smoke test. Unknown routes return 404.

## Integration verification limitations

- **Supabase:** the build and tests run without a verified live database connection. The migration `supabase/migrations/20261127_service_availability.sql` has NOT been applied to any database, so the availability table is unverified. Until it is applied, the code fails closed (all services disabled).
- **SMTP (Zoho):** not verified. No credentials are configured for this environment. Public submissions are disabled by design, so no email is sent. Nothing here is a verified delivery test.
- **Firebase / Google sign-in:** not verified. Needs a real Firebase project and an approved test account.
- **Razorpay:** intentionally disabled. `/api/payment` returns 503 without keys. Not verified for live payments, and no payment was made.
- **Upstash Redis:** not configured. Rate limiting uses the per-instance in-memory fallback.
- **Admin dashboard (authenticated):** not verified. Only unauthenticated protection was tested.
- **Lighthouse and automated accessibility (axe):** NOT RUN. Not claimed.

## Build warnings and unresolved errors

- No build errors. No TypeScript errors. No lint errors.
- Warning: `npm ci` deprecation notice for the transitive dependency `whatwg-encoding`. Not blocking.
- Warning: 7 moderate advisories in the dev-only lint toolchain. Not shipped to production. Tracked in the master audit.
- Suppression comments: 50 `eslint-disable` / `@ts-expect-error` lines exist in `src/`. These were not audited individually in this pass. Tracked as an outstanding code-quality item.
