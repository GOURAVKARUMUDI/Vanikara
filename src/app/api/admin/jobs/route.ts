export const dynamic = "force-dynamic";

import { z } from "zod";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import { adminHasPermission } from "@/lib/rbac";
import { isTrustedOrigin, logError, sanitize } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";
import { okResponse, errResponse } from "@/lib/apiEnvelope";

const createSchema = z.object({
  title: z.string().trim().min(2).max(150),
  department: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120).default("Guntur, Andhra Pradesh"),
  employment_type: z.enum(["Full-time", "Internship", "Part-time", "Contract"]).default("Full-time"),
  work_arrangement: z.enum(["On-site", "Hybrid", "Remote"]).default("On-site"),
  description: z.string().trim().min(10).max(6000),
  responsibilities: z.array(z.string().trim().min(1).max(300)).optional().default([]),
  required_qualifications: z.array(z.string().trim().min(1).max(300)).optional().default([]),
  status: z.enum(["draft", "published", "closed", "archived"]).default("draft"),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "published", "closed", "archived"]),
});

function toSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "role"}-${suffix}`;
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "recruitment:read")) return errResponse("FORBIDDEN", "Insufficient permissions", 403);

  try {
    const { data, error } = await supabaseService
      .from("job_positions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return okResponse({ items: [], tableReady: false });
    return okResponse({ items: data ?? [], tableReady: true });
  } catch (err) {
    logError("GET /api/admin/jobs", err);
    return errResponse("INTERNAL_ERROR", "Failed to load job positions", 500);
  }
}

export async function POST(req: Request) {
  if (!isTrustedOrigin(req)) return errResponse("FORBIDDEN", "Forbidden", 403);
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "recruitment:write")) return errResponse("FORBIDDEN", "Insufficient permissions", 403);

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return errResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message || "Invalid job payload", 400);
  }

  const d = parsed.data;
  const slug = toSlug(d.title);

  const { data, error } = await supabaseService
    .from("job_positions")
    .insert([
      {
        slug,
        title: sanitize(d.title),
        department: sanitize(d.department),
        location: sanitize(d.location),
        employment_type: d.employment_type,
        work_arrangement: d.work_arrangement,
        description: sanitize(d.description),
        responsibilities: d.responsibilities.map((s) => sanitize(s)),
        required_qualifications: d.required_qualifications.map((s) => sanitize(s)),
        status: d.status,
        created_by: admin.u,
      },
    ])
    .select("*")
    .single();

  if (error) {
    logError("POST /api/admin/jobs", error);
    return errResponse("DB_ERROR", "Could not create job position. Ensure V2 schema migration is applied.", 500);
  }

  await logAdminAction(admin.u, "CREATE_JOB_POSITION", data.id, { title: data.title, status: data.status });
  return okResponse(data, 201);
}

export async function PATCH(req: Request) {
  if (!isTrustedOrigin(req)) return errResponse("FORBIDDEN", "Forbidden", 403);
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "recruitment:write")) return errResponse("FORBIDDEN", "Insufficient permissions", 403);

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return errResponse("VALIDATION_ERROR", "Invalid payload", 400);

  const { error } = await supabaseService
    .from("job_positions")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  if (error) {
    logError("PATCH /api/admin/jobs", error);
    return errResponse("DB_ERROR", "Could not update job status", 500);
  }

  await logAdminAction(admin.u, "UPDATE_JOB_STATUS", parsed.data.id, { status: parsed.data.status });
  return okResponse(parsed.data);
}
