import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data/privacy_config.json");

export async function POST(req: Request) {
  try {
    const { action, preferences, version } = await req.json();

    // 1. Read existing config file
    const fileContent = await fs.readFile(CONFIG_PATH, "utf-8");
    const config = JSON.parse(fileContent);

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

    // 3. Write changes back to json file
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
