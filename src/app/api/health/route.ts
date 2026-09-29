import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import nodemailer from "nodemailer";
import { logError } from "@/lib/security";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedStatus: any = null;
let lastCheckTime = 0;
const CACHE_TTL_MS = 60000; // Cache health status checks for 60 seconds

export async function GET() {
  const now = Date.now();

  // Anyone gets a simple liveness answer; only a signed-in admin gets
  // service details (which would otherwise reveal internal configuration).
  const isUserAdmin = Boolean(await getAdminSession().catch(() => null));

  if (!isUserAdmin) {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  }

  // Detailed checks for admins
  if (cachedStatus && now - lastCheckTime < CACHE_TTL_MS) {
    return NextResponse.json(
      {
        ...cachedStatus,
        timestamp: new Date().toISOString(),
        cached: true,
      },
      { status: cachedStatus.status === "healthy" ? 200 : 500 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status: Record<string, any> = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "healthy",
      email: "healthy"
    }
  };

  let hasError = false;

  // 1. Check Database connectivity via Supabase service client
  try {
    const { error } = await supabaseService.from("leads").select("id").limit(1);
    if (error) {
      status.services.database = `unhealthy: ${error.message}`;
      hasError = true;
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    status.services.database = `unhealthy: ${err.message}`;
    hasError = true;
  }

  // 2. Check Nodemailer SMTP configuration
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    status.services.email = "disabled: SMTP authentication environment variables not configured";
  } else {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      // Verifies connection configuration and SMTP credentials
      await transporter.verify();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      status.services.email = `unhealthy: SMTP verification failed - ${err.message}`;
      hasError = true;
    }
  }

  if (hasError) {
    status.status = "unhealthy";
    logError("Health Check", "System health check degraded", { errorType: "health_degraded" });
  }

  // Save to cache
  cachedStatus = { ...status };
  lastCheckTime = now;

  return NextResponse.json(status, { status: hasError ? 500 : 200 });
}
