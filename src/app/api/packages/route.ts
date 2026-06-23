export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { apiResponse, logError, sanitize } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";
import { isRateLimited } from "@/lib/rateLimit";

export async function GET() {
  try {
    const { data, error } = await supabaseService
      .from("packages")
      .select("*")
      .order("price", { ascending: true });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Packages GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = await isRateLimited(ip);
    if (rateLimit.limited) {
      return NextResponse.json(apiResponse(false, null, "Too many requests"), { status: 429 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { id, price, features } = await req.json();

    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const sFeatures = (Array.isArray(features) ? features : []).map(f => sanitize(f).slice(0, 200));

    const { data: previousState } = await supabaseService.from("packages").select("*").eq("id", id).single();

    const { data, error } = await supabaseService
      .from("packages")
      .update({ price, features: sFeatures, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "UPDATE_PACKAGE", id, { previousState, newState: data });
    return NextResponse.json(apiResponse(true, data));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Packages PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
