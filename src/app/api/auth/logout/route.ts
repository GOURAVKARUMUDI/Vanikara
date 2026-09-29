export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { apiResponse, isTrustedOrigin } from "@/lib/security";
import { ADMIN_COOKIE } from "@/lib/adminSession";

export async function POST(req: Request) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
  }
  const res = NextResponse.json(apiResponse(true, null));
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0, sameSite: "strict" });
  return res;
}
