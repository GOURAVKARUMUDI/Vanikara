export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { apiResponse, logError } from "@/lib/security";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    let dbConnected = false;
    const tablesStatus: Record<string, boolean> = {
      leads: false,
      clients: false,
      payments: false,
      projects: false,
      products: false,
      careers_applications: false,
    };

    if (hasUrl && hasServiceKey) {
      try {
        // Run a quick check on leads table to verify connection
        const { error } = await supabaseService
          .from("leads")
          .select("id")
          .limit(1);
        
        dbConnected = !error;

        // Verify other tables
        const tables = ["leads", "clients", "payments", "projects", "products", "careers_applications"];
        for (const table of tables) {
          const { error: tblError } = await supabaseService
            .from(table)
            .select("id")
            .limit(1);
          tablesStatus[table] = !tblError;
        }
      } catch (err) {
        logError("Settings Connection Check", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        env: {
          NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "Configured" : "Missing",
          SUPABASE_SERVICE_ROLE_KEY: hasServiceKey ? "Configured" : "Missing",
        },
        dbConnected,
        tablesStatus,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
      }
    });

  } catch (error: any) {
    logError("Settings GET", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
