import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function proxy(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : (req as any).ip || '127.0.0.1';
  const now = Date.now();
  const limit = 5;
  const windowMs = 60000;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const cookieHeader = req.headers.get('cookie') || '';
    const isAuthenticated = cookieHeader.includes('sb-') || cookieHeader.includes('vanikara_session');
    if (!isAuthenticated) {
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
