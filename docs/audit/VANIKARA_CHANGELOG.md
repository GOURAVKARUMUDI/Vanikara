# VANIKARA — Audit Changelog

Audit date: 2026-11-26. Branch: `feature/website-refinement`. Earlier work on this branch is listed for context.

## Issues identified in this audit

| # | Severity | Issue | Where |
| --- | --- | --- | --- |
| 1 | High | Published job descriptions reachable by direct URL while recruitment is closed. Metadata exposed job titles. | `src/app/careers/[slug]/page.tsx` |
| 2 | High | Public copy disclosed subscription-based restaurant charges, per-order commission positioning, and Tier-2 expansion. Listed as confidential in the refinement specification. | `src/app/food-delivery/page.tsx`, `src/app/what-we-build/page.tsx`, `src/app/businesses/page.tsx` |
| 3 | Medium | No `robots.txt`. Admin, account and login paths were not declared in a crawl policy. | Missing `src/app/robots.ts` |
| 4 | Medium | Content Security Policy allows `'unsafe-inline'` scripts and lists unused third-party hosts. | `next.config.mjs` |
| 5 | Medium | 7 moderate advisories in the dev-only lint toolchain. | `package.json` (dev dependencies) |
| 6 | Medium | Remaining public copy still has older wording (CYGMA_AI, CYGMA-RI, sub-pages, CMS defaults). | Multiple |
| 7 | High | Availability migration not applied to any database. | `supabase/migrations/20261127_service_availability.sql` |
| 8 | High | Production branch still serves the pre-fix build with 500 responses on several routes. | Deployment (`main`); fix in PR #10 |
| 9 | Medium | Approved logo asset (`Vanikara-Flogo(7).png`) not in the repository. Site uses a symbol derived from `public/logo.png`. | `public/brand/`, `public/logo.png` |
| 10 | Low | CYGMA_AI hero visual reads as generated imagery. | `public/images/cygma-ai/cygma-intelligence-core.webp` |
| 11 | Medium | Lighthouse and accessibility checks not run. | Not applicable |
| 12 | Low | 50 suppression comments (49 `eslint-disable`, 1 `@ts-expect-error`) not individually reviewed. | `src/` |
| 13 | Info | Local `http://localhost` runs show `ERR_SSL_PROTOCOL_ERROR` console messages because of `upgrade-insecure-requests`. | Local testing only |

## Corrections implemented in this audit

### Issue 1: Job detail pages gated by recruitment status
- **Change:** `/careers/[slug]` now redirects to `/careers` when recruitment or career applications are closed. Metadata returns a generic title with `noindex` in the same case.
- **Reason:** Requirement R-15 (Master §11). Listings must not be discoverable while closed.
- **Verification:** `curl` on `/careers/does-not-exist` returns 307 to `/careers` in production mode. Build and e2e pass.

### Issue 2: Commercial and expansion wording removed from public pages
- **Change, `src/app/food-delivery/page.tsx`:** FAQ answer on commercial terms rewritten to say terms are not yet published. "Restaurant-First Economics" card rewritten the same way. "Tier-2 Food Ecosystem" heading changed to "Guntur Food Ecosystem". "Which food businesses are in scope for Tier-2 markets?" changed to "...for the initial Guntur rollout?". Section comment and "Tier-2 cities" sentence reworded.
- **Change, `src/app/what-we-build/page.tsx`:** "Subscription-centric, transparent commercial terms..." replaced with "...Commercial terms are not yet published."
- **Change, `src/app/businesses/page.tsx`:** "tailored to Tier-2 and regional Indian markets" changed to "for regional Indian markets".
- **Reason:** Refinement §4 and Master §8 list subscription pricing, commercial arrangements and expansion plans as not for public disclosure.
- **Verification:** Code search finds no remaining "subscription-based" or "Tier-2" on these pages. Build and e2e pass.
- **Partially corrected:** `src/data/portfolio.ts` (CMS default for the food ecosystem) still says "transparent commercial terms". Left for owner review, because the CMS default text is editable by admins.

### Issue 3: `robots.txt` added
- **Change:** New `src/app/robots.ts`. Allows `/`. Disallows `/admin`, `/dashboard`, `/account`, `/login` and `/api/`. Points to the sitemap.
- **Reason:** Master §24 requires crawl policy for admin and account surfaces. The disallow rules are not access control; authentication remains server-side.
- **Verification:** `/robots.txt` returns 200 with the expected rules in production mode.

## Earlier work on this branch (for context)

These changes were made before this audit and are reported in PR #11:

- Service availability: `src/lib/availability.ts` (fail-closed), migration `20261127_service_availability.sql`, admin API `/api/admin/availability`, admin Settings panel.
- Public submission endpoints return 503 while disabled: `/api/contact`, `/api/registrations`, `/api/careers/apply`.
- Forms replaced with an unavailability notice (`ServiceGate`) on `/contact`, `/food-delivery`, `/cygma-ai/resume-intelligence`, `/careers`, `/careers/[slug]`.
- Homepage restructured to the 8-part sequence. Timeline, founders, opportunities and closing sections removed from the homepage.
- Careers page shows "Opening Soon" while recruitment is closed.
- Footer reduced. Telephone unavailable line added on `/contact`.
- Repository reorganised: reports and guides moved to `docs/`; unit and route-validation scripts moved to `tests/`.

## Modified files in this audit

| File | Purpose |
| --- | --- |
| `src/app/careers/[slug]/page.tsx` | Redirect while closed; generic metadata |
| `src/app/food-delivery/page.tsx` | Commercial and Tier-2 wording removed |
| `src/app/what-we-build/page.tsx` | Commercial wording removed |
| `src/app/businesses/page.tsx` | Tier-2 wording removed |
| `src/app/robots.ts` | New crawl policy |
| `tests/audit/responsive-sweep.mjs` | New audit tool: viewport overflow, console and screenshot sweep |
| `docs/audit/*` | Audit deliverables and evidence |

## Superseded requirements

- "Active Initiatives" widget in the hero: superseded and removed.
- "Apply Now" and "Register Early Interest" CTAs: superseded by Opening Soon and disabled forms.
- Image quantity targets from earlier briefs: superseded by the refinement specification (no imagery for its own sake).
- Tier-2 market positioning on public pages: superseded by the refinement specification's content-reduction and confidentiality rules.
- Homepage founders, timeline and opportunities sections: superseded by the 8-part homepage sequence.

## Verification results

| Check | Result |
| --- | --- |
| `npm ci` | PASS (551 packages) |
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS (4/4) |
| `npm run build` | PASS |
| Playwright e2e (chromium, production build) | PASS (67/67) |
| Production smoke test (curl) | PASS for expected codes |
| Responsive sweep (70 checks) | 0 overflow; console findings explained (local HTTPS upgrade) |
| `npm audit --omit=dev` | 0 vulnerabilities |
| `npm audit` (full) | 7 moderate, dev-only |

## Remaining limitations

- Migration not applied to a database. Availability is unverified end to end.
- Authenticated admin, RBAC, Google sign-in and Firebase not tested (no approved test account).
- SMTP delivery, Upstash, Razorpay not verified (credentials or intentionally disabled).
- Approved logo asset not present. Not replaced.
- Lighthouse and accessibility audits not run.
- CSP tightening not performed (needs owner review).
- Some CMS and dedicated-page copy still needs review.
- Production still serves the pre-fix build until PR #10 is merged.
- This audit did not push or deploy anything, per the audit instructions.
