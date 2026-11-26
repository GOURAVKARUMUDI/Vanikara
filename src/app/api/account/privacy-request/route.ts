export const dynamic = "force-dynamic";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { supabaseService } from "@/utils/supabase/service";
import { getUserSession } from "@/lib/adminAuth";
import { isTrustedOrigin, logError, sanitize } from "@/lib/security";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";
import { okResponse, errResponse } from "@/lib/apiEnvelope";

const schema = z.object({
  requestType: z.enum(["access", "correction", "deletion", "consent_withdrawal", "grievance"]),
  details: z.string().trim().max(2500).optional().default(""),
});

export async function POST(req: Request) {
  if (!isTrustedOrigin(req)) return errResponse("FORBIDDEN", "Forbidden", 403);

  const user = await getUserSession();
  if (!user) return errResponse("UNAUTHORIZED", "Please sign in to submit a verified privacy request.", 401);

  const limit = await isRateLimited(clientIp(req), "contact");
  if (limit.limited) {
    return errResponse("RATE_LIMITED", "Too many requests. Please try again later.", 429, retryAfterHeaders(limit.reset));
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return errResponse("VALIDATION_ERROR", "Invalid privacy request.", 400);
  }

  const reference = `PRV-${randomBytes(3).toString("hex").toUpperCase()}`;
  const cleanDetails = sanitize(parsed.data.details).slice(0, 2500);

  const { error } = await supabaseService.from("privacy_requests").insert([
    {
      reference_code: reference,
      user_email: user.email.toLowerCase().trim(),
      request_type: parsed.data.requestType,
      details: cleanDetails,
      status: "received",
    },
  ]);

  if (error) {
    // Graceful fallback to leads table if V2 migration not yet run
    const { error: fallbackErr } = await supabaseService.from("leads").insert([
      {
        name: sanitize(user.name).slice(0, 100),
        email: user.email.toLowerCase().trim(),
        source: `privacy:${parsed.data.requestType}`,
        status: "new",
        message: `[${reference}] Privacy Request (${parsed.data.requestType}): ${cleanDetails}`,
      },
    ]);
    if (fallbackErr) {
      logError("POST /api/account/privacy-request", { error, fallbackErr });
      return errResponse("PERSISTENCE_ERROR", "Unable to record privacy request right now.", 500);
    }
  }

  return okResponse({ reference, status: "received" }, 201);
}
