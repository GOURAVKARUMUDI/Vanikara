"use client";

import { useState } from "react";
import useSWR from "swr";
import { Briefcase, ChevronDown, FileText, Mail, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  applicationType: string | null;
  portfolio: string | null;
  coverLetter: string | null;
  status: "new" | "reviewing" | "shortlisted" | "rejected";
  createdAt: string;
  resumeLink: string | null;
}

const STATUSES: Application["status"][] = ["new", "reviewing", "shortlisted", "rejected"];
const STATUS_STYLE: Record<Application["status"], string> = {
  new: "bg-brand-orange/10 text-ambition",
  reviewing: "bg-intel/10 text-intel",
  shortlisted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-surface-sunken text-fg-subtle",
};

/**
 * Job applications from the Careers page. Refreshes every 20 seconds, so
 * new applications appear without reloading.
 */
export default function ApplicationsManager() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/applications", fetcher, { refreshInterval: 20_000, revalidateOnFocus: true });
  const apps: Application[] = data?.data ?? [];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Application["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (app: Application, status: Application["status"]) => {
    setBusy(app.id);
    mutate({ ...data, data: apps.map((a) => (a.id === app.id ? { ...a, status } : a)) }, false);
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: app.id, status }),
    }).catch(() => {});
    setBusy(null);
    mutate();
  };

  const remove = async (app: Application) => {
    if (!confirm(`Delete ${app.name}'s application and résumé? This cannot be undone.`)) return;
    setBusy(app.id);
    await fetch(`/api/admin/applications?id=${app.id}`, { method: "DELETE" }).catch(() => {});
    setBusy(null);
    mutate();
  };

  const q = query.trim().toLowerCase();
  const shown = apps.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (!q || [a.name, a.email, a.position, a.phone ?? ""].some((v) => v?.toLowerCase().includes(q)))
  );
  const counts = Object.fromEntries(STATUSES.map((s) => [s, apps.filter((a) => a.status === s).length]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
            <Briefcase aria-hidden="true" className="h-5 w-5 text-intel" />
            Applications
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            {apps.length} received · {counts.new ?? 0} new. Submitted from the Careers page.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, role…"
              aria-label="Search applications"
              className="h-10 w-full rounded-compact border border-line-strong bg-surface-raised/80 pl-10 pr-4 text-sm text-fg focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15"
            />
          </div>
          <button type="button" onClick={() => mutate()} aria-label="Refresh" className="btn btn-secondary btn-md shrink-0 !px-3">
            <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === s ? "bg-action text-white" : "border border-line text-fg-muted hover:text-fg"
            }`}
          >
            {s} {s === "all" ? `(${apps.length})` : `(${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      <div className="surface overflow-hidden rounded-panel">
        {isLoading && !data && !error ? (
          <p className="p-12 text-center text-sm text-fg-subtle">Loading applications…</p>
        ) : error || (data && !data.success) ? (
          <p className="p-12 text-center text-sm text-fg-muted">Couldn&apos;t load applications. Check the database connection in Settings.</p>
        ) : shown.length === 0 ? (
          <p className="p-12 text-center text-sm text-fg-subtle">{apps.length ? "No applications match." : "No applications yet."}</p>
        ) : (
          <ul className="divide-y divide-[var(--border-subtle)]">
            {shown.map((a) => (
              <li key={a.id} className={busy === a.id ? "opacity-60" : ""}>
                <div className="flex flex-wrap items-center gap-3 p-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setOpen(open === a.id ? null : a.id)}
                    aria-expanded={open === a.id}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-fg-subtle transition-transform ${open === a.id ? "rotate-180" : ""}`} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-fg">{a.name}</span>
                      <span className="block truncate text-xs text-fg-muted">
                        {a.position}
                        {a.applicationType ? ` · ${a.applicationType}` : ""} · {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </span>
                  </button>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[a.status] ?? STATUS_STYLE.new}`}>{a.status}</span>
                  <select
                    value={a.status}
                    onChange={(e) => setStatus(a, e.target.value as Application["status"])}
                    aria-label={`Status for ${a.name}`}
                    className="h-9 rounded-compact border border-line-strong bg-surface-raised px-2 text-xs font-semibold capitalize text-fg"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {open === a.id && (
                  <div className="space-y-4 border-t border-line bg-surface-sunken/30 p-4 text-sm sm:px-6">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 font-semibold text-intel">
                        <Mail aria-hidden="true" className="h-4 w-4" /> {a.email}
                      </a>
                      {a.phone && (
                        <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 font-semibold text-intel">
                          <Phone aria-hidden="true" className="h-4 w-4" /> {a.phone}
                        </a>
                      )}
                      {a.portfolio && (
                        <a href={a.portfolio} target="_blank" rel="noopener noreferrer" className="font-semibold text-intel underline-offset-2 hover:underline">
                          Portfolio / LinkedIn
                        </a>
                      )}
                      {a.resumeLink ? (
                        <a href={a.resumeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-intel">
                          <FileText aria-hidden="true" className="h-4 w-4" /> Open résumé
                        </a>
                      ) : (
                        <span className="text-fg-subtle">No résumé</span>
                      )}
                    </div>
                    {a.coverLetter && <p className="whitespace-pre-wrap leading-relaxed text-fg-muted">{a.coverLetter}</p>}
                    <button
                      type="button"
                      onClick={() => remove(a)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg-muted hover:border-brand-red/40 hover:text-brand-red"
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Delete application
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
