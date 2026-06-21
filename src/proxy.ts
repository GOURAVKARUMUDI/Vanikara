import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAdmin } from '@/lib/isAdmin';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function proxy(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || '127.0.0.1';
  const now = Date.now();
  const limit = 5;
  const windowMs = 60000;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    let isAuthenticated = false;
    let isUserAdmin = false;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        let response = NextResponse.next({
          request: {
            headers: req.headers,
          },
        });

        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() {
              return req.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                req.cookies.set(name, value);
                response = NextResponse.next({
                  request: {
                    headers: req.headers,
                  },
                });
                response.cookies.set(name, value, options);
              });
            },
          },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          isAuthenticated = true;
          isUserAdmin = isAdmin(user.email);
        }
      }
    } catch (err) {
      console.error('Proxy admin authentication guard failed:', err);
    }

    if (!isAuthenticated || !isUserAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (
    pathname.startsWith('/api/contact') ||
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/payment')
  ) {
    const data = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - data.lastReset > windowMs) {
      data.count = 0;
      data.lastReset = now;
    }

    data.count++;
    rateLimitMap.set(ip, data);

    if (data.count > limit) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
