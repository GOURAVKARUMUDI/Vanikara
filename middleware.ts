import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin } from '@/lib/isAdmin';

/**
 * Edge middleware for defense-in-depth authentication.
 * 
 * Protects /admin and /dashboard routes at the edge layer
 * BEFORE any page or API handler code runs.
 * 
 * Individual page/API handlers still perform their own auth checks
 * (server-side getUser + isAdmin). This middleware is an additional
 * security layer, not a replacement.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect authenticated routes
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
  const isAdminApiRoute = pathname.startsWith('/api/admin');

  if (!isProtectedRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // Create Supabase client with cookie forwarding
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // If Supabase is not configured, block access to protected routes
    if (isAdminApiRoute) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session (important for token rotation)
  const { data: { user } } = await supabase.auth.getUser();

  // No authenticated user → redirect to login or return 401
  if (!user) {
    if (isAdminApiRoute) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, verify admin role at the edge
  if (pathname.startsWith('/admin') || isAdminApiRoute) {
    const isUserAdmin = isAdmin(user);

    if (!isUserAdmin) {
      if (isAdminApiRoute) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/admin/:path*',
  ],
};
