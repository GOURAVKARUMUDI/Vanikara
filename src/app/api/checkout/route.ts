export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { s } from "@/lib/stripe";
import { apiResponse, logError } from "@/lib/security";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const sb = createClient(await cookies());
    const { data: { user } } = await sb.auth.getUser();

    if (!user) return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });

    if (!s) {
      logError("Stripe Config", "Stripe not configured");
      return NextResponse.json(apiResponse(false, null, "Checkout not available"), { status: 500 });
    }

    const session = await s.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "VANIKARA INTELLIGENCE Growth Plan"
            },
            unit_amount: 99900,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`
    });

    return NextResponse.json(apiResponse(true, { url: session.url }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Checkout API", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
