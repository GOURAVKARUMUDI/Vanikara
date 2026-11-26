import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, USER_COOKIE, verifyAdminSession, verifyUserSession } from "@/lib/adminSession";

/**
 * Perimeter proxy defense (Next.js 16 proxy.ts).
 *
 * - /admin/login   -> already signed-in admin? go straight to /admin
 * - /admin/*       -> signed-in admins only, otherwise /admin/login
 * - /api/admin/*   -> signed-in admins only, otherwise 401
 * - /account/login -> already signed-in user? go straight to /account
 * - /account/*     -> signed-in public users only, otherwise /account/login
 * - /dashboard/*   -> retired; redirects to /admin
 * - /login         -> preserved legacy route; redirects signed-in admins to /admin
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Admin login route
  if (pathname === "/admin/login") {
    const adminSession = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
    return adminSession ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  // Legacy /login route
  if (pathname.startsWith("/login")) {
    const adminSession = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
    return adminSession ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  // Admin API routes
  if (pathname.startsWith("/api/admin")) {
    const adminSession = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
    return adminSession
      ? NextResponse.next()
      : NextResponse.json({ success: false, data: null, error: "Unauthorized" }, { status: 401 });
  }

  // Admin UI routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const adminSession = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
    if (!adminSession) {
      const loginUrl = new URL("/login", request.url);
      if (pathname.startsWith("/admin")) loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Public Account Portal routes
  if (pathname === "/account/login") {
    const userSession = await verifyUserSession(request.cookies.get(USER_COOKIE)?.value);
    return userSession ? NextResponse.redirect(new URL("/account", request.url)) : NextResponse.next();
  }

  if (pathname.startsWith("/account")) {
    const userSession = await verifyUserSession(request.cookies.get(USER_COOKIE)?.value);
    if (!userSession) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/api/admin/:path*", "/login", "/account/:path*"],
};
