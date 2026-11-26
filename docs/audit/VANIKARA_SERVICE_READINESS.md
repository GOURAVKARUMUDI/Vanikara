# VANIKARA — Service Readiness

Audit date: 2026-11-26. Status key:

- **Operational:** working and verified in this environment.
- **Intentionally unavailable:** disabled on purpose, and the disabled behaviour is correct.
- **Configured, not verified:** code exists; not tested end to end.
- **Blocked:** needs credentials, a database migration, company approval, or an external service.
- **Defect:** the implementation is wrong. None remain open in this list; defects found in this audit are fixed or listed under blockers.

| Service or area | Status | Evidence | What is needed |
| --- | --- | --- | --- |
| Public website (pages) | Operational | 200 on all public routes; 67/67 e2e; 70 responsive checks with no overflow | None |
| Authentication: unauthenticated protection | Operational | `/admin`, `/dashboard` redirect; admin APIs return 401 | None |
| Authentication: admin sign-in and sessions | Configured, not verified | Code reviewed; no test account | Staging test admin |
| Authentication: role-based access (RBAC) | Configured, not verified | Code reviewed | Staging test accounts for each role |
| Visitor authentication (Google, Firebase) | Blocked | Firebase sub-packages in place; needs project and test account | Firebase config and test account |
| Administrative dashboard | Configured, not verified | Protected by proxy and session; authenticated views not exercised | Staging test admin |
| CMS (site content editor) | Configured, not verified | Code present; `site_content` table required | Database access; staging edit test |
| CRM (enquiries, leads) | Configured, not verified | Admin routes present | Database access; staging test |
| Recruitment management (job positions) | Configured, not verified | Admin routes present; table required | Database migration; staging test |
| Careers public presentation | Operational | Opening Soon; detail pages redirect while closed | None |
| Career applications (public) | Intentionally unavailable | `POST /api/careers/apply` returns 503 | Recruitment opening and verified SMTP, then admin activation |
| Public submissions: general contact | Intentionally unavailable | `POST /api/contact` returns 503; form replaced by notice | SMTP verification; admin activation |
| Public submissions: restaurant partnerships | Intentionally unavailable | `POST /api/registrations` gated; notice on `/food-delivery` | SMTP verification; admin activation |
| Public submissions: demo requests (CYGMA-RI) | Intentionally unavailable | `POST /api/registrations` gated; notice on `/cygma-ai/resume-intelligence` | SMTP verification; admin activation |
| Public submissions: business and enterprise enquiries | Intentionally unavailable | No public endpoint exists; administrative creation only | Decision on a public endpoint, if wanted |
| Newsletter subscriptions | Not implemented | No endpoint or form exists | Decision on whether to build |
| Investor enquiries | Not implemented | No endpoint or form exists | Decision on whether to build |
| Availability controls (admin) | Configured, not verified | API returns 401 without session; code and UI present | Apply migration in staging; test toggles |
| SMTP (Zoho) | Blocked | No credentials in this environment | `SMTP_USER`, `SMTP_PASS`, sender and recipient settings, then a test delivery |
| Telephone support | Intentionally unavailable | No public number exists; notice shown on `/contact` | Approved corporate number, then admin activation |
| AI-assisted telephone ordering | Intentionally unavailable | Concept notice only; no call controls | Product approval and launch decision |
| Public office map | Intentionally unavailable | No map or directions link exists | Approved public office location |
| Maps on other pages | Operational (none present) | `git grep` finds no map embeds | None |
| Supabase | Blocked | Client and tables defined; no live verification | Staging database access; migrations applied |
| Supabase row-level security | Configured, not verified | Migrations enable RLS | Live verification in staging |
| Firebase | Blocked | Same as visitor authentication | Project configuration |
| Google Forms mirroring | Configured, not verified | Code path exists | Test submission after activation |
| Payments (Razorpay) | Intentionally unavailable | `/api/payment` returns 503 without keys | Owner decision; keys; live test only if authorised |
| Rate limiting (Upstash) | Blocked | Not configured; in-memory fallback per instance | Upstash URL and token |
| Analytics (Vercel) | Configured, not verified | Packages present | Production check |
| Logo and brand assets | Blocked | Approved asset `Vanikara-Flogo(7).png` not in repository | Approved file from the company |
| Favicon and icons | Operational | Icon files present in `public/icons/` | Confirm approval |
| Production deployment | Blocked | Production (`main`) runs the pre-fix build with 500s on several routes | Merge PR #10, then PR #11, after review |
| Robots and sitemap | Operational | `/robots.txt` and `/sitemap.xml` return 200 | None |
| Security headers | Operational | CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy present | CSP tightening (owner review) |

## Summary

- **Operational:** public site, robots and sitemap, careers presentation, security headers, unauthenticated protection.
- **Intentionally unavailable:** all public submissions, telephone support, AI telephone ordering, public office map, payments, career applications.
- **Blocked:** SMTP, Firebase and Google sign-in, Upstash, Supabase database, logo asset, production deployment.
- **Configured, not verified:** admin authentication, RBAC, CMS, CRM, recruitment management, availability controls, Google Forms.
- **Not implemented:** newsletter, investor enquiries.
- **Defects:** none open. Defects found in this audit are fixed (see the changelog).
