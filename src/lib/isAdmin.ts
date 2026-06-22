export const isAdmin = (emailOrUser: any): boolean => {
  if (!emailOrUser) return false;

  // We no longer rely on email hardcoding.
  // The user object MUST contain the role either in user_metadata or directly on the object.
  if (typeof emailOrUser === "object") {
    if (emailOrUser.user_metadata?.role === "admin") return true;
    if (emailOrUser.role === "admin") return true;
  }

  // If we only have an email string, we cannot safely authorize without a DB check,
  // so we return false for client-side optimistic checks.
  // The server will use checkIsAdminServer for authoritative validation.
  return false;
};

/**
 * Server-side strict database check for Admin privileges
 */
export async function checkIsAdminServer(supabaseClient: any, userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();
    if (error || !data) return false;
    return data.role === "admin";
  } catch {
    return false;
  }
}
