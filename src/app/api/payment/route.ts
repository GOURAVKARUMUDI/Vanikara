export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession, getUserSession } from "@/lib/adminAuth";
import { apiResponse, logError, isTrustedOrigin } from "@/lib/security";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";

/**
 * Razorpay checkout for client invoices.
 *
 *   create — makes a Razorpay order for a client's package. The amount always
 *            comes from the database, never from the browser.
 *   verify — checks Razorpay's signature for a completed payment and marks it
 *            paid.
 *
 * Who may pay: a signed-in (Google) customer whose email matches the client
 * record, or an admin. Anyone else is refused.
 */

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), clientId: z.string().uuid() }),
  z.object({
    action: z.literal("verify"),
    razorpay_order_id: z.string().min(1).max(64),
    razorpay_payment_id: z.string().min(1).max(64),
    razorpay_signature: z.string().regex(/^[0-9a-f]{64}$/i),
  }),
]);

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

function signatureMatches(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", keySecret!).update(`${orderId}|${paymentId}`).digest();
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function payerMayUse(clientId: string, payerEmail: string | null, isAdmin: boolean) {
  const { data: client } = await supabaseService.from("clients").select("id, email, package_id").eq("id", clientId).maybeSingle();
  if (!client) return { client: null, allowed: false };
  const owns = Boolean(payerEmail && client.email?.toLowerCase().trim() === payerEmail);
  return { client, allowed: owns || isAdmin };
}

export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }

    const [admin, user] = await Promise.all([getAdminSession(), getUserSession()]);
    if (!admin && !user) {
      return NextResponse.json(apiResponse(false, null, "Please sign in to pay."), { status: 401 });
    }

    const limit = await isRateLimited(clientIp(req));
    if (limit.limited) {
      return NextResponse.json(apiResponse(false, null, "Too many requests. Please try again later."), {
        status: 429,
        headers: retryAfterHeaders(limit.reset),
      });
    }

    if (!razorpay || !keySecret) {
      return NextResponse.json(apiResponse(false, null, "Online payments are not available right now."), { status: 503 });
    }

    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(apiResponse(false, null, "Invalid request"), { status: 400 });
    }
    const body = parsed.data;
    const payerEmail = user?.email.toLowerCase() ?? null;

    if (body.action === "create") {
      const { client, allowed } = await payerMayUse(body.clientId, payerEmail, Boolean(admin));
      if (!client) return NextResponse.json(apiResponse(false, null, "Invoice not found"), { status: 404 });
      if (!allowed) return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
      if (!client.package_id) {
        return NextResponse.json(apiResponse(false, null, "No package is linked to this invoice"), { status: 400 });
      }

      const { data: pkg } = await supabaseService.from("packages").select("price").eq("id", client.package_id).maybeSingle();
      const price = Number(pkg?.price);
      if (!pkg || !Number.isFinite(price) || price <= 0) {
        return NextResponse.json(apiResponse(false, null, "Package price not found"), { status: 404 });
      }

      const order = await razorpay.orders.create({
        amount: Math.round(price * 100), // paise
        currency: "INR",
        receipt: `vk_${client.id.slice(0, 8)}_${Date.now()}`,
        notes: { client_id: client.id },
      });

      const { error } = await supabaseService
        .from("payments")
        .insert([{ client_id: client.id, amount: price, currency: "INR", status: "pending", razorpay_order_id: order.id }]);
      if (error) throw error;

      // Only what the checkout needs — never the secret
      return NextResponse.json(
        apiResponse(true, { orderId: order.id, amount: order.amount, currency: order.currency, keyId })
      );
    }

    // verify
    if (!signatureMatches(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)) {
      return NextResponse.json(apiResponse(false, null, "Payment could not be verified"), { status: 400 });
    }

    const { data: payment } = await supabaseService
      .from("payments")
      .select("id, client_id, status")
      .eq("razorpay_order_id", body.razorpay_order_id)
      .maybeSingle();
    if (!payment) return NextResponse.json(apiResponse(false, null, "Order not found"), { status: 404 });

    const { allowed } = await payerMayUse(payment.client_id, payerEmail, Boolean(admin));
    if (!allowed) return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });

    if (payment.status !== "success") {
      await supabaseService
        .from("payments")
        .update({
          status: "success",
          razorpay_payment_id: body.razorpay_payment_id,
          razorpay_signature: body.razorpay_signature,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);
      await supabaseService.from("clients").update({ payment_status: "paid" }).eq("id", payment.client_id);
    }

    return NextResponse.json(apiResponse(true, { paid: true }));
  } catch (error) {
    logError("Payment API", error);
    return NextResponse.json(apiResponse(false, null, "Payment error. Please try again or contact support."), { status: 500 });
  }
}
