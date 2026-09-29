export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { apiResponse, isTrustedOrigin } from "@/lib/security";
import { USER_COOKIE } from "@/lib/adminSession";

/** Ends a Google user's session. Admin sessions are unaffected. */
export async function POST(req: Request) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
  }
  const res = NextResponse.json(apiResponse(true, null));
  res.cookies.set(USER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0, sameSite: "lax" });
  return res;
}
