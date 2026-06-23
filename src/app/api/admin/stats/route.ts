export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import { isAdmin } from "@/lib/isAdmin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { apiResponse, logError } from "@/lib/security";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    // Execute all database queries concurrently
    const [
      leadsCountResult,
      convertedLeadsResult,
      clientsCountResult,
      paymentsResult,
      leadsHistoryResult,
      statusCountsResult,
      projectsCountResult,
      usersCountResult
    ] = await Promise.all([
      supabaseService.from("leads").select("*", { count: "exact", head: true }),
      supabaseService.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted"),
      supabaseService.from("clients").select("*", { count: "exact", head: true }),
      supabaseService.from("payments").select("amount").eq("status", "success"),
      supabaseService.from("leads").select("created_at").order("created_at", { ascending: true }),
      supabaseService.from("leads").select("status"),
      supabaseService.from("projects").select("*", { count: "exact", head: true }),
      supabaseService.from("users").select("*", { count: "exact", head: true })
    ]);

    // Check for errors
    if (leadsCountResult.error) throw leadsCountResult.error;
    if (convertedLeadsResult.error) throw convertedLeadsResult.error;
    if (clientsCountResult.error) throw clientsCountResult.error;
    if (paymentsResult.error) throw paymentsResult.error;
    if (leadsHistoryResult.error) throw leadsHistoryResult.error;
    if (statusCountsResult.error) throw statusCountsResult.error;

    const totalLeads = leadsCountResult.count || 0;
    const convertedLeads = convertedLeadsResult.count || 0;
    const totalClients = clientsCountResult.count || 0;
    const totalProjects = projectsCountResult.count || 0;
    const totalUsers = usersCountResult.count || 0;
    const payments = paymentsResult.data || [];
    const leadsHistory = leadsHistoryResult.data || [];
    const statusCounts = statusCountsResult.data || [];

     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRevenue = payments.reduce((acc: any, curr: any) => acc + (Number(curr.amount) || 0), 0) || 0;

    // 5. Conversion Rate
    const conversionRate = totalLeads ? ((convertedLeads || 0) / totalLeads) * 100 : 0;

    // 6. Chart Data: Leads Over Time
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leadsOverTime = Object.values(leadsHistory.reduce((acc: any, lead: any) => {
      const date = new Date(lead.created_at).toLocaleDateString();
      acc[date] = { date, count: (acc[date]?.count || 0) + 1 };
      return acc;
    }, {}));

    // 7. Conversion Data
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversionData = Object.values(statusCounts.reduce((acc: any, lead: any) => {
      const name = lead.status.toUpperCase();
      acc[name] = { name, value: (acc[name]?.value || 0) + 1 };
      return acc;
    }, {}));

    return NextResponse.json(apiResponse(true, {
        totalLeads: totalLeads || 0,
        convertedLeads: convertedLeads || 0,
        totalClients: totalClients || 0,
        totalProjects: totalProjects || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        conversionRate: conversionRate.toFixed(2),
        leadsOverTime: leadsOverTime.slice(-7),
        revenueByMonth: [], 
        conversionData
    }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("Stats GET", error);
    return NextResponse.json(apiResponse(false, null, "Internal error"), { status: 500 });
  }
}
