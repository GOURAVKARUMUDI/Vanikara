export const dynamic = "force-dynamic";

import { z } from "zod";
import { getSiteContent, getContentStateFresh, saveContentGroup } from "@/lib/content";
import { filterPublicPortfolio, type PortfolioItem } from "@/data/portfolio";
import { getAdminSession } from "@/lib/adminAuth";
import { adminHasPermission } from "@/lib/rbac";
import { isTrustedOrigin, logError, sanitize } from "@/lib/security";
import { logAdminAction } from "@/lib/auditLogger";
import { okResponse, errResponse } from "@/lib/apiEnvelope";

const updateSchema = z.object({
  id: z.string().trim().min(1).max(80),
  developmentStatus: z.string().trim().min(2).max(80).optional(),
  visibility: z.enum(["public", "internal", "draft", "archived"]).optional(),
  shortDescription: z.string().trim().min(10).max(500).optional(),
});

/**
 * GET /api/portfolio
 *   - Public default: returns ONLY items with visibility === "public".
 *     Internal-only, draft, and archived items are stripped server-side.
 *   - ?scope=admin: requires authenticated admin with products:read; returns all items.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");

  if (scope === "admin") {
    const admin = await getAdminSession();
    if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
    if (!adminHasPermission(admin.u, "products:read")) {
      return errResponse("FORBIDDEN", "Insufficient permissions", 403);
    }
    const state = await getContentStateFresh();
    return okResponse({ items: state.content.portfolio, storeReady: state.storeReady }, 200, {
      "Cache-Control": "no-store",
    });
  }

  const { portfolio } = await getSiteContent();
  return okResponse({ items: filterPublicPortfolio(portfolio) });
}

/**
 * PUT /api/portfolio
 * Updates an initiative's development status, visibility, or description live in CMS.
 */
export async function PUT(req: Request) {
  if (!isTrustedOrigin(req)) return errResponse("FORBIDDEN", "Forbidden", 403);
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "products:write")) {
    return errResponse("FORBIDDEN", "Insufficient permissions", 403);
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return errResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message || "Invalid update payload", 400);
  }

  try {
    const state = await getContentStateFresh();
    const list = [...state.content.portfolio];
    const idx = list.findIndex((item) => item.id === parsed.data.id);
    if (idx === -1) return errResponse("NOT_FOUND", "Portfolio item not found", 404);

    const updated: PortfolioItem = {
      ...list[idx],
      ...(parsed.data.developmentStatus ? { developmentStatus: sanitize(parsed.data.developmentStatus) } : {}),
      ...(parsed.data.visibility ? { visibility: parsed.data.visibility } : {}),
      ...(parsed.data.shortDescription ? { shortDescription: sanitize(parsed.data.shortDescription) } : {}),
    };
    list[idx] = updated;

    await saveContentGroup("portfolio", list, admin.u);
    await logAdminAction(admin.u, "UPDATE_PORTFOLIO_ITEM", updated.id, {
      developmentStatus: updated.developmentStatus,
      visibility: updated.visibility,
    });

    return okResponse(updated);
  } catch (err) {
    logError("PUT /api/portfolio", err);
    return errResponse("DB_ERROR", "Unable to save portfolio update. Verify site_content table exists.", 500);
  }
}
