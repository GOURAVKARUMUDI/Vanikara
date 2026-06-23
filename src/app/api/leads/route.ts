export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sanitize, apiResponse, logError } from "@/lib/security";
import { submitToGoogleForm } from "@/lib/googleForms";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, source } = body;

    if (!name || !email) {
      return NextResponse.json(apiResponse(false, null, "Missing required fields"), { status: 400 });
    }

    const sName = sanitize(name).slice(0, 100);
    const sEmail = email.trim().toLowerCase();
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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json(apiResponse(false, null, "Missing ID"), { status: 400 });

    // Sanitize certain fields if present
    if (updates.name) updates.name = sanitize(updates.name).slice(0, 100);
    if (updates.message) updates.message = sanitize(updates.message).slice(0, 5000);

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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
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
