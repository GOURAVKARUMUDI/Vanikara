"use client";

import useSWR from "swr";
import AccountShell from "@/components/account/AccountShell";
import Button from "@/components/ui/Button";
import { fetcher } from "@/lib/fetcher";

interface ApplicationRow {
  id: string;
  position: string;
  application_type: string | null;
  status: string;
  created_at: string;
}

export default function AccountApplicationsPage() {
  const { data, isLoading, error } = useSWR<{ data?: { applications: ApplicationRow[] } }>(
    "/api/account/records",
    fetcher
  );
  const apps = data?.data?.applications ?? [];

  return (
    <AccountShell
      title="My Applications"
      subtitle="Public-facing status updates for job and internship applications submitted with your verified email."
    >
      {isLoading ? (
        <div className="surface p-8 text-sm text-fg-muted">Loading applications...</div>
      ) : error ? (
        <div className="surface p-8 text-sm text-status-error">Failed to load applications.</div>
      ) : apps.length === 0 ? (
        <div className="surface p-8">
          <p className="text-base font-semibold text-fg">No applications found</p>
          <p className="mt-1 text-sm text-fg-muted">
            Applications submitted with your signed-in email address will appear here automatically.
          </p>
          <div className="mt-5">
            <Button href="/careers" variant="outline" size="sm">
              Explore Careers
            </Button>
          </div>
        </div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-5 py-3">Position</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {apps.map((app) => (
                <tr key={app.id}>
                  <td className="px-5 py-3.5 font-medium text-fg">{app.position}</td>
                  <td className="px-5 py-3.5 text-fg-muted">{app.application_type || "General"}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded bg-intel/10 px-2 py-0.5 font-mono text-xs font-medium capitalize text-intel">
                      {app.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-fg-subtle">
                    {new Date(app.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AccountShell>
  );
}
