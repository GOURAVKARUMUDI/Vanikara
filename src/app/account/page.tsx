"use client";

import useSWR from "swr";
import Link from "next/link";
import { ArrowRight, Briefcase, Inbox, ShieldCheck } from "lucide-react";
import AccountShell from "@/components/account/AccountShell";
import { fetcher } from "@/lib/fetcher";

interface AccountData {
  data?: {
    profile: { name: string; email: string; picture: string | null };
    applications: { id: string }[];
    enquiries: { id: string }[];
    privacyRequests: { id: string }[];
  };
}

export default function AccountOverviewPage() {
  const { data, isLoading, error } = useSWR<AccountData>("/api/account/records", fetcher);
  const d = data?.data;

  return (
    <AccountShell
      title="Account Overview"
      subtitle="View your verified profile and track submissions associated with your email address."
    >
      {isLoading ? (
        <div className="surface p-8 text-sm text-fg-muted">Loading your account details...</div>
      ) : error || !d ? (
        <div className="surface p-8 text-sm text-status-error">Unable to load account details. Please refresh or sign in again.</div>
      ) : (
        <div className="space-y-6">
          <div className="surface p-6">
            <p className="font-mono text-xs uppercase text-fg-subtle">Verified Profile</p>
            <p className="mt-2 text-lg font-semibold text-fg">{d.profile.name}</p>
            <p className="text-sm text-fg-muted">{d.profile.email}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/account/applications" className="surface card-interactive group p-6">
              <Briefcase className="h-5 w-5 text-intel" />
              <p className="mt-4 text-2xl font-bold text-fg tabular-nums">{d.applications.length}</p>
              <p className="mt-1 flex items-center justify-between text-sm text-fg-muted">
                <span>Applications</span>
                <ArrowRight className="arrow-nudge h-4 w-4 text-intel" />
              </p>
            </Link>

            <Link href="/account/enquiries" className="surface card-interactive group p-6">
              <Inbox className="h-5 w-5 text-intel" />
              <p className="mt-4 text-2xl font-bold text-fg tabular-nums">{d.enquiries.length}</p>
              <p className="mt-1 flex items-center justify-between text-sm text-fg-muted">
                <span>Enquiries</span>
                <ArrowRight className="arrow-nudge h-4 w-4 text-intel" />
              </p>
            </Link>

            <Link href="/account/privacy" className="surface card-interactive group p-6">
              <ShieldCheck className="h-5 w-5 text-intel" />
              <p className="mt-4 text-2xl font-bold text-fg tabular-nums">{d.privacyRequests.length}</p>
              <p className="mt-1 flex items-center justify-between text-sm text-fg-muted">
                <span>Privacy Requests</span>
                <ArrowRight className="arrow-nudge h-4 w-4 text-intel" />
              </p>
            </Link>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
