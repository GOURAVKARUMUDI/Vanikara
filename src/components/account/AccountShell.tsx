"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Inbox, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import { googleSignOut } from "@/components/auth/session";

const LINKS = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/applications", label: "Applications", icon: Briefcase },
  { href: "/account/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/account/privacy", label: "Privacy & Data", icon: ShieldCheck },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-8 border-b border-line pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-intel">Vanikara Account</p>
        <h1 className="text-headline mt-2 text-fg">{title}</h1>
        <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Account navigation" className="surface p-2">
            <ul className="space-y-1">
              {LINKS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-compact px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-surface-secondary text-intel"
                          : "text-fg-muted hover:bg-surface-sunken hover:text-fg"
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="rule my-2" />
            <button
              type="button"
              onClick={() => googleSignOut()}
              className="flex w-full items-center gap-2.5 rounded-compact px-3 py-2.5 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-surface-sunken hover:text-status-error"
            >
              <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </nav>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
