import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminSession';

/**
 * Proxy (formerly middleware) — must live in src/, beside app/, or Next.js
 * silently ignores it.
 *
 * Defense-in-depth for the admin area.
 *
 * VANIKARA has no public accounts: the only sign-in is for the fixed admin
 * accounts (see lib/adminAuth). This checks the signed admin session
 * cookie BEFORE any page or API handler runs. Handlers still verify the
 * session themselves; this is an extra layer, not a replacement.
 *
 * - /admin/*      → signed-in admins only, otherwise /login
 * - /api/admin/*  → signed-in admins only, otherwise 401
 * - /dashboard/*  → retired (no user accounts); sends admins to /admin
 * - /login        → already signed in? go straight to /admin
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname.startsWith('/login')) {
    return session ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    return session
      ? NextResponse.next()
      : NextResponse.json({ success: false, data: null, error: 'Unauthorized' }, { status: 401 });
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    if (pathname.startsWith('/admin')) loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/admin/:path*', '/login'],
};
