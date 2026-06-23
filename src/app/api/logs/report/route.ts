import { NextResponse } from "next/server";
import { logError } from "@/lib/security";
import { isRateLimited } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitCheck = await isRateLimited(ip);
    if (limitCheck.limited) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }

    // 2. Payload size checking
    const rawText = await req.text();
    if (rawText.length > 50 * 1024) { // 50KB max payload
      return NextResponse.json({ success: false, error: "Payload too large" }, { status: 413 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any;
    try {
      payload = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    const { level, message, error, context } = payload;

    // 3. Simple schema validation
    if (level && typeof level !== "string") {
      return NextResponse.json({ success: false, error: "Invalid log level" }, { status: 400 });
    }
    if (message && typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Invalid log message" }, { status: 400 });
    }

    // Structured server log entry matching logError format
    logError(`Client-Side [${(level || "ERROR").substring(0, 10)}]`, {
      message: (message || "Unhandled client-side exception").substring(0, 2000),
      stack: (error?.stack || "No client-side stack trace provided").substring(0, 4000),
    }, {
      errorType: "CLIENT_ERROR",
      statusCode: 500,
      ...context,
      clientErrorMessage: error?.message ? String(error.message).substring(0, 1000) : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    return NextResponse.json({ success: true }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
