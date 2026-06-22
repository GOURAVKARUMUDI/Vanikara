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
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  } catch (error: any) {
    logError("Admin Projects GET", error);
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
    const { title, tag, tagline, problem, solution, progress, stack } = body;

    if (!title || !tag || !tagline) {
      return NextResponse.json(apiResponse(false, null, "Missing parameters"), { status: 400 });
    }

    const { data, error } = await supabaseService
      .from("projects")
      .insert([
        {
          title: sanitize(title),
          tag: sanitize(tag),
          tagline: sanitize(tagline),
          problem: sanitize(problem || ""),
          solution: sanitize(solution || ""),
          progress: Number(progress) || 0,
          stack: Array.isArray(stack) ? stack : [],
        }
      ])
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "CREATE_PROJECT", data.id, { newState: data });
    return NextResponse.json(apiResponse(true, data));
  } catch (error: any) {
    logError("Projects POST", error);
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
    const { id, title, tag, tagline, problem, solution, progress, stack } = body;

    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const { data: previousState } = await supabaseService.from("projects").select("*").eq("id", id).single();

    const { data, error } = await supabaseService
      .from("projects")
      .update({
        title: title ? sanitize(title) : undefined,
        tag: tag ? sanitize(tag) : undefined,
        tagline: tagline ? sanitize(tagline) : undefined,
        problem: problem ? sanitize(problem) : undefined,
        solution: solution ? sanitize(solution) : undefined,
        progress: progress !== undefined ? Number(progress) : undefined,
        stack: Array.isArray(stack) ? stack : undefined,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await logAdminAction(user.email || user.id, "UPDATE_PROJECT", id, { previousState, newState: data });
    return NextResponse.json(apiResponse(true, data));
  } catch (error: any) {
    logError("Projects PUT", error);
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

    const { data: previousState } = await supabaseService.from("projects").select("*").eq("id", id).single();

    const { error } = await supabaseService
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await logAdminAction(user.email || user.id, "DELETE_PROJECT", id, { previousState });

    return NextResponse.json(apiResponse(true, { success: true }));
  } catch (error: any) {
    logError("Projects DELETE", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
