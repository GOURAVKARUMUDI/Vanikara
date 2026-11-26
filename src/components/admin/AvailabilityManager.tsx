"use client";

import { useEffect, useState } from "react";
import { Power } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";

/** Keep in sync with SERVICES in src/lib/availability.ts. */
const SERVICE_ROWS: { key: string; label: string }[] = [
  { key: "contact", label: "General contact submissions" },
  { key: "business_enquiries", label: "Business enquiries" },
  { key: "enterprise_enquiries", label: "Enterprise enquiries" },
  { key: "restaurant_partnerships", label: "Restaurant partnerships" },
  { key: "demo_requests", label: "Demo requests (CYGMA-RI)" },
  { key: "career_applications", label: "Career applications" },
  { key: "newsletter", label: "Newsletter subscriptions" },
  { key: "telephone_support", label: "Telephone support" },
  { key: "public_office_map", label: "Public office map" },
  { key: "recruitment", label: "Recruitment availability" },
];

/**
 * Central switches for public services. Each one is independent, every one
 * starts disabled, and the server enforces the setting on every request.
 * Enable a form only after its SMTP and submission workflow has been tested.
 */
export default function AvailabilityManager() {
  const [state, setState] = useState<Record<string, boolean> | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/availability", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setState(json.data);
        else setError(json.error || "Could not load service settings.");
      })
      .catch(() => setError("Could not load service settings."));
  }, []);

  const toggle = async (key: string, enabled: boolean) => {
    setPending(key);
    setError(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: key, enabled }),
      });
      const json = await res.json();
      if (json.success) setState(json.data);
      else setError(json.error || "Change was not saved.");
    } catch {
      setError("Change was not saved.");
    } finally {
      setPending(null);
    }
  };

  return (
    <Card hover={false}>
      <CardBody>
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
          <Power className="h-4 w-4 text-[var(--accent-color)]" />
          Public services
        </h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Public forms stay unavailable until each service is verified and switched on here.
        </p>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        {!state ? (
          <p className="mt-4 text-xs text-[var(--text-secondary)]">Loading…</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--border-color)]">
            {SERVICE_ROWS.map((row) => {
              const enabled = state[row.key] === true;
              return (
                <li key={row.key} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="text-[var(--text-primary)]">{row.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={`${row.label}: ${enabled ? "enabled" : "disabled"}`}
                    disabled={pending === row.key}
                    onClick={() => toggle(row.key, !enabled)}
                    className={`rounded px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                      enabled ? "bg-emerald-600 text-white" : "border border-[var(--border-color)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
