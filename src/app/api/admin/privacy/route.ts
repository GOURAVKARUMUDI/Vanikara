import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";

const CONFIG_PATH = path.join(process.cwd(), "data/privacy_config.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(CONFIG_PATH, "utf-8");
    const config = JSON.parse(fileContent);

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

    // Read existing file to preserve statistics
    const fileContent = await fs.readFile(CONFIG_PATH, "utf-8");
    const config = JSON.parse(fileContent);

    // Update settings fields
    if (currentVersion) config.currentVersion = currentVersion;
    if (policyText) config.policyText = policyText;
    if (optionalServices) config.optionalServices = optionalServices;

    // Write updated configuration back to disk
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
