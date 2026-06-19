import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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

export async function POST(req: Request) {
  try {
    const { action, preferences, version } = await req.json();

    // 1. Read existing config using runtime caching
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
      if (preferences.analytics) config.stats.analyticsAccepted += 1;
      if (preferences.marketing) config.stats.marketingAccepted += 1;
      if (preferences.preferences) config.stats.preferencesAccepted += 1;
    }

    // 3. Write changes ONLY to the runtime path so dev server does not hot-reload
    await fs.writeFile(RUNTIME_PATH, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
