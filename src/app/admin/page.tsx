import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "Admin",
  description: "Internal operations console for VANIKARA.",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // The proxy already guards /admin; this is the authoritative check.
  const session = await getAdminSession();
  if (!session) redirect("/login?next=/admin");

  const { tab = "overview" } = await searchParams;

  const { people } = await getSiteContent();

  return <AdminDashboardClient username={session.u} people={people} expiresAt={session.exp} tab={tab} />;
}
