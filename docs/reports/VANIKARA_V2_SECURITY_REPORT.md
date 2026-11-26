# VANIKARA V2 — Security Report

## 1. Authentication & Authorization Controls
- **Dual Isolated Session Domains**:
  - Staff (`vk_admin`, 8-hour TTL, `HttpOnly`, `SameSite=Strict`, `Secure` in production) authenticated via scrypt-hashed `ADMIN_ACCOUNTS` with `crypto.timingSafeEqual` and dummy fallback hashing.
  - Public Users (`vk_user`, 7-day TTL, `HttpOnly`, `SameSite=Lax`) authenticated via Firebase Google ID token exchange. Public sessions can never elevate to admin access.
- **Server-Side RBAC (`src/lib/rbac.ts`)**: Role matrix (`super_admin`, `content_manager`, `hr_manager`, `operations_manager`, `finance_manager`, `auditor`) enforced on V2 API handlers.
- **Blocked User Enforcement**: `/api/account/records` checks `users.blocked` on every request so blocked accounts immediately lose access even with an unexpired cookie.

## 2. File Upload Hardening (`src/lib/fileValidation.ts`)
- Size cap enforced at 4 MB.
- PDF validation verifies `%PDF-` magic header and `%%EOF` trailer.
- DOCX validation inspects the ZIP End of Central Directory (EOCD) and Central Directory headers to verify presence of `[Content_Types].xml` and `word/document.xml`, enforces entry count limits (max 250 entries), enforces decompressed size caps (25 MB per entry), and blocks path traversal (`..`, leading `/`).
- **Documented Limitation**: Automated antivirus/malware scanning requires an external scanning service not currently configured in this environment and is therefore **not** claimed as operational.

## 3. Perimeter & Transport Hardening
- Strict CSP, HSTS (`max-age=31536000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `COOP`.
- `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow` on `/admin`, `/login`, `/api/admin/*`, `/api/auth/*`.
- `noindex, nofollow` metadata on `/account/*` and `/admin/login`.
- Trusted origin checks (`isTrustedOrigin`), Zod input validation, DOMPurify sanitization, and honeypots on all public forms.

## 4. Residual Risks & External Blockers
1. **Upstash Redis Rate Limiting**: Currently operating in per-instance in-memory fallback because `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are unset. Set these in production for distributed brute-force protection.
2. **Payment Routes**: `/api/payment` is intentionally disabled (returns `503`) because `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are unset and no public checkout UI is exposed.
3. **Database Migration**: Run `supabase/setup_new_project.sql` and `supabase/migrations/20261126_v2_enterprise_schema.sql` against the target Supabase project to activate all RLS-protected tables.
