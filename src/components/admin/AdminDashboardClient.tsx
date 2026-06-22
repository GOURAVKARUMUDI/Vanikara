"use client";

import React from "react";
import dynamic from "next/dynamic";

const CRMOverview = dynamic(() => import("@/components/admin/CRMOverview"), { ssr: false });
const LeadsTable = dynamic(() => import("@/components/admin/LeadsTable"), { ssr: false });
const ClientsTable = dynamic(() => import("@/components/admin/ClientsTable"), { ssr: false });
const PaymentsTable = dynamic(() => import("@/components/admin/PaymentsTable"), { ssr: false });
const PackagesManager = dynamic(() => import("@/components/admin/PackagesManager"), { ssr: false });
const UsersManager = dynamic(() => import("@/components/admin/UsersManager"), { ssr: false });
const ProjectsManager = dynamic(() => import("@/components/admin/ProjectsManager"), { ssr: false });
const ProductsManager = dynamic(() => import("@/components/admin/ProductsManager"), { ssr: false });
const AIManager = dynamic(() => import("@/components/admin/AIManager"), { ssr: false });
const ContactManager = dynamic(() => import("@/components/admin/ContactManager"), { ssr: false });
const CareersManager = dynamic(() => import("@/components/admin/CareersManager"), { ssr: false });
const SettingsManager = dynamic(() => import("@/components/admin/SettingsManager"), { ssr: false });
const PrivacyManager = dynamic(() => import("@/components/admin/PrivacyManager"), { ssr: false });
const AdminScene = dynamic(() => import("@/components/admin/AdminScene"), { ssr: false });

interface Props {
  user: {
    email?: string;
  };
  tab: string;
}

export default function AdminDashboardClient({ user, tab: initialTab }: Props) {
  const [activeTab, setActiveTab] = React.useState(initialTab || "overview");

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    window.history.pushState(null, '', `?tab=${id}`);
  };
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "projects", label: "Projects" },
    { id: "products", label: "Products" },
    { id: "ai", label: "AI Console" },
    { id: "careers", label: "Careers" },
    { id: "contacts", label: "Contacts" },
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
            <button 
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === t.id 
                  ? "bg-[var(--accent-color)] text-white shadow-md" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Dynamic Content */}
        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "overview" && (
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

          {activeTab === "users" && <UsersManager />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "ai" && <AIManager />}
          {activeTab === "careers" && <CareersManager />}
          {activeTab === "contacts" && <ContactManager />}



          {activeTab === "leads" && <LeadsTable />}
          {activeTab === "clients" && <ClientsTable />}
          {activeTab === "payments" && <PaymentsTable />}
          {activeTab === "packages" && <PackagesManager />}
          {activeTab === "settings" && <SettingsManager />}
          {activeTab === "privacy" && <PrivacyManager />}
        </main>
      </div>
    </div>
  );
}
