import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";

const STATIC_PATH = path.join(process.cwd(), "data/privacy_config.json");
const RUNTIME_PATH = path.join(process.cwd(), ".next/privacy_config.json");

async function getConfig() {
  try {
    const fileContent = await fs.readFile(RUNTIME_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    const fileContent = await fs.readFile(STATIC_PATH, "utf-8");
    const config = JSON.parse(fileContent);
    try {
      const dir = path.dirname(RUNTIME_PATH);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(RUNTIME_PATH, JSON.stringify(config, null, 2), "utf-8");
    } catch {}
    return config;
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

    // Write updated configuration to both static (for git) and runtime (for instant bypass)
    await fs.writeFile(STATIC_PATH, JSON.stringify(config, null, 2), "utf-8");
    await fs.writeFile(RUNTIME_PATH, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
