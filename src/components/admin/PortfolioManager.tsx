"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { PortfolioItem, PortfolioVisibility } from "@/data/portfolio";

const STATUS_PRESETS = [
  "Planned long-term ecosystem",
  "Primary consumer initiative",
  "In Development",
  "Planned",
  "Proposed",
  "DPR / Planning Stage",
  "Future Exploration",
  "Research and Development",
  "Testing",
  "Operational",
  "Archived",
];

export default function PortfolioManager() {
  const { data, isLoading, mutate } = useSWR<{ data?: { items: PortfolioItem[]; storeReady: boolean } }>(
    "/api/portfolio?scope=admin",
    fetcher
  );
  const [ecosystemFilter, setEcosystemFilter] = useState("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const items = data?.data?.items ?? [];
  const storeReady = data?.data?.storeReady ?? true;

  const filtered =
    ecosystemFilter === "all" ? items : items.filter((item) => item.ecosystem === ecosystemFilter);

  const updateItem = async (id: string, patch: { developmentStatus?: string; visibility?: PortfolioVisibility }) => {
    setSavingId(id);
    setFeedback(null);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setFeedback(json?.error?.message || "Could not save portfolio update.");
      } else {
        setFeedback(`Updated "${json.data?.name}" live.`);
        mutate();
      }
    } catch {
      setFeedback("Network error while saving portfolio update.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-fg">Business &amp; Product Portfolio Hierarchy</h2>
          <p className="text-sm text-fg-muted">
            Configure development statuses and public/internal visibility live without code changes.
          </p>
        </div>

        <select
          aria-label="Filter by ecosystem"
          value={ecosystemFilter}
          onChange={(e) => setEcosystemFilter(e.target.value)}
          className="rounded-compact border border-line bg-surface px-3 py-2 text-xs font-medium text-fg"
        >
          <option value="all">All Ecosystems ({items.length})</option>
          <option value="consumer">Unified Consumer Ecosystem</option>
          <option value="cygma_ai">CYGMA_AI Ecosystem</option>
        </select>
      </div>

      {!storeReady && (
        <div className="rounded-compact border border-status-warning/40 bg-status-warning/10 p-3.5 text-xs text-fg">
          The <code className="font-mono">site_content</code> table is not yet initialized in Supabase. Changes cannot persist until the base SQL setup runs.
        </div>
      )}

      {feedback && (
        <p role="status" className="rounded-compact bg-intel/10 px-3 py-2 text-xs font-medium text-intel">
          {feedback}
        </p>
      )}

      {isLoading ? (
        <div className="surface p-6 text-sm text-fg-muted">Loading portfolio registry...</div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-4 py-3">Initiative</th>
                <th className="px-4 py-3">Ecosystem</th>
                <th className="px-4 py-3">Development Status</th>
                <th className="px-4 py-3">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((item) => (
                <tr key={item.id} className={savingId === item.id ? "opacity-60" : ""}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-fg">{item.name}</p>
                    <p className="text-xs text-fg-subtle">{item.category}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-fg-muted">
                    {item.ecosystem === "cygma_ai" ? "CYGMA_AI" : "Consumer"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Development status for ${item.name}`}
                      value={item.developmentStatus}
                      disabled={savingId === item.id}
                      onChange={(e) => updateItem(item.id, { developmentStatus: e.target.value })}
                      className="rounded border border-line bg-surface px-2.5 py-1 text-xs text-fg"
                    >
                      {!STATUS_PRESETS.includes(item.developmentStatus) && (
                        <option value={item.developmentStatus}>{item.developmentStatus}</option>
                      )}
                      {STATUS_PRESETS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Visibility for ${item.name}`}
                      value={item.visibility}
                      disabled={savingId === item.id}
                      onChange={(e) => updateItem(item.id, { visibility: e.target.value as PortfolioVisibility })}
                      className="rounded border border-line bg-surface px-2.5 py-1 text-xs capitalize text-fg"
                    >
                      <option value="public">Public</option>
                      <option value="internal">Internal Only</option>
                      <option value="draft">Draft</option>
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
