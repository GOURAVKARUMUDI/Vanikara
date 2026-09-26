// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAdmin = (user: any): boolean => {
  if (!user || typeof user !== "object") return false;

  // Authorization MUST be derived from app_metadata only.
  //
  // Supabase's `user_metadata` (raw_user_meta_data) is writable by the
  // signed-in user themselves via `supabase.auth.updateUser({ data })` —
  // trusting it here would let any authenticated user grant themselves
  // admin from the browser console. `app_metadata` (raw_app_meta_data) can
  // only be written by the service role / Admin API, so it is the sole
  // authoritative source. It is kept in sync with public.users.role by a
  // database trigger (see supabase/2026_security_hardening.sql).
  return user.app_metadata?.role === "admin";
};
