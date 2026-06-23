export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { apiResponse, logError } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { data, error } = await supabaseService
      .from("careers_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Admin Careers GET", error);
    return NextResponse.json(apiResponse(false, null, "Failed to retrieve careers applications"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json(apiResponse(false, null, "Missing required parameters"), { status: 400 });
    }

    const { data: previousState } = await supabaseService.from("careers_applications").select("*").eq("id", id).single();

    const { data, error } = await supabaseService
      .from("careers_applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "UPDATE_CAREER_APPLICATION", id, { previousState, newState: data });
    return NextResponse.json(apiResponse(true, data));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Admin Careers PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
