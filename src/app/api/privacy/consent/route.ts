import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabaseService } from "@/utils/supabase/service";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";
import { isTrustedOrigin } from "@/lib/security";
import { z } from "zod";

const STATIC_PATH = path.join(process.cwd(), "data/privacy_config.json");

const consentSchema = z.object({
  action: z.enum(["accept_all", "reject_optional", "customize"]),
  preferences: z.object({
    analytics: z.boolean().optional(),
    marketing: z.boolean().optional(),
    preferences: z.boolean().optional(),
  }).optional(),
  _version: z.string().optional(),
});

async function getConfig() {
  try {
    const { data, error } = await supabaseService
      .from("privacy_config")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (data && !error) {
      return {
        currentVersion: data.current_version,
        policyText: data.policy_text,
        optionalServices: data.optional_services,
        stats: data.stats,
      };
    }
  } catch (err) {
    console.warn("Database check failed in consent, falling back to local file. Error:", err);
  }

  try {
    const fileContent = await fs.readFile(STATIC_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Failed to read static fallback privacy_config file in consent:", err);
    return {
      currentVersion: "1.0.0",
      policyText: "We use essential cookies to operate our website and optional cookies.",
      stats: {
        totalVisits: 0,
        acceptedAll: 0,
        rejectedOptional: 0,
        customized: 0,
        analyticsAccepted: 0,
        marketingAccepted: 0,
        preferencesAccepted: 0
      },
      optionalServices: {
        googleAnalytics: true,
        facebookPixel: false,
        hotjar: false
      }
    };
  }
}

/**
 * Public, read-only policy configuration for the consent banner.
 * Statistics are never included here (admins read them via /api/admin/privacy).
 */
export async function GET() {
  try {
    const config = await getConfig();
    return NextResponse.json({
      success: true,
      data: {
        currentVersion: config.currentVersion,
        policyText: config.policyText,
        optionalServices: config.optionalServices,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Rate limiting
    const limitCheck = await isRateLimited(clientIp(req), "consent");
    if (limitCheck.limited) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429, headers: retryAfterHeaders(limitCheck.reset) });
    }

    // Input validation
    const body = await req.json().catch(() => null);
    const validation = consentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    const { action, preferences } = validation.data;

    // 1. Read existing config
    const config = await getConfig();

    // 2. Increment aggregate stats based on user choice
    config.stats.totalVisits += 1;

    if (action === "accept_all") {
      config.stats.acceptedAll += 1;
      config.stats.analyticsAccepted += 1;
      config.stats.marketingAccepted += 1;
      config.stats.preferencesAccepted += 1;
    } else if (action === "reject_optional") {
      config.stats.rejectedOptional += 1;
    } else {
      config.stats.customized += 1;
      if (preferences?.analytics) config.stats.analyticsAccepted += 1;
      if (preferences?.marketing) config.stats.marketingAccepted += 1;
      if (preferences?.preferences) config.stats.preferencesAccepted += 1;
    }

    try {
      // 3. Try to save updated stats to Supabase database
      const { error } = await supabaseService
        .from("privacy_config")
        .upsert({
          id: 1,
          current_version: config.currentVersion,
          policy_text: config.policyText,
          optional_services: config.optionalServices,
          stats: config.stats,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (dbErr) {
      console.warn("Failed to write updated stats to database, falling back to local file. Error:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
