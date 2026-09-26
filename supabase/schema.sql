-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create files table
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ai_logs table
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin bypassing RLS recursion
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id UUID)
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- Policies for users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- role must start as 'user' (or unset) — never settable to 'admin' at signup.
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id AND (role IS NULL OR role = 'user'));
CREATE POLICY "Admins can view all profiles" ON public.users FOR ALL USING (
  public.check_is_admin(auth.uid())
);

-- Column-level privileges: RLS above governs which ROWS are touched; this
-- governs which COLUMNS. A user may only ever change their own `name` —
-- never `role`, never anyone else's row. Role changes go through the
-- admin API using the service-role client, which bypasses RLS/grants.
REVOKE UPDATE, INSERT ON public.users FROM authenticated;
GRANT UPDATE (name) ON public.users TO authenticated;
GRANT INSERT (id, email) ON public.users TO authenticated;

-- Policies for subscriptions
-- Regular users may only ever SELECT their own subscription. Entitlements
-- (plan/status/trial dates) are provisioned and changed exclusively by the
-- service-role client (see src/app/auth/callback/route.ts and the admin
-- API) — there is deliberately no user-facing INSERT/UPDATE policy.
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
REVOKE INSERT, UPDATE ON public.subscriptions FROM authenticated;

-- Policies for files
CREATE POLICY "Users can manage their own files" ON public.files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all files" ON public.files FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies for ai_logs
CREATE POLICY "Users can view their own ai_logs" ON public.ai_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ai_logs" ON public.ai_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all ai_logs" ON public.ai_logs FOR ALL USING (
  public.check_is_admin(auth.uid())
);

-- Create privacy_config table
CREATE TABLE IF NOT EXISTS public.privacy_config (
  id INT PRIMARY KEY DEFAULT 1,
  current_version TEXT NOT NULL DEFAULT '1.0.0',
  policy_text TEXT NOT NULL,
  optional_services JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS for privacy_config
ALTER TABLE public.privacy_config ENABLE ROW LEVEL SECURITY;

-- Policies for privacy_config
CREATE POLICY "Public can select privacy_config" ON public.privacy_config FOR SELECT USING (true);
CREATE POLICY "Admins can manage privacy_config" ON public.privacy_config FOR ALL USING (
  public.check_is_admin(auth.uid())
);

-- Sync public.users role changes to auth.users raw_app_meta_data.
--
-- IMPORTANT: this writes app_metadata, not user_metadata. user_metadata
-- (raw_user_meta_data) can be overwritten by the signed-in user themselves
-- via `supabase.auth.updateUser({ data })` and is never a valid
-- authorization source. app_metadata can only be written by the service
-- role, which is exactly why src/lib/isAdmin.ts checks it exclusively.
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER sync_user_role_trigger
AFTER INSERT OR UPDATE OF role ON public.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_role();

