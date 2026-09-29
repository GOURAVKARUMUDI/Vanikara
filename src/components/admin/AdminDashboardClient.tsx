"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AlertTriangle, Inbox, LayoutDashboard, LogOut, Settings, ShieldCheck, Users } from "lucide-react";
import { FOUNDERS_AND_LEADERSHIP } from "@/data/company";
import { BrandSymbol } from "@/components/brand/BrandMark";

const CRMOverview = dynamic(() => import("@/components/admin/CRMOverview"), { ssr: false });
const LeadsTable = dynamic(() => import("@/components/admin/LeadsTable"), { ssr: false });
const UsersManager = dynamic(() => import("@/components/admin/UsersManager"), { ssr: false });
const ContactManager = dynamic(() => import("@/components/admin/ContactManager"), { ssr: false });
const SettingsManager = dynamic(() => import("@/components/admin/SettingsManager"), { ssr: false });
const PrivacyManager = dynamic(() => import("@/components/admin/PrivacyManager"), { ssr: false });

interface Props {
  username: string;
  /** Session expiry, seconds since epoch. */
  expiresAt: number;
  tab: string;
}

const TABS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "contacts", label: "Contacts & Inquiries", Icon: Inbox },
  { id: "users", label: "Users", Icon: Users },
  { id: "settings", label: "Settings", Icon: Settings },
  { id: "privacy", label: "Privacy Control", Icon: ShieldCheck },
];

export default function AdminDashboardClient({ username, expiresAt, tab: initialTab }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(
    TABS.some((t) => t.id === initialTab) ? initialTab : "overview"
  );
  const [signingOut, setSigningOut] = React.useState(false);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    window.history.pushState(null, "", `?tab=${id}`);
  };

  // Keep the tab in sync with browser back/forward
  React.useEffect(() => {
    const onPop = () => {
      const t = new URLSearchParams(window.location.search).get("tab") ?? "overview";
      setActiveTab(TABS.some((x) => x.id === t) ? t : "overview");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Return to sign-in when the session expires
  React.useEffect(() => {
    const ms = expiresAt * 1000 - Date.now();
    const timer = window.setTimeout(() => router.replace("/login?expired=1"), Math.max(0, ms));
    return () => window.clearTimeout(timer);
  }, [expiresAt, router]);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.dispatchEvent(new Event("vk-auth-change"));
      router.replace("/login");
      router.refresh();
    }
  };

  // Database health: every admin panel reads from Supabase, so say clearly
  // when it cannot be reached instead of leaving empty or broken panels.
  const [dbDown, setDbDown] = React.useState(false);
  React.useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setDbDown(body?.success === true && body.data?.dbConnected === false))
      .catch(() => {});
  }, []);

  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <div className="min-h-screen bg-transparent pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-line pb-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <BrandSymbol size={36} alt="" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Admin</h1>
              <p className="mt-1 text-sm text-fg-muted">Internal operations for VANIKARA</p>
            </div>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="liquid-glass glass flex flex-1 items-center gap-3 rounded-card px-4 py-2.5 sm:flex-none">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-action text-xs font-bold uppercase text-white">
                {username[0]}
              </div>
              <div className="text-xs">
                <div className="font-bold text-fg">{displayName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-fg-muted">
                  <span aria-hidden="true" className="live-dot !h-1.5 !w-1.5" />
                  Signed in as admin
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="btn btn-secondary btn-md shrink-0"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </header>

        {dbDown && (
          <div role="alert" className="mb-8 flex items-start gap-3 rounded-card border border-brand-orange/30 bg-brand-orange/10 p-4 text-sm text-fg">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ambition" />
            <div>
              <p className="font-semibold">The database can&apos;t be reached.</p>
              <p className="mt-1 text-fg-muted">
                Leads, clients and users are stored in Supabase, which isn&apos;t responding. Check that the Supabase
                project is active and that <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> points to it. See the
                Settings tab for details.
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation — scrolls sideways on small screens */}
        <nav aria-label="Admin sections" className="-mx-4 mb-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="liquid-glass glass flex w-max gap-1 rounded-card p-1.5">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-compact px-4 py-2 text-[0.8125rem] font-semibold transition-all ${
                  activeTab === id ? "bg-action text-white shadow-md" : "text-fg-muted hover:bg-surface-sunken/70 hover:text-fg"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Dynamic Content */}
        <main key={activeTab} className="page-enter">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <CRMOverview />

              {/* Leadership Registry Overview */}
              <div className="surface rounded-panel p-6 sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-fg">
                  <span className="inline-block h-5 w-1.5 rounded-full bg-action"></span>
                  Leadership registry
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {FOUNDERS_AND_LEADERSHIP.map((leader) => (
                    <div key={leader.id} className="space-y-1.5 rounded-card border border-line bg-surface-sunken/50 p-4">
                      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-intel">
                        {leader.designation}
                      </span>
                      <p className="text-sm font-bold text-fg">{leader.fullName}</p>
                      <p className="text-xs leading-relaxed text-fg-muted">
                        {leader.responsibilities?.join(", ") || ""}
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
