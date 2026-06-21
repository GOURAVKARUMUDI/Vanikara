import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import { supabaseService } from "@/utils/supabase/service";

const STATIC_PATH = path.join(process.cwd(), "data/privacy_config.json");

async function getConfig() {
  try {
    // 1. Try querying the Supabase database
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
    console.warn("Database privacy_config check failed, falling back to local file. Error:", err);
  }

  // 2. Fallback to local files if database is missing/table doesn't exist
  try {
    const fileContent = await fs.readFile(STATIC_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Failed to read static fallback privacy_config file:", err);
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

export async function GET() {
  try {
    const config = await getConfig();

    // Verify if the caller is an authenticated super admin
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    const isUserAdmin = user && isAdmin(user.email);

    if (isUserAdmin) {
      // Admins get the complete configuration including statistics
      return NextResponse.json({ success: true, data: config });
    }

    // Public gets a filtered version (no statistics)
    const filtered = {
      currentVersion: config.currentVersion,
      policyText: config.policyText,
      optionalServices: config.optionalServices
    };

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Enforce super admin authentication for updates
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentVersion, policyText, optionalServices } = await req.json();

    // Read existing using runtime caching to preserve statistics
    const config = await getConfig();

    // Update settings fields
    if (currentVersion) config.currentVersion = currentVersion;
    if (policyText) config.policyText = policyText;
    if (optionalServices) config.optionalServices = optionalServices;

    try {
      // 1. Try to upsert into the Supabase database
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
      console.warn("Failed to write to database privacy_config, falling back to local file. Error:", dbErr);
      try {
        await fs.writeFile(STATIC_PATH, JSON.stringify(config, null, 2), "utf-8");
      } catch {}
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

