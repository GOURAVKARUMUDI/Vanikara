"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface RegRow {
  id: string;
  reference_code: string;
  product: string;
  category: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  city: string;
  status: string;
  created_at: string;
}

export default function RegistrationsManager() {
  const { data, isLoading, mutate } = useSWR<{ data?: { items: RegRow[]; tableReady: boolean } }>(
    "/api/registrations",
    fetcher
  );
  const items = data?.data?.items ?? [];
  const tableReady = data?.data?.tableReady ?? true;

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-fg">Product Interest Registrations</h2>
        <p className="text-sm text-fg-muted">
          Early interest submissions from restaurants, delivery partners, customers, and business partners.
        </p>
      </div>

      {!tableReady && (
        <div className="rounded-compact border border-status-warning/40 bg-status-warning/10 p-4 text-sm text-fg">
          The <code className="font-mono">product_registrations</code> table is not yet created. Registrations are currently captured in Contacts &amp; Enquiries as fallback until{" "}
          <code className="font-mono">supabase/migrations/20261126_v2_enterprise_schema.sql</code> is applied.
        </div>
      )}

      {isLoading ? (
        <div className="surface p-6 text-sm text-fg-muted">Loading registrations...</div>
      ) : items.length === 0 ? (
        <div className="surface p-8 text-center text-sm text-fg-muted">No product registrations recorded yet.</div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Org / City</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-mono text-xs text-fg">{row.reference_code}</td>
                  <td className="px-4 py-3 capitalize text-fg">{row.category.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-fg">{row.name}</p>
                    <p className="text-xs text-fg-muted">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">
                    {row.organization ? `${row.organization} · ` : ""}
                    {row.city}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Status for ${row.name}`}
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className="rounded border border-line bg-surface px-2 py-1 text-xs text-fg"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
