import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseService } from '@/utils/supabase/service';
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
        // Provisioning runs against the service-role client, not the user's
        // own session client: it must be idempotent and authoritative,
        // independent of row-level security policies granted to `authenticated`.

        // Sync profile row. Only `id`/`email` are ever touched here —
        // `role` is never written by login, and `created_at` is omitted so
        // an existing row's original signup date is never overwritten.
        await supabaseService.from('users').upsert({
          id: user.id,
          email: user.email,
        }, { onConflict: 'id' });

        // Provision a trial subscription for brand-new users only. An
        // existing subscription (plan, status, trial dates) must never be
        // reset by a later login — that previously let every sign-in wipe
        // a user's plan back to 'free' with a fresh trial window.
        const { data: existingSub } = await supabaseService
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingSub) {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 16);

          await supabaseService.from('subscriptions').insert({
            user_id: user.id,
            plan: 'free',
            trial_start: new Date().toISOString(),
            trial_end: trialEnd.toISOString(),
            status: 'active',
          });
        }

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
