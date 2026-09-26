/**
 * instrumentation.ts: Run startup checks for production environment.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
     console.log('--- STARTUP SECURITY CHECK ---');
     const required = [
       'NEXT_PUBLIC_SUPABASE_URL',
       'NEXT_PUBLIC_SUPABASE_ANON_KEY',
       'SUPABASE_SERVICE_ROLE_KEY',
       'SMTP_USER',
       'SMTP_PASS'
     ];

     const missing = required.filter(key => !process.env[key]);

     if (missing.length > 0) {
       console.error(`[CRITICAL] Missing environment variables: ${missing.join(', ')}`);
     } else {
       console.log('All required environment variables are present.');
     }
     console.log('------------------------------');
  }
}
