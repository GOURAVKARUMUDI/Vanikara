import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseService } from "@/utils/supabase/service";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { apiResponse, logError } from "@/lib/security";

export const dynamic = "force-dynamic";

let razorpay: any = null;

if (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET
) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    logError("Payment Module", new Error("Missing Razorpay Keys. Module Disabled."));
}
export async function POST(req: any) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const sb = createClient(cookieStore);
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const { clientId, action } = body;

    // Check if user is an admin
    const { data: userData } = await sb.from("users").select("role").eq("id", user.id).single();
    const isAdminUser = userData?.role === "admin";

    if (action === "create") {
      if (!clientId) {
        return NextResponse.json(apiResponse(false, null, "Missing client ID"), { status: 400 });
      }

      if (!razorpay) {
        return NextResponse.json(apiResponse(false, null, "Payment Gateway not configured"), { status: 500 });
      }

      // Fetch client record to verify ownership and resolve package details
      const { data: client, error: clientErr } = await supabaseService
        .from("clients")
        .select("email, package_id")
        .eq("id", clientId)
        .single();

      if (clientErr || !client) {
        return NextResponse.json(apiResponse(false, null, "Client record not found"), { status: 404 });
      }

      // Ensure user owns the client record OR is admin
      if (client.email.toLowerCase().trim() !== user.email?.toLowerCase().trim() && !isAdminUser) {
        return NextResponse.json(apiResponse(false, null, "Forbidden: Access denied"), { status: 403 });
      }

      if (!client.package_id) {
        return NextResponse.json(apiResponse(false, null, "No package associated with client"), { status: 400 });
      }

      // Fetch the actual package price from the database
      const { data: pkg, error: pkgErr } = await supabaseService
        .from("packages")
        .select("price")
        .eq("id", client.package_id)
        .single();

      if (pkgErr || !pkg) {
        return NextResponse.json(apiResponse(false, null, "Associated package not found"), { status: 404 });
      }

      const verifiedPrice = Number(pkg.price);

      const options = {
        amount: Math.round(verifiedPrice * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}_${clientId.slice(0, 8)}`,
      };

      const order = await razorpay.orders.create(options);

      await supabaseService.from("payments").insert([{
        client_id: clientId,
        amount: verifiedPrice,
        status: "pending",
        razorpay_order_id: order.id
      }]);

      return NextResponse.json(apiResponse(true, order));
    } 
    
    if (action === "verify") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(apiResponse(false, null, "Missing verification data"), { status: 400 });
      }

      // Verify the payment signature
      const hmacBody = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(hmacBody.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        await supabaseService
          .from("payments")
          .update({ status: 'success', razorpay_payment_id, razorpay_signature, updated_at: new Date().toISOString() })
          .eq("razorpay_order_id", razorpay_order_id);

        const { data: payment } = await supabaseService
          .from("payments")
          .select("client_id")
          .eq("razorpay_order_id", razorpay_order_id)
          .single();

        if (payment) {
          await supabaseService
            .from("clients")
            .update({ payment_status: 'paid' })
            .eq("id", payment.client_id);
        }

        return NextResponse.json(apiResponse(true, { success: true }));
      } else {
        return NextResponse.json(apiResponse(false, null, "Payment verification failed"), { status: 400 });
      }
    }

    return NextResponse.json(apiResponse(false, null, "Invalid action"), { status: 400 });

  } catch (error: any) {
    logError("Payment API", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
