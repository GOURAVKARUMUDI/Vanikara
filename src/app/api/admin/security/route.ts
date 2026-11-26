export const dynamic = "force-dynamic";

import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import { adminHasPermission, resolveAdminRole } from "@/lib/rbac";
import { okResponse, errResponse } from "@/lib/apiEnvelope";
import { logError } from "@/lib/security";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "security:read")) return errResponse("FORBIDDEN", "Insufficient permissions", 403);

  try {
    const [auditRes, blockedRes] = await Promise.all([
      supabaseService
        .from("admin_audit_logs")
        .select("id, admin_email, action, target_id, details, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseService
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("blocked", true),
    ]);

    const warnings: { level: "warning" | "info"; title: string; detail: string }[] = [];

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      warnings.push({
        level: "warning",
        title: "Distributed rate limiting not configured",
        detail: "Upstash Redis credentials are missing. Rate limiting currently runs per serverless instance in memory.",
      });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      warnings.push({
        level: "info",
        title: "Online payments intentionally disabled",
        detail: "Razorpay API keys are not configured; /api/payment returns 503 safely.",
      });
    }
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      warnings.push({
        level: "warning",
        title: "Outbound SMTP email disabled",
        detail: "SMTP credentials are missing. Submissions are persisted, but notification emails cannot be dispatched.",
      });
    }

    return okResponse({
      currentAdmin: {
        username: admin.u,
        role: resolveAdminRole(admin.u),
        sessionExpiresAt: admin.exp,
      },
      blockedUsersCount: blockedRes.count ?? 0,
      auditLogs: auditRes.data ?? [],
      warnings,
    });
  } catch (err) {
    logError("GET /api/admin/security", err);
    return errResponse("INTERNAL_ERROR", "Could not load security diagnostics", 500);
  }
}
