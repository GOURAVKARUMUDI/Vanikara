import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import nodemailer from "nodemailer";
import { logError } from "@/lib/security";

export const dynamic = "force-dynamic";

let cachedStatus: any = null;
let lastCheckTime = 0;
const CACHE_TTL_MS = 60000; // Cache health status checks for 60 seconds

export async function GET() {
  const now = Date.now();
  
  // 1. Resolve User and Admin status
  let isUserAdmin = false;
  try {
    const cookieStore = await cookies();
    const sb = createClient(cookieStore);
    const { data: { user } } = await sb.auth.getUser();
    if (user && isAdmin(user)) {
      isUserAdmin = true;
    }
  } catch (authErr) {
    // Fail silent, treat as anonymous
  }

  // If request is anonymous or regular user, return a simple health status immediately
  if (!isUserAdmin) {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  }

  // 2. Perform detailed checks for Admin
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

  const status: Record<string, any> = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "healthy",
      openai: "healthy",
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
  } catch (err: any) {
    status.services.database = `unhealthy: ${err.message}`;
    hasError = true;
  }

  // 2. Check OpenAI configuration credentials
  if (!process.env.OPENAI_API_KEY) {
    status.services.openai = "unhealthy: OPENAI_API_KEY is not configured";
    hasError = true;
  } else if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
    status.services.openai = "unhealthy: OPENAI_API_KEY has an invalid key format";
    hasError = true;
  }

  // 3. Check Nodemailer SMTP configuration
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

