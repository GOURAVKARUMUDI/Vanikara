export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { apiResponse, logError, sanitize } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";

export async function GET() {
  try {
    const { data, error } = await supabaseService
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  } catch (error: any) {
    logError("Admin Products GET", error);
    return NextResponse.json(apiResponse(false, null, "Database error: " + error.message), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const { name, category, description, availability, tech, features } = body;

    if (!name || !category) {
      return NextResponse.json(apiResponse(false, null, "Missing parameters"), { status: 400 });
    }

    const { data, error } = await supabaseService
      .from("products")
      .insert([
        {
          name: sanitize(name),
          category: sanitize(category),
          description: sanitize(description || ""),
          availability: availability || "concept",
          tech: Array.isArray(tech) ? tech : [],
          features: Array.isArray(features) ? features : [],
        }
      ])
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "CREATE_PRODUCT", data.id, { newState: data });
    return NextResponse.json(apiResponse(true, data));
  } catch (error: any) {
    logError("Products POST", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const { id, name, category, description, availability, tech, features } = body;

    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const { data: previousState } = await supabaseService.from("products").select("*").eq("id", id).single();

    const { data, error } = await supabaseService
      .from("products")
      .update({
        name: name ? sanitize(name) : undefined,
        category: category ? sanitize(category) : undefined,
        description: description ? sanitize(description) : undefined,
        availability: availability || undefined,
        tech: Array.isArray(tech) ? tech : undefined,
        features: Array.isArray(features) ? features : undefined,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "UPDATE_PRODUCT", id, { previousState, newState: data });
    return NextResponse.json(apiResponse(true, data));
  } catch (error: any) {
    logError("Products PUT", error);
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const { data: previousState } = await supabaseService.from("products").select("*").eq("id", id).single();

    const { error } = await supabaseService
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await logAdminAction(user.email || user.id, "DELETE_PRODUCT", id, { previousState });
    return NextResponse.json(apiResponse(true, { success: true }));
  } catch (error: any) {
    logError("Products DELETE", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
