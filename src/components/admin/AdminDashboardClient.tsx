"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FOUNDERS_AND_LEADERSHIP } from "@/data/company";
import { BrandSymbol } from "@/components/brand/BrandMark";

const CRMOverview = dynamic(() => import("@/components/admin/CRMOverview"), { ssr: false });
const LeadsTable = dynamic(() => import("@/components/admin/LeadsTable"), { ssr: false });
const UsersManager = dynamic(() => import("@/components/admin/UsersManager"), { ssr: false });
const ContactManager = dynamic(() => import("@/components/admin/ContactManager"), { ssr: false });
const SettingsManager = dynamic(() => import("@/components/admin/SettingsManager"), { ssr: false });
const PrivacyManager = dynamic(() => import("@/components/admin/PrivacyManager"), { ssr: false });

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
    { id: "contacts", label: "Contacts & Inquiries" },
    { id: "users", label: "Users" },
    { id: "settings", label: "Settings" },
    { id: "privacy", label: "Privacy Control" },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-12">
      <div className="max-w-7xl mx-auto py-12 px-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-[var(--glass-border)] pb-8">
          <div className="flex items-center gap-4">
            <BrandSymbol size={36} alt="" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Admin</h1>
              <p className="mt-1 text-sm text-fg-muted">Internal operations for VANIKARA</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-2.5 rounded-2xl shadow-sm backdrop-blur-md">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase bg-action">
              {user.email?.[0]}
            </div>
            <div className="text-xs">
              <div className="text-[var(--text-primary)] font-bold">{user.email}</div>
              <div className="text-[var(--text-secondary)] uppercase tracking-widest font-mono text-[8px] mt-0.5">Admin Role Verified</div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap gap-1.5 mb-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-1.5 rounded-2xl w-fit backdrop-blur-md">
          {tabs.map((t) => (
            <button 
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
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
        <main className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <CRMOverview />

              {/* Leadership Registry Overview */}
              <div className="p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl shadow-sm backdrop-blur-md">
                <h2 className="text-base font-display font-black text-[var(--text-primary)] mb-6 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-1.5 h-5 bg-[var(--accent-color)] rounded-full inline-block"></span>
                  Verified Leadership Registry
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FOUNDERS_AND_LEADERSHIP.map((leader) => (
                    <div key={leader.id} className="p-4 rounded-2xl bg-white/5 border border-[var(--glass-border)] space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--accent-color)]">
                        {leader.designation}
                      </span>
                      <p className="text-[var(--text-primary)] font-bold text-sm font-display">
                        {leader.fullName}
                      </p>
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                        {leader.responsibilities.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <LeadsTable />
              </div>
            </div>
          )}

          {activeTab === "contacts" && <ContactManager />}
          {activeTab === "users" && <UsersManager />}
          {activeTab === "settings" && <SettingsManager />}
          {activeTab === "privacy" && <PrivacyManager />}
        </main>
      </div>
    </div>
  );
}
