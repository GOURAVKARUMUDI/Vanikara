# VANIKARA V2 — Database Migration Guide

## 1. Overview
Vanikara V2 preserves all existing Supabase PostgreSQL tables and records. Schema enhancements are delivered via a non-destructive, idempotent SQL migration:
- Base schema: `supabase/setup_new_project.sql`
- V2 Enterprise migration: `supabase/migrations/20261126_v2_enterprise_schema.sql`

## 2. Objects Added by V2 Migration
1. **Non-destructive column additions**:
   - `leads`: `reference_code`, `category`, `assigned_to`, `internal_notes`
   - `careers_applications`: `reference_code`, `internal_notes`, `job_id`
2. **New tables**:
   - `job_positions`: Published/draft/closed job listings for `/careers` and `/careers/[slug]`.
   - `product_registrations`: Early interest registrations for the Food Delivery Platform (Guntur 2027) and future products.
   - `content_versions`: CMS snapshot history for Website Studio rollback.
   - `privacy_requests`: Verified DPDP Act 2023 access, correction, deletion, consent withdrawal, and grievance records.
   - `security_events`: Structured authentication and session telemetry.
   - `notification_outbox`: Durable communication status tracking (`queued`, `attempted`, `accepted`, `failed`).
3. **Row-Level Security (RLS)**:
   - RLS enabled on all 6 new tables.
   - All privileges revoked from `anon` and `authenticated` on private operational tables.
   - Explicit read-only `SELECT` policy on `job_positions` ONLY where `status = 'published'`.

## 3. Execution Procedure (Staging First)
1. Back up the target Supabase database before applying migrations.
2. Verify `supabase/setup_new_project.sql` has been executed on the target project (note: build verification detected `public.site_content` was not yet present in the current `.env.local` Supabase instance).
3. Open **Supabase Dashboard → SQL Editor** (or connect via `psql`).
4. Execute `supabase/migrations/20261126_v2_enterprise_schema.sql`.
5. Confirm PostgREST schema reload (`notify pgrst, 'reload schema'`).
6. Verify health in Vanikara Console → **System Health**.

## 4. Rollback & Recovery
Because V2 uses additive `ADD COLUMN IF NOT EXISTS` and `CREATE TABLE IF NOT EXISTS` statements, existing V1 data is never altered or dropped. If rollback is required, revert application code to the previous Git tag while retaining the additive tables (no destructive `DROP TABLE` is recommended in production).
