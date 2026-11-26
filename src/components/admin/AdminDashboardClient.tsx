"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FilePenLine,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { Founder } from "@/data/company";
import BrandMark from "@/components/brand/BrandMark";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

const CRMOverview = dynamic(() => import("@/components/admin/CRMOverview"), { ssr: false });
const LeadsTable = dynamic(() => import("@/components/admin/LeadsTable"), { ssr: false });
const UsersManager = dynamic(() => import("@/components/admin/UsersManager"), { ssr: false });
const ContactManager = dynamic(() => import("@/components/admin/ContactManager"), { ssr: false });
const SettingsManager = dynamic(() => import("@/components/admin/SettingsManager"), { ssr: false });
const PrivacyManager = dynamic(() => import("@/components/admin/PrivacyManager"), { ssr: false });
const ContentEditor = dynamic(() => import("@/components/admin/ContentEditor"), { ssr: false });
const ApplicationsManager = dynamic(() => import("@/components/admin/ApplicationsManager"), { ssr: false });
const JobsManager = dynamic(() => import("@/components/admin/JobsManager"), { ssr: false });
const RegistrationsManager = dynamic(() => import("@/components/admin/RegistrationsManager"), { ssr: false });
const SecurityCentre = dynamic(() => import("@/components/admin/SecurityCentre"), { ssr: false });

interface Props {
  username: string;
  people: Founder[];
  expiresAt: number;
  tab: string;
}

const TABS = [
  { id: "overview", label: "Command Centre", group: "Operations", Icon: LayoutDashboard },
  { id: "content", label: "Website Studio", group: "Content", Icon: FilePenLine },
  { id: "contacts", label: "CRM & Enquiries", group: "Operations", Icon: Inbox },
  { id: "applications", label: "Recruitment", group: "People", Icon: Briefcase },
  { id: "products", label: "Products & Interest", group: "Operations", Icon: Layers },
  { id: "users", label: "User Management", group: "People", Icon: Users },
  { id: "security", label: "Security & Audit", group: "Governance", Icon: ShieldAlert },
  { id: "privacy", label: "Privacy Centre", group: "Governance", Icon: ShieldCheck },
  { id: "settings", label: "System Health", group: "Governance", Icon: Activity },
];

export default function AdminDashboardClient({ username, expiresAt, tab: initialTab }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : "overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setMobileNavOpen(false);
    window.history.pushState(null, "", `?tab=${id}`);
  };

  React.useEffect(() => {
    const onPop = () => {
      const t = new URLSearchParams(window.location.search).get("tab") ?? "overview";
      setActiveTab(TABS.some((x) => x.id === t) ? t : "overview");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  const currentTabMeta = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="-mt-[var(--header-height)] flex min-h-screen bg-surface-secondary text-fg">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden flex-col border-r border-line bg-surface transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <BrandMark variant="symbol" size={22} />
              <span className="font-display text-sm font-bold tracking-tight text-fg">Vanikara Console</span>
            </div>
          ) : (
            <BrandMark variant="symbol" size={22} />
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-compact p-1.5 text-fg-muted hover:bg-surface-sunken hover:text-fg"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav aria-label="Console modules" className="flex-1 space-y-1 overflow-y-auto p-3">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                title={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-compact px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-intel/10 text-intel"
                    : "text-fg-muted hover:bg-surface-sunken hover:text-fg"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          {!collapsed && (
            <div className="mb-3 rounded-compact bg-surface-secondary px-3 py-2 text-xs">
              <p className="font-semibold text-fg">{username}</p>
              <p className="font-mono text-[10px] text-fg-subtle">
                Session until {new Date(expiresAt * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}
          <button
            type="button"
            disabled={signingOut}
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-compact px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-status-error/10 hover:text-status-error"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{signingOut ? "Signing out..." : "Sign out"}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle console menu"
              className="rounded-compact p-2 text-fg-muted hover:bg-surface-sunken lg:hidden"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <span className="hidden font-mono text-xs uppercase text-fg-subtle sm:inline">Vanikara Console</span>
              <span className="hidden text-fg-subtle sm:inline">/</span>
              <span className="font-semibold text-fg">{currentTabMeta.label}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-compact border border-line px-3 text-xs font-medium text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
            >
              <span>Live site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <ThemeSwitcher />
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="border-b border-line bg-surface p-3 lg:hidden">
            <div className="grid grid-cols-2 gap-1.5">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabChange(id)}
                  className={`flex items-center gap-2 rounded-compact px-3 py-2 text-xs font-medium ${
                    activeTab === id ? "bg-intel/10 text-intel" : "text-fg-muted hover:bg-surface-sunken"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <CRMOverview />
                <LeadsTable />
              </div>
            )}
            {activeTab === "content" && <ContentEditor />}
            {activeTab === "contacts" && <ContactManager />}
            {activeTab === "applications" && (
              <div className="space-y-10">
                <JobsManager />
                <div className="rule" />
                <ApplicationsManager />
              </div>
            )}
            {activeTab === "products" && <RegistrationsManager />}
            {activeTab === "users" && <UsersManager />}
            {activeTab === "security" && <SecurityCentre />}
            {activeTab === "privacy" && <PrivacyManager />}
            {activeTab === "settings" && <SettingsManager />}
          </div>
        </main>
      </div>
    </div>
  );
}
