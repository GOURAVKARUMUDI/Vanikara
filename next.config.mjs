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

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  console.log("✅ Razorpay Enabled");
} else {
  console.warn("⚠️ Razorpay Disabled");
}

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log("✅ SMTP Enabled");
} else {
  console.warn("⚠️ SMTP Disabled");
}

const nextConfig = {
  productionBrowserSourceMaps: false,
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://va.vercel-scripts.com https://js.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.razorpay.com https://vitals.vercel-insights.com https://api.stripe.com;
              frame-src 'self' https://www.google.com https://js.stripe.com;
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
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' }
        ]
      }
    ];
  }
};

export default nextConfig;
