export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminSession, getUserSession } from "@/lib/adminAuth";

/**
 * Who is signed in, for the navbar: an admin (fixed account), a Google
 * user, both, or neither. Only `authenticated` (admin) unlocks anything.
 */
export async function GET() {
  const [admin, user] = await Promise.all([getAdminSession(), getUserSession()]);
  return NextResponse.json(
    {
      authenticated: Boolean(admin),
      username: admin?.u ?? null,
      user: user ? { name: user.name, email: user.email, picture: user.picture } : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
