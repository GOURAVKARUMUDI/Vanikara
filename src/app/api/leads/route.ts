export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { getAdminSession } from "@/lib/adminAuth";
import { sanitize, apiResponse, logError, isTrustedOrigin } from "@/lib/security";
import { submitToGoogleForm } from "@/lib/googleForms";
import { z } from "zod";

export async function GET() {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { data, error } = await supabaseService
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(apiResponse(true, data || []));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Leads GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().max(5000).optional(),
  source: z
    .string()
    .regex(/^[a-z_]{1,40}$/)
    .optional(),
});

/**
 * Manual lead entry — admins only. Public enquiries arrive through
 * /api/contact (rate limited, validated, honeypot-protected); this route
 * used to be open to anyone and was not used by the site.
 */
export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const parsed = createLeadSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(apiResponse(false, null, "Invalid lead details"), { status: 400 });
    }
    const { name, email, message, source } = parsed.data;

    const sName = sanitize(name).slice(0, 100);
    const sEmail = email.toLowerCase();
    const sMsg = sanitize(message || '').slice(0, 5000);

    const { data, error } = await supabaseService
      .from("leads")
      .insert([{ name: sName, email: sEmail, message: sMsg, source, status: 'new' }])
      .select()
      .single();

    if (error) throw error;

    // Sync to Google Form if configured (Secondary/Operational Flow)
    if (source && source !== "form") {
      const googleFormSuccess = await submitToGoogleForm(source, {
        name: sName,
        email: sEmail,
        message: sMsg,
        details: sMsg,
        comment: sMsg,
        description: sMsg,
      });

      const formUrlEnvName = `GOOGLE_FORM_${source.toUpperCase()}_URL`;
      if (!googleFormSuccess && (process.env[formUrlEnvName] || process.env.NODE_ENV === "production")) {
        return NextResponse.json(
          apiResponse(false, null, `Google Forms operational sync failed for ${source}. Please try again.`),
          { status: 502 }
        );
      }
    }

    return NextResponse.json(apiResponse(true, data));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Leads POST", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { id, status, name, message, source } = await req.json();
    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const updates: Record<string, string> = {};
    if (status !== undefined) updates.status = String(status).slice(0, 50);
    if (name !== undefined) updates.name = sanitize(String(name)).slice(0, 100);
    if (message !== undefined) updates.message = sanitize(String(message)).slice(0, 5000);
    if (source !== undefined) updates.source = sanitize(String(source)).slice(0, 50);

    const { data, error } = await supabaseService
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (updates.status === 'converted' && data) {
      await supabaseService
        .from("clients")
        .insert([{ 
          name: data.name, 
          email: data.email, 
          project_status: 'idea',
          amount: 0,
          payment_status: 'pending'
        }]);
    }

    return NextResponse.json(apiResponse(true, data));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Leads PATCH", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    const { error } = await supabaseService
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json(apiResponse(true, { success: true }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Leads DELETE", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
