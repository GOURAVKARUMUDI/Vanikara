-- =============================================================================
-- VANIKARA — PUBLIC SERVICE AVAILABILITY
-- Idempotent. Every public submission service starts DISABLED. An authorised
-- administrator enables a service only after its SMTP and submission workflow
-- has been verified. Historical enquiry records are not touched.
-- =============================================================================

create table if not exists public.service_availability (
  service text primary key check (service in (
    'contact',
    'business_enquiries',
    'enterprise_enquiries',
    'restaurant_partnerships',
    'demo_requests',
    'career_applications',
    'newsletter',
    'telephone_support',
    'public_office_map',
    'recruitment'
  )),
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Seed one row per service, disabled. Re-running never flips an existing setting.
insert into public.service_availability (service, enabled)
values
  ('contact', false),
  ('business_enquiries', false),
  ('enterprise_enquiries', false),
  ('restaurant_partnerships', false),
  ('demo_requests', false),
  ('career_applications', false),
  ('newsletter', false),
  ('telephone_support', false),
  ('public_office_map', false),
  ('recruitment', false)
on conflict (service) do nothing;

-- Server-only table, matching the rest of the schema: RLS on, no public policies.
alter table public.service_availability enable row level security;
