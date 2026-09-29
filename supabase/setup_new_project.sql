-- ============================================================
-- VANIKARA — complete database setup for a fresh Supabase project
--
-- Run once in Supabase → SQL Editor (or with psql). Safe to re-run:
-- every statement is idempotent.
--
-- Security model (matches the app since the admin-only sign-in):
--   * The website has NO public accounts. Admins sign in through the
--     app's own login (ADMIN_ACCOUNTS), not Supabase Auth.
--   * The server reaches the database with the SERVICE ROLE key, which
--     bypasses RLS. The browser only ever holds the public ANON key.
--   * Therefore every private table has RLS ENABLED and NO policy for
--     anon/authenticated: the public key can read or write nothing.
--   * Only genuinely public content (packages, projects, products,
--     cookie-policy text) is readable with the anon key — and never
--     writable.
--   * Résumés live in a PRIVATE storage bucket; the app shares them with
--     admins through short-lived signed links.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- CRM ----------------------------------------------------------

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 254),
  message text check (char_length(message) <= 6000),
  source text not null default 'form' check (char_length(source) <= 50),
  status text not null default 'new' check (char_length(status) <= 50),
  created_at timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric not null check (price >= 0),
  features jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  project_status text not null default 'pending',
  package_id uuid references public.packages(id) on delete set null,
  amount numeric not null default 0 check (amount >= 0),
  payment_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  amount numeric not null check (amount >= 0),
  currency text not null default 'INR',
  status text not null default 'pending',
  method text not null default 'razorpay',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  updated_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists payments_status_idx on public.payments (status);

-- ---------- Content -------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  tag text not null,
  tagline text not null,
  mockup_url text,
  problem text not null,
  solution text not null,
  stack text[] not null default '{}',
  status text not null default 'idea' check (status in ('idea', 'development', 'testing', 'completed')),
  progress numeric not null default 0 check (progress between 0 and 100),
  future_plans text,
  explore_href text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  description text not null,
  features text[] not null default '{}',
  tech text[] not null default '{}',
  availability text not null default 'concept' check (availability in ('concept', 'development', 'beta', 'live')),
  mockup_url text,
  explore_href text,
  created_at timestamptz not null default now()
);

-- ---------- Hiring ---------------------------------------------------------

create table if not exists public.careers_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  position text not null,
  cover_letter text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'shortlisted', 'rejected')),
  resume_url text,
  created_at timestamptz not null default now()
);

-- ---------- Administration --------------------------------------------------

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,          -- admin username
  action text not null,
  target_id text,
  details text,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_logs_created_at_idx on public.admin_audit_logs (created_at desc);

-- People who signed in on the website with Google (Firebase Auth).
-- Written only by the server on sign-in; shown in the admin "Users" tab,
-- where admins can block an account. A user row never grants admin
-- access — admins are the fixed accounts in the app's ADMIN_ACCOUNTS.
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text,          -- unique index below (used for upserts)
  email text not null,
  name text,
  avatar_url text,
  provider text not null default 'google',
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);
-- Upgrade path if an older users table already exists
alter table public.users add column if not exists firebase_uid text;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists provider text not null default 'google';
alter table public.users add column if not exists blocked boolean not null default false;
alter table public.users add column if not exists last_sign_in_at timestamptz;
create unique index if not exists users_firebase_uid_key on public.users (firebase_uid);
create index if not exists users_email_idx on public.users (email);

create table if not exists public.privacy_config (
  id int primary key default 1 check (id = 1),
  current_version text not null default '1.0.0',
  policy_text text not null,
  optional_services jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- Repair: bring tables created by older scripts up to date -------
-- `create table if not exists` never alters an existing table, so add any
-- column or relationship the app needs that an earlier schema lacked.

alter table public.leads add column if not exists source text not null default 'form';
alter table public.leads add column if not exists status text not null default 'new';

alter table public.clients add column if not exists phone text;
alter table public.clients add column if not exists project_status text not null default 'pending';
alter table public.clients add column if not exists package_id uuid;
alter table public.clients add column if not exists amount numeric not null default 0;
alter table public.clients add column if not exists payment_status text not null default 'pending';

alter table public.payments add column if not exists client_id uuid;
alter table public.payments add column if not exists razorpay_order_id text;
alter table public.payments add column if not exists razorpay_payment_id text;
alter table public.payments add column if not exists razorpay_signature text;
alter table public.payments add column if not exists updated_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.clients'::regclass and contype = 'f' and confrelid = 'public.packages'::regclass
  ) then
    alter table public.clients
      add constraint clients_package_id_fkey foreign key (package_id) references public.packages(id) on delete set null;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.payments'::regclass and contype = 'f' and confrelid = 'public.clients'::regclass
  ) then
    alter table public.payments
      add constraint payments_client_id_fkey foreign key (client_id) references public.clients(id) on delete set null;
  end if;
end $$;

-- Older users tables tied rows to Supabase Auth and required a role; the
-- site now records Google (Firebase) accounts instead.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'users' and column_name = 'id' and column_default is null) then
    alter table public.users alter column id set default gen_random_uuid();
  end if;
  if exists (select 1 from pg_constraint where conname = 'users_id_fkey' and conrelid = 'public.users'::regclass) then
    alter table public.users drop constraint users_id_fkey;
  end if;
end $$;
alter table public.users add column if not exists name text;
drop trigger if exists sync_user_role_trigger on public.users;

-- ---------- Row Level Security ---------------------------------------------

alter table public.leads                enable row level security;
alter table public.packages             enable row level security;
alter table public.clients              enable row level security;
alter table public.payments             enable row level security;
alter table public.projects             enable row level security;
alter table public.products             enable row level security;
alter table public.careers_applications enable row level security;
alter table public.admin_audit_logs     enable row level security;
alter table public.users                enable row level security;
alter table public.privacy_config       enable row level security;

-- Private tables: remove any policy that might grant the public key access
-- (e.g. from an older schema). With RLS on and no policies, anon and
-- authenticated see nothing; the server's service role still has full access.
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['leads', 'clients', 'payments', 'careers_applications', 'admin_audit_logs', 'users'] loop
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy if exists %I on public.%I', p.policyname, t);
    end loop;
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- Public, read-only content
drop policy if exists "Public read packages" on public.packages;
create policy "Public read packages" on public.packages for select to anon, authenticated using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects for select to anon, authenticated using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select to anon, authenticated using (true);

drop policy if exists "Public read privacy_config" on public.privacy_config;
create policy "Public read privacy_config" on public.privacy_config for select to anon, authenticated using (true);

revoke insert, update, delete on public.packages, public.projects, public.products, public.privacy_config from anon, authenticated;

-- ---------- Seed data --------------------------------------------------------

insert into public.packages (name, price, features) values
  ('basic', 5000, '["1 Page", "Contact Form", "Standard SEO"]'),
  ('standard', 15000, '["5 Pages", "Blog Setup", "Basic E-commerce"]'),
  ('premium', 30000, '["Unlimited Pages", "Custom Dashboard", "Advanced SEO"]')
on conflict (name) do nothing;

insert into public.privacy_config (id, current_version, policy_text, optional_services, stats) values (
  1,
  '1.0.0',
  'We use essential cookies to operate our website and, with your permission, optional cookies to understand how it is used.',
  '{"googleAnalytics": true, "facebookPixel": false, "hotjar": false}',
  '{"totalVisits": 0, "acceptedAll": 0, "rejectedOptional": 0, "customized": 0, "analyticsAccepted": 0, "marketingAccepted": 0, "preferencesAccepted": 0}'
) on conflict (id) do nothing;

-- ---------- Storage: private résumé bucket -----------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes', 'resumes', false, 5242880,
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
-- No storage policies are created for 'resumes': only the service role
-- (the app's server) can upload or read, and admins get signed links.

-- ---------- Make the API see the changes immediately ------------------------
notify pgrst, 'reload schema';
