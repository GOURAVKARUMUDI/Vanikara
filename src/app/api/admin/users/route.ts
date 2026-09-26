export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { apiResponse, logError, isTrustedOrigin } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";
import { z } from "zod";

const patchSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["user", "admin"]),
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    // The req parameter is not present in GET, but we can't get IP easily without it or headers().
    // We will extract headers from next/headers.

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { data, error } = await supabaseService
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Admin Users GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const validation = patchSchema.safeParse(await req.json());
    if (!validation.success) {
      return NextResponse.json(apiResponse(false, null, "Invalid request parameters"), { status: 400 });
    }
    const { id, role } = validation.data;

    const { data: previousState } = await supabaseService.from("users").select("*").eq("id", id).single();

    const { data, error } = await supabaseService
      .from("users")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "UPDATE_USER_ROLE", id, { previousState, newState: data });
    return NextResponse.json(apiResponse(true, data));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Admin Users PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
