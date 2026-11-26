"use client";

import { useState } from "react";
import useSWR from "swr";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import AccountShell from "@/components/account/AccountShell";
import Button from "@/components/ui/Button";
import { fetcher } from "@/lib/fetcher";

const REQUEST_TYPES = [
  { id: "access", label: "Data Access Request" },
  { id: "correction", label: "Data Correction Request" },
  { id: "deletion", label: "Account / Data Deletion Request" },
  { id: "consent_withdrawal", label: "Consent Withdrawal" },
  { id: "grievance", label: "Privacy Grievance" },
] as const;

export default function AccountPrivacyPage() {
  const { data, mutate } = useSWR<{ data?: { privacyRequests: { id: string; reference_code: string; request_type: string; status: string; created_at: string }[] } }>(
    "/api/account/records",
    fetcher
  );
  const [requestType, setRequestType] = useState<(typeof REQUEST_TYPES)[number]["id"]>("access");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setReference(null);
    try {
      const res = await fetch("/api/account/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType, details }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error?.message || "Could not submit request.");
      } else {
        setReference(json.data?.reference ?? null);
        setDetails("");
        mutate();
      }
    } catch {
      setError("Network error while submitting request.");
    } finally {
      setSubmitting(false);
    }
  };

  const history = data?.data?.privacyRequests ?? [];

  return (
    <AccountShell
      title="Privacy & Data Rights"
      subtitle="Submit verified data access, correction, deletion, or consent withdrawal requests under applicable privacy standards."
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit} className="surface p-6 space-y-4">
          <h2 className="text-base font-semibold text-fg">Submit a verified privacy request</h2>
          <div>
            <label htmlFor="prv-type" className="block text-sm font-medium text-fg">
              Request type
            </label>
            <select
              id="prv-type"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as typeof requestType)}
              className="v2-input mt-1.5"
            >
              {REQUEST_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prv-details" className="block text-sm font-medium text-fg">
              Details (optional)
            </label>
            <textarea
              id="prv-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="v2-input mt-1.5 min-h-[90px]"
              placeholder="Provide any context that helps our Grievance Officer process your request..."
            />
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-compact bg-status-error/10 px-3 py-2 text-sm text-status-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {reference && (
            <div role="status" className="flex items-center gap-2 rounded-compact bg-status-success/10 px-3 py-2 text-sm text-status-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Request recorded. Reference: <span className="font-mono font-semibold">{reference}</span>
            </div>
          )}

          <Button type="submit" loading={submitting}>
            Submit Privacy Request
          </Button>
        </form>

        {history.length > 0 && (
          <div className="surface overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {history.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 font-mono text-xs text-fg">{r.reference_code}</td>
                    <td className="px-5 py-3 capitalize text-fg">{r.request_type.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3 font-mono text-xs capitalize text-intel">{r.status}</td>
                    <td className="px-5 py-3 text-fg-subtle">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AccountShell>
  );
}
