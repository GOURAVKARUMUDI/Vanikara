export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { ALL_DISABLED, SERVICES, getAvailability, type Availability } from "@/lib/availability";
import { adminHasPermission } from "@/lib/rbac";
import { logAdminAction } from "@/lib/auditLogger";
import { apiResponse, isTrustedOrigin, logError } from "@/lib/security";
import { supabaseService } from "@/utils/supabase/service";

/**
 * Central public-service switches. Reads need settings:read; changes need
 * settings:write. Every change is written to the audit log.
 */

const patchSchema = z.object({
  service: z.enum(SERVICES),
  enabled: z.boolean(),
});

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    if (!adminHasPermission(admin.u, "settings:read")) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    const availability: Availability = await getAvailability();
    return NextResponse.json(apiResponse(true, availability));
  } catch (error) {
    logError("Availability GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    if (!adminHasPermission(admin.u, "settings:write")) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }

    const parsed = patchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(apiResponse(false, null, "Invalid request"), { status: 400 });
    }
    const { service, enabled } = parsed.data;

    const { error } = await supabaseService
      .from("service_availability")
      .upsert(
        { service, enabled, updated_at: new Date().toISOString(), updated_by: admin.u },
        { onConflict: "service" },
      );
    if (error) throw error;

    await logAdminAction(admin.u, enabled ? "ENABLE_PUBLIC_SERVICE" : "DISABLE_PUBLIC_SERVICE", service, { enabled });

    return NextResponse.json(apiResponse(true, { ...ALL_DISABLED, ...(await getAvailability()) }));
  } catch (error) {
    logError("Availability PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
