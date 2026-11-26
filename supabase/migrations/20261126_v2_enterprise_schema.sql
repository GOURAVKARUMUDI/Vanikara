-- =============================================================================
-- VANIKARA V2 — ENTERPRISE SCHEMA MIGRATION
-- Safe, non-destructive, idempotent migration. Preserves all existing records.
-- Run in Supabase SQL Editor or via psql against staging/production.
-- =============================================================================

create extension if not exists pgcrypto;

-- 1. Extend existing tables non-destructively
alter table public.leads add column if not exists reference_code text;
alter table public.leads add column if not exists category text default 'General Enquiry';
alter table public.leads add column if not exists assigned_to text;
alter table public.leads add column if not exists internal_notes text;
create index if not exists leads_reference_code_idx on public.leads (reference_code);
create index if not exists leads_email_idx on public.leads (lower(email));

alter table public.careers_applications add column if not exists reference_code text;
alter table public.careers_applications add column if not exists internal_notes text;
alter table public.careers_applications add column if not exists job_id uuid;
create index if not exists careers_applications_reference_code_idx on public.careers_applications (reference_code);
create index if not exists careers_applications_email_idx on public.careers_applications (lower(email));

-- 2. Job Positions (genuine open roles managed in Vanikara Console)
create table if not exists public.job_positions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) <= 150),
  department text not null check (char_length(department) <= 80),
  location text not null default 'Guntur, Andhra Pradesh',
  employment_type text not null default 'Full-time',
  work_arrangement text not null default 'On-site',
  description text not null,
  responsibilities jsonb not null default '[]'::jsonb,
  required_qualifications jsonb not null default '[]'::jsonb,
  preferred_qualifications jsonb not null default '[]'::jsonb,
  application_deadline timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'archived')),
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists job_positions_status_idx on public.job_positions (status);

-- 3. Product Interest Registrations (Food Delivery Platform & future initiatives)
create table if not exists public.product_registrations (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  product text not null default 'food-delivery',
  category text not null check (category in ('restaurant', 'delivery_partner', 'customer', 'business_partner')),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 30),
  organization text check (char_length(organization) <= 150),
  city text not null default 'Guntur',
  notes text check (char_length(notes) <= 3000),
  consent_given boolean not null default true,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'archived')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists product_registrations_product_idx on public.product_registrations (product, category);
create index if not exists product_registrations_created_at_idx on public.product_registrations (created_at desc);

-- 4. CMS Content Version History (Website Studio rollback support)
create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_key text not null,
  value jsonb not null,
  saved_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists content_versions_key_idx on public.content_versions (content_key, created_at desc);

-- 5. Privacy Requests (DPDP Act 2023 access, correction, deletion, withdrawal)
create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  user_email text not null,
  request_type text not null check (request_type in ('access', 'correction', 'deletion', 'consent_withdrawal', 'grievance')),
  details text check (char_length(details) <= 3000),
  status text not null default 'received' check (status in ('received', 'verifying', 'in_progress', 'completed', 'rejected')),
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists privacy_requests_email_idx on public.privacy_requests (lower(user_email));

-- 6. Security Events (Security Centre telemetry)
create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor text,
  ip_address text,
  outcome text not null check (outcome in ('success', 'failure', 'blocked')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists security_events_created_at_idx on public.security_events (created_at desc);

-- 7. Notification Outbox (durable email/integration delivery tracking)
create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'email',
  recipient text not null,
  subject text not null,
  status text not null default 'queued' check (status in ('queued', 'attempted', 'accepted', 'failed')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notification_outbox_status_idx on public.notification_outbox (status, created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY (Strict Least Privilege)
-- =============================================================================

alter table public.job_positions          enable row level security;
alter table public.product_registrations  enable row level security;
alter table public.content_versions       enable row level security;
alter table public.privacy_requests       enable row level security;
alter table public.security_events        enable row level security;
alter table public.notification_outbox    enable row level security;

-- Revoke all anon/authenticated privileges on private operational tables
revoke all on public.product_registrations, public.content_versions, public.privacy_requests, public.security_events, public.notification_outbox from anon, authenticated;

-- Public read-only access ONLY to published job positions
revoke insert, update, delete on public.job_positions from anon, authenticated;
drop policy if exists "Public read published jobs" on public.job_positions;
create policy "Public read published jobs"
  on public.job_positions
  for select
  to anon, authenticated
  using (status = 'published');

notify pgrst, 'reload schema';
