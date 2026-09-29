export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { apiResponse, isTrustedOrigin, logError } from "@/lib/security";
import {
  clearLoginFailures,
  isAdminAuthConfigured,
  loginLockout,
  recordLoginFailure,
  verifyAdminCredentials,
} from "@/lib/adminAuth";
import { ADMIN_COOKIE, sessionCookieOptions, signAdminSession } from "@/lib/adminSession";
import { logAdminAction } from "@/lib/auditLogger";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";

const schema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(256),
});

/** Admin sign-in. There is no sign-up endpoint: accounts are fixed in configuration. */
export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    if (!isAdminAuthConfigured()) {
      return NextResponse.json(apiResponse(false, null, "Admin sign-in is not configured on this server."), { status: 503 });
    }

    // Credentials are tiny; refuse oversized bodies before parsing
    if (Number(req.headers.get("content-length") ?? 0) > 2048) {
      return NextResponse.json(apiResponse(false, null, "Request too large."), { status: 413 });
    }
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(apiResponse(false, null, "Enter your username and password."), { status: 400 });
    }
    const { username, password } = parsed.data;

    // Three layers against guessing: a shared per-IP budget, a shared
    // per-username budget (stops attacks spread over many IPs), and a
    // lockout after repeated failures from the same IP for the same user.
    const ip = clientIp(req);
    const [byIp, byUser] = await Promise.all([
      isRateLimited(ip, "login"),
      isRateLimited(username.toLowerCase(), "loginUser"),
    ]);
    if (byIp.limited || byUser.limited) {
      const reset = Math.max(byIp.limited ? byIp.reset : 0, byUser.limited ? byUser.reset : 0);
      return NextResponse.json(apiResponse(false, null, "Too many sign-in attempts. Please wait and try again."), {
        status: 429,
        headers: retryAfterHeaders(reset),
      });
    }

    const key = `${ip}|${username.toLowerCase()}`;
    const wait = loginLockout(key);
    if (wait > 0) {
      return NextResponse.json(apiResponse(false, null, `Too many attempts. Try again in ${Math.ceil(wait / 60)} min.`), {
        status: 429,
        headers: { "Retry-After": String(wait) },
      });
    }

    const admin = await verifyAdminCredentials(username, password);
    if (!admin) {
      recordLoginFailure(key);
      return NextResponse.json(apiResponse(false, null, "Incorrect username or password."), { status: 401 });
    }

    clearLoginFailures(key);
    const token = await signAdminSession(admin);
    if (!token) {
      return NextResponse.json(apiResponse(false, null, "Admin sign-in is not configured on this server."), { status: 503 });
    }

    await logAdminAction(admin, "ADMIN_SIGN_IN", admin, { ip });
    const res = NextResponse.json(apiResponse(true, { username: admin }));
    res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
    return res;
  } catch (error) {
    logError("Admin login", error);
    return NextResponse.json(apiResponse(false, null, "Something went wrong. Please try again."), { status: 500 });
  }
}
