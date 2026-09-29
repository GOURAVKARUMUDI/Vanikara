export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { apiResponse, isTrustedOrigin, logError } from "@/lib/security";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";
import { verifyFirebaseIdToken } from "@/lib/firebaseToken";
import { USER_COOKIE, signUserSession, userCookieOptions } from "@/lib/adminSession";
import { supabaseService } from "@/utils/supabase/service";

const schema = z.object({ idToken: z.string().min(100).max(4096) });

/**
 * Exchanges a Firebase Google sign-in for a VANIKARA user session.
 *
 * Signing in creates (or refreshes) the visitor's account record so the
 * team can see who has an account. It grants no extra access: the site is
 * the same for everyone, and the admin console accepts only admin
 * sessions, which this route can never issue.
 */
export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    if (Number(req.headers.get("content-length") ?? 0) > 8192) {
      return NextResponse.json(apiResponse(false, null, "Request too large."), { status: 413 });
    }

    const limit = await isRateLimited(clientIp(req), "userAuth");
    if (limit.limited) {
      return NextResponse.json(apiResponse(false, null, "Too many sign-in attempts. Please try again shortly."), {
        status: 429,
        headers: retryAfterHeaders(limit.reset),
      });
    }

    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(apiResponse(false, null, "Invalid sign-in request."), { status: 400 });
    }

    const user = await verifyFirebaseIdToken(parsed.data.idToken);
    if (!user) {
      return NextResponse.json(apiResponse(false, null, "Google sign-in could not be verified. Please try again."), { status: 401 });
    }

    // Account record: create on first sign-in, refresh afterwards, and
    // honour a block set by an admin. If the database is unreachable the
    // visitor can still sign in (it grants nothing), but a known block is
    // always enforced.
    try {
      const { data: existing, error: readError } = await supabaseService
        .from("users")
        .select("id, blocked")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (!readError && existing?.blocked) {
        return NextResponse.json(apiResponse(false, null, "This account has been disabled. Contact support@vanikara.com."), { status: 403 });
      }

      if (!readError) {
        const now = new Date().toISOString();
        const { error: writeError } = await supabaseService.from("users").upsert(
          {
            firebase_uid: user.uid,
            email: user.email,
            name: user.name,
            avatar_url: user.picture,
            provider: "google",
            last_sign_in_at: now,
          },
          { onConflict: "firebase_uid" }
        );
        if (writeError) logError("Google sign-in: user record", writeError);
      } else {
        logError("Google sign-in: user lookup", readError);
      }
    } catch (dbError) {
      logError("Google sign-in: database unavailable", dbError);
    }

    const token = await signUserSession({ u: user.uid, email: user.email, name: user.name, picture: user.picture });
    if (!token) {
      return NextResponse.json(apiResponse(false, null, "Sign-in is not configured on this server."), { status: 503 });
    }

    const res = NextResponse.json(apiResponse(true, { name: user.name, email: user.email, picture: user.picture }));
    res.cookies.set(USER_COOKIE, token, userCookieOptions);
    return res;
  } catch (error) {
    logError("Google sign-in", error);
    return NextResponse.json(apiResponse(false, null, "Something went wrong. Please try again."), { status: 500 });
  }
}
