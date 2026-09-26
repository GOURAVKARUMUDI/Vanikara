import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { isAdmin } from '@/lib/isAdmin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Sync user to public.users table
        await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
        }, { onConflict: 'id' });

        // Create subscription with 16-day trial
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 16);
        
        await supabase.from('subscriptions').upsert({
          user_id: user.id,
          plan: 'free',
          trial_start: new Date().toISOString(),
          trial_end: trialEnd.toISOString(),
          status: 'active'
        }, { onConflict: 'user_id' });

        // Admin redirect logic
        const isUserAdmin = isAdmin(user);
        
        let path = "/dashboard";
        if (isUserAdmin) {
          path = "/admin";
        } else {
          const next = searchParams.get('next');
          // Prevent open redirect: only allow relative paths starting with /
          if (next && next.startsWith('/') && !next.startsWith('//')) {
            path = next;
          }
        }

        return NextResponse.redirect(`${origin}${path}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
