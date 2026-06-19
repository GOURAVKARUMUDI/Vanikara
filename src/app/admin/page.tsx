import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/isAdmin";

import CRMOverview from "@/components/admin/CRMOverview";
import LeadsTable from "@/components/admin/LeadsTable";
import ClientsTable from "@/components/admin/ClientsTable";
import PaymentsTable from "@/components/admin/PaymentsTable";
import PackagesManager from "@/components/admin/PackagesManager";
import UsersManager from "@/components/admin/UsersManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import AIManager from "@/components/admin/AIManager";
import ContactManager from "@/components/admin/ContactManager";
import CareersManager from "@/components/admin/CareersManager";
import SettingsManager from "@/components/admin/SettingsManager";
import PrivacyManager from "@/components/admin/PrivacyManager";
import AdminScene from "@/components/admin/AdminScene";

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

  if (!isAdmin(user.email)) {
    redirect("/dashboard");
  }

  const { tab = "overview" } = await searchParams;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "projects", label: "Projects" },
    { id: "products", label: "Products" },
    { id: "ai", label: "AI Console" },
    { id: "careers", label: "Careers" },
    { id: "contacts", label: "Contacts" },
    { id: "roadmap", label: "Roadmap" },
    { id: "analytics", label: "Analytics" },
    { id: "leads", label: "Leads" },
    { id: "clients", label: "Clients" },
    { id: "payments", label: "Payments" },
    { id: "packages", label: "Packages" },
    { id: "settings", label: "Settings" },
    { id: "privacy", label: "Privacy Control" },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-12">
      <AdminScene />
      <div className="max-w-7xl mx-auto py-12 px-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-[var(--glass-border)] pb-8">
          <div>
            <h1 className="text-3xl font-display font-black tracking-wider text-[var(--text-primary)]">
              ECOSYSTEM <span className="gradient-text">CONTROL PANEL</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-1.5">
              Vanikara Startup Operating System
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-2.5 rounded-2xl shadow-sm backdrop-blur-md">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase bg-gradient-to-r from-blue-600 to-indigo-600">
              {user.email?.[0]}
            </div>
            <div className="text-xs">
              <div className="text-[var(--text-primary)] font-bold">{user.email}</div>
              <div className="text-[var(--text-secondary)] uppercase tracking-widest font-black text-[8px] mt-0.5">Super Admin</div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap gap-1.5 mb-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-1.5 rounded-2xl w-fit backdrop-blur-md">
          {tabs.map((t) => (
            <a 
              key={t.id}
              href={`/admin?tab=${t.id}`}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                tab === t.id 
                  ? "bg-[var(--accent-color)] text-white shadow-md" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {t.label}
            </a>
          ))}
        </nav>

        {/* Dynamic Content */}
        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tab === "overview" && (
            <div className="space-y-8">
              <CRMOverview />

              {/* Founding Team Overview */}
              <div className="p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2rem] shadow-sm backdrop-blur-md">
                <h2 className="text-lg font-display font-black text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-1.5 h-6 bg-[var(--accent-color)] rounded-full inline-block"></span>
                  Founding Team Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Vision & Ideation</span>
                    <p className="text-[var(--text-primary)] font-bold text-base">Mirayla Giri Charan</p>
                    <p className="text-[var(--text-secondary)] text-xs">Founding partner focused on product scoping and roadmap wireframes.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Technical Execution</span>
                    <p className="text-[var(--text-primary)] font-bold text-base">Gourav Karumudi</p>
                    <p className="text-[var(--text-secondary)] text-xs">Founding partner focused on secure React systems and database setups.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Marketing & Growth</span>
                    <p className="text-[var(--text-primary)] font-bold text-base">Chejarala Hari Charan Reddy</p>
                    <p className="text-[var(--text-secondary)] text-xs">Founding partner focused on partner campaigns and student onboarding.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LeadsTable />
                <ClientsTable />
              </div>
            </div>
          )}

          {tab === "users" && <UsersManager />}

          {tab === "projects" && <ProjectsManager />}

          {tab === "products" && <ProductsManager />}

          {tab === "ai" && <AIManager />}

          {tab === "careers" && <CareersManager />}

          {tab === "contacts" && <ContactManager />}

          {tab === "roadmap" && (
            <div className="p-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2.5rem] shadow-sm flex items-center justify-center text-center backdrop-blur-md">
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-black text-[var(--text-primary)]">Roadmap Management</h2>
                <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">Plan future feature rollouts, schedule ecosystem expansions, and align the founding team on long-term goals.</p>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/15">🚧 Module In Development</div>
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div className="p-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2.5rem] shadow-sm flex items-center justify-center text-center backdrop-blur-md">
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-black text-[var(--text-primary)]">Product Analytics</h2>
                <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">Monitor user engagement, track active sessions, and analyze core metrics across the VANIKARA ecosystem.</p>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/15">🚧 Module In Development</div>
              </div>
            </div>
          )}

          {tab === "leads" && <LeadsTable />}
          {tab === "clients" && <ClientsTable />}
          {tab === "payments" && <PaymentsTable />}
          {tab === "packages" && <PackagesManager />}
          {tab === "settings" && <SettingsManager />}
          {tab === "privacy" && <PrivacyManager />}
        </main>
      </div>
    </div>
  );
}
