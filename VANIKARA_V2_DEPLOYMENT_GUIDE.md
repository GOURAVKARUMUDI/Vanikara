# VANIKARA V2 — Deployment Guide

## 1. Pre-Deployment Checklist
1. Confirm target branch `feature/vanikara-v2-premium-enterprise` has passed `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `node --test scripts/unit-tests.mjs`.
2. Execute `supabase/setup_new_project.sql` and `supabase/migrations/20261126_v2_enterprise_schema.sql` on the staging Supabase project first, then production after approval.
3. Configure all required environment variables in Vercel (see `VANIKARA_V2_ENVIRONMENT_SETUP.md`).
4. Verify `ADMIN_ACCOUNTS` uses scrypt hashes generated via `node scripts/hash-admin-password.mjs <username>` and `ADMIN_SESSION_SECRET` is a 48+ byte random secret.

## 2. Deployment Sequence (Vercel)
1. Merge `feature/vanikara-v2-premium-enterprise` via reviewed Pull Request (do not push directly to production without authorization).
2. Verify Vercel Preview deployment across desktop and mobile viewports (320px to 1920px).
3. Validate `/api/health` returns `200 OK` (`{"status":"healthy"}`).
4. Sign in to `/admin` and verify **System Health** and **Security & Audit** show green connectivity and zero unexpected warnings.
5. Promote to Production.

## 3. Rollback Plan
- In Vercel Dashboard → Deployments, select the prior known-good production deployment and click **Instant Rollback**.
- Database migrations are strictly additive and safe to leave in place during an application rollback.
