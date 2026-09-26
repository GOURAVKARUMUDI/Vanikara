-- VANIKARA — Security hardening migration
--
-- Fixes two confirmed privilege-escalation paths and one data-integrity bug:
--
--   A) Any authenticated user could become an admin by calling
--      `supabase.auth.updateUser({ data: { role: 'admin' } })` from the
--      browser. `user_metadata` (raw_user_meta_data) is writable by the
--      user themselves via the GoTrue API — it is NOT protected by RLS,
--      so no Postgres policy could ever have closed this. The only fix is
--      to stop trusting it. Authorization now reads `app_metadata`
--      (raw_app_meta_data), which only the service role / Admin API can
--      write. See src/lib/isAdmin.ts.
--
--   B) The RLS policies "Users can update their own profile" and
--      "Users can insert/update their own subscriptions" had no WITH CHECK
--      restricting *which* columns could change, so a user could directly
--      set their own `users.role` or `subscriptions.plan` via the
--      Supabase client, bypassing the admin API entirely.
--
--   C) auth/callback/route.ts is now fixed in code to stop resetting an
--      existing subscription on every login (see that file). This
--      migration also backfills app_metadata for any user whose role was
--      only ever recorded in public.users.
--
-- Safe to run multiple times.

-- ---------------------------------------------------------------------
-- 1. Move the authoritative role signal to app_metadata.
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS sync_user_role_trigger ON public.users;
CREATE TRIGGER sync_user_role_trigger
AFTER INSERT OR UPDATE OF role ON public.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_role();

-- Backfill: make sure every existing user's app_metadata.role matches the
-- authoritative public.users.role right now (don't wait for their next
-- role change to pick this up).
UPDATE auth.users u
SET raw_app_meta_data =
  coalesce(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', p.role)
FROM public.users p
WHERE p.id = u.id;

-- Defense in depth: strip any `role` key a user may have previously
-- granted themselves via updateUser() before this fix shipped. It was
-- never authoritative (isAdmin no longer reads user_metadata), but there
-- is no reason to leave it lying around.
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE raw_user_meta_data ? 'role';

-- ---------------------------------------------------------------------
-- 2. public.users — allow the profile-name edit feature, block role/email.
-- ---------------------------------------------------------------------

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id AND (role IS NULL OR role = 'user'));

-- Column-level privileges are the actual enforcement: RLS above governs
-- *which rows*, this governs *which columns*. A user can only ever set
-- their own name — never role, and never someone else's row.
REVOKE UPDATE, INSERT ON public.users FROM authenticated;
GRANT UPDATE (name) ON public.users TO authenticated;
GRANT INSERT (id, email) ON public.users TO authenticated;

-- ---------------------------------------------------------------------
-- 3. public.subscriptions — entitlements are never user-writable.
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;

-- Only SELECT (existing policy) remains for regular users. All writes
-- (provisioning, plan changes) go through the service-role client.
REVOKE INSERT, UPDATE ON public.subscriptions FROM authenticated;
