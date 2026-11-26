export const dynamic = "force-dynamic";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import { adminHasPermission } from "@/lib/rbac";
import { sanitize, isBot, isTrustedOrigin, logError } from "@/lib/security";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";
import { okResponse, errResponse } from "@/lib/apiEnvelope";
import { logAdminAction } from "@/lib/auditLogger";

const CATEGORIES = [
  "restaurant",
  "delivery_partner",
  "customer",
  "business_partner",
  "travel_partner",
  "hotel_partner",
  "quick_commerce_partner",
  "cygma_ri_enterprise",
] as const;

const postSchema = z.object({
  product: z.string().trim().min(1).max(60).default("food-delivery"),
  category: z.enum(CATEGORIES),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(254),
  phone: z.string().trim().max(30).optional(),
  organization: z.string().trim().max(150).optional(),
  designation: z.string().trim().max(120).optional(),
  companySize: z.string().trim().max(60).optional(),
  monthlyResumeVolume: z.string().trim().max(60).optional(),
  enquiryType: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional().default("Guntur"),
  notes: z.string().trim().max(3000).optional(),
  consent: z.literal(true, { message: "Consent is required" }),
  bot: z.string().optional().default(""),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "archived"]),
});

export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) return errResponse("FORBIDDEN", "Forbidden", 403);
    if (Number(req.headers.get("content-length") ?? 0) > 16 * 1024) {
      return errResponse("PAYLOAD_TOO_LARGE", "Request too large.", 413);
    }

    const limit = await isRateLimited(clientIp(req), "contact");
    if (limit.limited) {
      return errResponse("RATE_LIMITED", "Too many submissions. Please try again later.", 429, retryAfterHeaders(limit.reset));
    }

    const body = await req.json().catch(() => null);
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return errResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message || "Invalid submission.", 400);
    }
    if (isBot(parsed.data.bot)) {
      return errResponse("BOT_DETECTED", "Request rejected.", 400);
    }

    const d = parsed.data;
    const prefix = d.category === "cygma_ri_enterprise" ? "CYG" : "REG";
    const reference = `${prefix}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const cleanName = sanitize(d.name).slice(0, 100);
    const cleanEmail = d.email.toLowerCase();
    const cleanPhone = d.phone ? sanitize(d.phone).slice(0, 30) : null;
    const cleanOrg = d.organization ? sanitize(d.organization).slice(0, 150) : null;
    const cleanDesignation = d.designation ? sanitize(d.designation).slice(0, 120) : null;
    const cleanCompanySize = d.companySize ? sanitize(d.companySize).slice(0, 60) : null;
    const cleanResumeVol = d.monthlyResumeVolume ? sanitize(d.monthlyResumeVolume).slice(0, 60) : null;
    const cleanEnquiryType = d.enquiryType ? sanitize(d.enquiryType).slice(0, 80) : null;
    const cleanCity = sanitize(d.city).slice(0, 80);
    const cleanNotes = d.notes ? sanitize(d.notes).slice(0, 3000) : null;

    const { error } = await supabaseService.from("product_registrations").insert([
      {
        reference_code: reference,
        product: sanitize(d.product).slice(0, 60),
        category: d.category,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        organization: cleanOrg,
        designation: cleanDesignation,
        company_size: cleanCompanySize,
        monthly_resume_volume: cleanResumeVol,
        enquiry_type: cleanEnquiryType,
        city: cleanCity,
        notes: cleanNotes,
        consent_given: true,
        status: "new",
      },
    ]);

    if (error) {
      // Fallback to existing leads table if V2/portfolio migration has not been applied yet
      const metaParts = [
        `[${reference}]`,
        `Product: ${d.product}`,
        `Category: ${d.category}`,
        cleanEnquiryType ? `Type: ${cleanEnquiryType}` : null,
        cleanOrg ? `Org: ${cleanOrg}` : null,
        cleanDesignation ? `Role: ${cleanDesignation}` : null,
        cleanCompanySize ? `Size: ${cleanCompanySize}` : null,
        cleanResumeVol ? `Resumes/mo: ${cleanResumeVol}` : null,
        `City: ${cleanCity}`,
        cleanPhone ? `Phone: ${cleanPhone}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const { error: leadErr } = await supabaseService.from("leads").insert([
        {
          name: cleanName,
          email: cleanEmail,
          source: `registration:${d.category}`,
          status: "new",
          message: `${metaParts}\n${cleanNotes ?? ""}`.slice(0, 5800),
        },
      ]);
      if (leadErr) {
        logError("Product registration insert failed", { error, leadErr });
        return errResponse("PERSISTENCE_ERROR", "Unable to record registration right now.", 500);
      }
    }

    return okResponse({ reference, category: d.category, product: d.product }, 201);
  } catch (err) {
    logError("POST /api/registrations", err);
    return errResponse("INTERNAL_ERROR", "Unexpected server error.", 500);
  }
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "products:read")) return errResponse("FORBIDDEN", "Insufficient permissions", 403);

  try {
    const { data, error } = await supabaseService
      .from("product_registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      return okResponse({ items: [], tableReady: false });
    }
    return okResponse({ items: data ?? [], tableReady: true });
  } catch (err) {
    logError("GET /api/registrations", err);
    return errResponse("INTERNAL_ERROR", "Failed to load registrations", 500);
  }
}

export async function PATCH(req: Request) {
  if (!isTrustedOrigin(req)) return errResponse("FORBIDDEN", "Forbidden", 403);
  const admin = await getAdminSession();
  if (!admin) return errResponse("UNAUTHORIZED", "Unauthorized", 401);
  if (!adminHasPermission(admin.u, "products:write")) return errResponse("FORBIDDEN", "Insufficient permissions", 403);

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return errResponse("VALIDATION_ERROR", "Invalid payload", 400);

  const { error } = await supabaseService
    .from("product_registrations")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  if (error) {
    logError("PATCH /api/registrations", error);
    return errResponse("DB_ERROR", "Could not update registration status", 500);
  }

  await logAdminAction(admin.u, "UPDATE_REGISTRATION_STATUS", parsed.data.id, { status: parsed.data.status });
  return okResponse({ id: parsed.data.id, status: parsed.data.status });
}
