import { headers } from "next/headers";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { s } from "@/lib/stripe";
import { supabaseService } from "@/utils/supabase/service";

export async function POST(req: Request) {
  const body = await req.text();
  const h = await headers();
  const sig = h.get("stripe-signature") as string;

  if (!s || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let event;

  try {
    event = s.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any;
    const userId = session.client_reference_id || session.metadata?.user_id;

    if (!userId) {
      console.error('Stripe Webhook: No user ID found in session metadata or client reference');
      return NextResponse.json({ error: 'No user ID linked to this checkout session' }, { status: 400 });
    }

    let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (session.subscription) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = await s.subscriptions.retrieve(session.subscription as string) as any;
        if (subscription && subscription.current_period_end) {
          currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (stripeErr: any) {
        console.error('Stripe Webhook: Error retrieving subscription from Stripe API:', stripeErr.message);
      }
    }

    const { error } = await supabaseService
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: 'pro',
        status: 'active',
        current_period_end: currentPeriodEnd,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving subscription:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

  }

  return NextResponse.json({ received: true });
}
