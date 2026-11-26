export const dynamic = "force-dynamic";

import { supabaseService } from "@/utils/supabase/service";
import { getUserSession } from "@/lib/adminAuth";
import { okResponse, errResponse } from "@/lib/apiEnvelope";
import { logError } from "@/lib/security";

/**
 * Returns ONLY the authenticated public user's own applications, enquiries,
 * and privacy requests, strictly scoped to their verified session email.
 * Never returns internal HR notes, admin notes, or raw storage paths.
 */
export async function GET() {
  const user = await getUserSession();
  if (!user) return errResponse("UNAUTHORIZED", "Please sign in to view your records.", 401);

  try {
    // Verify the account has not been blocked since the session cookie was issued
    const { data: userRow } = await supabaseService
      .from("users")
      .select("blocked")
      .eq("email", user.email)
      .maybeSingle();

    if (userRow?.blocked) {
      return errResponse("ACCOUNT_BLOCKED", "This account has been suspended. Contact support for assistance.", 403);
    }

    const email = user.email.toLowerCase().trim();

    const [appsRes, leadsRes, privacyRes] = await Promise.all([
      supabaseService
        .from("careers_applications")
        .select("id, position, application_type, status, created_at")
        .ilike("email", email)
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseService
        .from("leads")
        .select("id, source, status, created_at")
        .ilike("email", email)
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseService
        .from("privacy_requests")
        .select("id, reference_code, request_type, status, created_at")
        .ilike("user_email", email)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    return okResponse(
      {
        profile: {
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
        applications: appsRes.data ?? [],
        enquiries: leadsRes.data ?? [],
        privacyRequests: privacyRes.error ? [] : (privacyRes.data ?? []),
      },
      200,
      { "Cache-Control": "no-store" }
    );
  } catch (err) {
    logError("GET /api/account/records", err);
    return errResponse("INTERNAL_ERROR", "Unable to load account records.", 500);
  }
}
