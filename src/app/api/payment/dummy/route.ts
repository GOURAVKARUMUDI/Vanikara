import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const sb = createClient(await cookies());
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: sub, error: subError } = await sb
    .from('subscriptions')
    .update({ 
      plan: 'pro', 
      status: 'active',
      trial_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year extension for "puro"
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Payment successful (demo)', data: sub });
}
