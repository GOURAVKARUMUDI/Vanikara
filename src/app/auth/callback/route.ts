import { NextResponse } from "next/server";

/**
 * Former OAuth / magic-link callback. Public sign-up and third-party
 * sign-in are disabled — only the fixed admin accounts can sign in, with a
 * username and password — so this simply returns to the sign-in page.
 */
export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/login", request.url));
}
