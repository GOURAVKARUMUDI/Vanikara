"use client";

import useSWR from "swr";
import AccountShell from "@/components/account/AccountShell";
import Button from "@/components/ui/Button";
import { fetcher } from "@/lib/fetcher";

interface EnquiryRow {
  id: string;
  source: string;
  status: string;
  created_at: string;
}

export default function AccountEnquiriesPage() {
  const { data, isLoading, error } = useSWR<{ data?: { enquiries: EnquiryRow[] } }>(
    "/api/account/records",
    fetcher
  );
  const enquiries = data?.data?.enquiries ?? [];

  return (
    <AccountShell
      title="My Enquiries"
      subtitle="Track enquiries and interest registrations submitted with your verified email address."
    >
      {isLoading ? (
        <div className="surface p-8 text-sm text-fg-muted">Loading enquiries...</div>
      ) : error ? (
        <div className="surface p-8 text-sm text-status-error">Failed to load enquiries.</div>
      ) : enquiries.length === 0 ? (
        <div className="surface p-8">
          <p className="text-base font-semibold text-fg">No enquiries found</p>
          <p className="mt-1 text-sm text-fg-muted">
            Contact messages or interest registrations submitted under your verified email will appear here.
          </p>
          <div className="mt-5">
            <Button href="/contact" variant="outline" size="sm">
              Contact Vanikara
            </Button>
          </div>
        </div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-5 py-3">Category / Source</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {enquiries.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3.5 font-medium capitalize text-fg">
                    {item.source.replace(/[:_]/g, " ")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded bg-surface-secondary px-2 py-0.5 font-mono text-xs font-medium capitalize text-fg">
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-fg-subtle">
                    {new Date(item.created_at).toLocaleDateString("en-IN")}
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
