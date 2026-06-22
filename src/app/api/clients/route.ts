export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sanitize, apiResponse, logError } from "@/lib/security";
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
      .from("clients")
      .select(`
        *,
        packages (
          name,
          price
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  } catch (error: any) {
    logError("Clients GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
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

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    // Sanitize relevant fields
    if (updates.name) updates.name = sanitize(updates.name).slice(0, 100);

    const { data: previousState } = await supabaseService.from("clients").select("*").eq("id", id).single();

    const { data, error } = await supabaseService
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "UPDATE_CLIENT", id, { previousState, newState: data });
    return NextResponse.json(apiResponse(true, data));
  } catch (error: any) {
    logError("Clients PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const { data: previousState } = await supabaseService.from("clients").select("*").eq("id", id).single();

    const { error } = await supabaseService
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await logAdminAction(user.email || user.id, "DELETE_CLIENT", id, { previousState });
    return NextResponse.json(apiResponse(true, { success: true }));
  } catch (error: any) {
    logError("Clients DELETE", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
