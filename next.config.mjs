/** @type {import('next').NextConfig} */

// Validate Environment Variables before Boot
const envChecks = [
  // ===== REQUIRED =====
  { key: "NEXT_PUBLIC_SUPABASE_URL", required: true },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true },
  { key: "SUPABASE_SERVICE_ROLE_KEY", required: true },
  { key: "JWT_SECRET", required: false },

  // ===== OPTIONAL =====
  { key: "RAZORPAY_KEY_ID", required: false },
  { key: "RAZORPAY_KEY_SECRET", required: false },

  { key: "SMTP_HOST", required: false },
  { key: "SMTP_PORT", required: false },
  { key: "SMTP_USER", required: false },
  { key: "SMTP_PASS", required: false },
];

const missingRequired = [];

for (const env of envChecks) {
  if (env.required && !process.env[env.key]) {
    missingRequired.push(env.key);
  }
}

if (missingRequired.length > 0) {
  console.error(`\n❌ CRITICAL ERROR: Missing Production Environment Variables:`);
  missingRequired.forEach((key) => console.error(`  - ${key}`));
  console.error(`\nServer startup aborted to prevent unpredictable runtime states.\n`);
  process.exit(1);
}

console.log("✅ Required environment variables validated.");

// React's development build uses eval() for debugging features; never allowed in production.
const devScriptSrc = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';

const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  productionBrowserSourceMaps: false,
  // Don't advertise the framework in every response
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.stripe.com',
      },
      {
        protocol: 'https',
        hostname: '*.razorpay.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/what-we-build',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/what-we-build',
        permanent: true,
      },
      {
        source: '/ai',
        destination: '/cygma',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/what-we-build',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/what-we-build',
        permanent: true,
      },
      {
        source: '/brand',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/investors',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/press',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/legal/privacy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/legal/terms',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/legal/cookies',
        permanent: true,
      },
      {
        source: '/refund',
        destination: '/legal/refund',
        permanent: true,
      },
      {
        source: '/security',
        destination: '/legal/security',
        permanent: true,
      },
      {
        source: '/legal-information',
        destination: '/legal/legal-information',
        permanent: true,
      },
      {
        source: '/status',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/changelog',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/upload',
        destination: '/contact',
        permanent: true,
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline'${devScriptSrc} https://*.supabase.co https://va.vercel-scripts.com https://js.stripe.com https://apis.google.com https://www.gstatic.com https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.razorpay.com https://vitals.vercel-insights.com https://api.stripe.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebaseinstallations.googleapis.com https://firebase.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com;
              frame-src 'self' https://www.google.com https://js.stripe.com https://accounts.google.com https://*.firebaseapp.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // The legacy XSS auditor can itself be abused; modern guidance is to disable it and rely on CSP
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=(self), usb=(), interest-cohort=()' },
          // Isolates the site from windows it opens / that open it (tab-nabbing, XS-leaks)
          // (allow-popups keeps payment provider pop-ups working)
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ]
      },
      {
        // Admin surfaces: never cached by browsers or CDNs, never indexed
        source: '/(admin|login)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ]
      },
      {
        source: '/api/(admin|auth|leads|clients)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ]
      }
    ];
  }
};

export default nextConfig;
