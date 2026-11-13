export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import { apiResponse, isTrustedOrigin, logError } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";

/**
 * Job applications for the admin dashboard.
 *   GET    — newest first, each with a short-lived (1 hour) résumé link
 *   PATCH  — { id, status }
 *   DELETE — ?id=…  (also deletes the stored résumé)
 */

const STATUSES = ["new", "reviewing", "shortlisted", "rejected"] as const;
const patchSchema = z.object({ id: z.string().uuid(), status: z.enum(STATUSES) });

/** Résumé path for a row: newer rows use resume_path; older ones stored it in resume_url. */
function storagePath(row: Record<string, unknown>): string | null {
  const path = (row.resume_path as string | undefined) ?? (row.resume_url as string | undefined) ?? null;
  if (!path) return null;
  if (/^https?:\/\//.test(path)) {
    // Legacy signed URL: recover the object path from it
    const match = path.match(/\/resumes\/([^?]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  return path;
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

  try {
    const { data, error } = await supabaseService
      .from("careers_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;

    const rows = await Promise.all(
      (data ?? []).map(async (row: Record<string, unknown>) => {
        const path = storagePath(row);
        let resumeLink: string | null = null;
        if (path) {
          const { data: signed } = await supabaseService.storage.from("resumes").createSignedUrl(path, 60 * 60);
          resumeLink = signed?.signedUrl ?? null;
        }
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: (row.phone as string) ?? null,
          position: row.position,
          applicationType: (row.application_type as string) ?? null,
          portfolio: (row.portfolio_url as string) ?? null,
          coverLetter: row.cover_letter,
          status: row.status,
          createdAt: row.created_at,
          resumeLink,
        };
      })
    );
    return NextResponse.json(apiResponse(true, rows), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logError("Admin applications GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isTrustedOrigin(req)) return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

    const parsed = patchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json(apiResponse(false, null, "Invalid request"), { status: 400 });

    const { error } = await supabaseService.from("careers_applications").update({ status: parsed.data.status }).eq("id", parsed.data.id);
    if (error) throw error;
    await logAdminAction(admin.u, "UPDATE_APPLICATION_STATUS", parsed.data.id, { status: parsed.data.status });
    return NextResponse.json(apiResponse(true, parsed.data));
  } catch (error) {
    logError("Admin applications PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isTrustedOrigin(req)) return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

    const id = z.string().uuid().safeParse(new URL(req.url).searchParams.get("id"));
    if (!id.success) return NextResponse.json(apiResponse(false, null, "Invalid id"), { status: 400 });

    const { data: row } = await supabaseService.from("careers_applications").select("*").eq("id", id.data).maybeSingle();
    const { error } = await supabaseService.from("careers_applications").delete().eq("id", id.data);
    if (error) throw error;
    const path = row ? storagePath(row) : null;
    if (path) await supabaseService.storage.from("resumes").remove([path]);

    await logAdminAction(admin.u, "DELETE_APPLICATION", id.data, { email: row?.email });
    return NextResponse.json(apiResponse(true, { deleted: true }));
  } catch (error) {
    logError("Admin applications DELETE", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
