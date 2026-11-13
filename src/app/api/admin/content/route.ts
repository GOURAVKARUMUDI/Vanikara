export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { apiResponse, isTrustedOrigin, logError } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";
import { getContentStateFresh, resetContentGroup, saveContentGroup } from "@/lib/content";
import { CONTENT_DEFAULTS, CONTENT_KEYS, type ContentKey } from "@/content/defaults";
import { CONTENT_GROUPS } from "@/content/schema";
import { ContentValidationError } from "@/content/validate";

/**
 * Admin website-content editor.
 *   GET    — groups, defaults, current values and which groups are customised
 *   PUT    — save one group: { key, value }  (validated against its default)
 *   DELETE — ?key=…  restore one group to its default
 * Changes are live on the website immediately.
 */

const keySchema = z.enum(CONTENT_KEYS as [ContentKey, ...ContentKey[]]);
const putSchema = z.object({ key: keySchema, value: z.unknown() });

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

  const state = await getContentStateFresh();
  return NextResponse.json(
    apiResponse(true, {
      groups: CONTENT_GROUPS,
      defaults: CONTENT_DEFAULTS,
      current: state.content,
      overrides: state.overrides,
      storeReady: state.storeReady,
    }),
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(req: Request) {
  try {
    if (!isTrustedOrigin(req)) return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

    if (Number(req.headers.get("content-length") ?? 0) > 256 * 1024) {
      return NextResponse.json(apiResponse(false, null, "Content is too large"), { status: 413 });
    }
    const parsed = putSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json(apiResponse(false, null, "Invalid request"), { status: 400 });

    const saved = await saveContentGroup(parsed.data.key, parsed.data.value, admin.u);
    await logAdminAction(admin.u, "UPDATE_SITE_CONTENT", parsed.data.key, { key: parsed.data.key });
    return NextResponse.json(apiResponse(true, saved));
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return NextResponse.json(apiResponse(false, null, error.message), { status: 400 });
    }
    logError("Admin content PUT", error);
    const missingTable = /site_content|PGRST205|42P01/i.test(String((error as { message?: string; code?: string })?.message ?? "") + String((error as { code?: string })?.code ?? ""));
    return NextResponse.json(
      apiResponse(false, null, missingTable ? "The content table doesn't exist yet — run supabase/setup_new_project.sql." : "Could not save. Please try again."),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isTrustedOrigin(req)) return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    const admin = await getAdminSession();
    if (!admin) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

    const key = keySchema.safeParse(new URL(req.url).searchParams.get("key"));
    if (!key.success) return NextResponse.json(apiResponse(false, null, "Unknown content group"), { status: 400 });

    await resetContentGroup(key.data);
    await logAdminAction(admin.u, "RESET_SITE_CONTENT", key.data, { key: key.data });
    return NextResponse.json(apiResponse(true, CONTENT_DEFAULTS[key.data]));
  } catch (error) {
    logError("Admin content DELETE", error);
    return NextResponse.json(apiResponse(false, null, "Could not reset. Please try again."), { status: 500 });
  }
}
