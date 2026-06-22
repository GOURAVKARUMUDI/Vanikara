import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/isAdmin";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Startup OS | Vanikara",
  description: "Internal operating system and ecosystem control panel for VANIKARA."
};

export default async function AdminPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tab?: string }> 
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // To strictly enforce database-backed RBAC, check the user object and metadata.
  if (!isAdmin(user)) {
    redirect("/dashboard");
  }

  const { tab = "overview" } = await searchParams;

  return <AdminDashboardClient user={user} tab={tab} />;
}
