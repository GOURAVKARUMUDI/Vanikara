export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import { apiResponse, logError, isTrustedOrigin } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";
import { z } from "zod";

/**
 * Google-account users (people who signed in on the website).
 * Admins can see them and block or unblock them. There is deliberately no
 * way to promote a user to admin: admin access comes only from the fixed
 * admin accounts configured on the server.
 */
const patchSchema = z.object({
  id: z.string().uuid(),
  blocked: z.boolean(),
});

const PUBLIC_FIELDS = "id, email, name, avatar_url, provider, blocked, created_at, last_sign_in_at";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { data, error } = await supabaseService
      .from("users")
      .select(PUBLIC_FIELDS)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  } catch (error) {
    logError("Admin Users GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }

    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const validation = patchSchema.safeParse(await req.json().catch(() => null));
    if (!validation.success) {
      return NextResponse.json(apiResponse(false, null, "Invalid request parameters"), { status: 400 });
    }
    const { id, blocked } = validation.data;

    const { data, error } = await supabaseService
      .from("users")
      .update({ blocked })
      .eq("id", id)
      .select(PUBLIC_FIELDS)
      .single();

    if (error) throw error;
    await logAdminAction(admin.u, blocked ? "BLOCK_USER" : "UNBLOCK_USER", id, { email: data?.email });
    return NextResponse.json(apiResponse(true, data));
  } catch (error) {
    logError("Admin Users PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
