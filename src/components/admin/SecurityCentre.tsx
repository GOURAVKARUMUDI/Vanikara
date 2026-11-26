"use client";

import useSWR from "swr";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

interface SecurityPayload {
  data?: {
    currentAdmin: { username: string; role: string; sessionExpiresAt: number };
    blockedUsersCount: number;
    warnings: { level: "warning" | "info"; title: string; detail: string }[];
    auditLogs: {
      id: string;
      admin_email: string;
      action: string;
      target_id: string;
      created_at: string;
    }[];
  };
}

export default function SecurityCentre() {
  const { data, isLoading, error } = useSWR<SecurityPayload>("/api/admin/security", fetcher);
  const d = data?.data;

  if (isLoading) return <div className="surface p-6 text-sm text-fg-muted">Loading security telemetry...</div>;
  if (error || !d) return <div className="surface p-6 text-sm text-status-error">Unable to load security telemetry.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="surface p-5">
          <p className="font-mono text-xs uppercase text-fg-subtle">Active Admin Role</p>
          <p className="mt-2 font-mono text-lg font-semibold uppercase text-intel">
            {d.currentAdmin.role.replace(/_/g, " ")}
          </p>
          <p className="mt-1 text-xs text-fg-muted">Operator: {d.currentAdmin.username}</p>
        </div>
        <div className="surface p-5">
          <p className="font-mono text-xs uppercase text-fg-subtle">Session Expiration</p>
          <p className="mt-2 text-lg font-semibold text-fg">
            {new Date(d.currentAdmin.sessionExpiresAt * 1000).toLocaleTimeString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-fg-muted">Signed HttpOnly HMAC-SHA256 cookie</p>
        </div>
        <div className="surface p-5">
          <p className="font-mono text-xs uppercase text-fg-subtle">Blocked Public Users</p>
          <p className="mt-2 text-lg font-semibold text-fg tabular-nums">{d.blockedUsersCount}</p>
          <p className="mt-1 text-xs text-fg-muted">Enforced server-side on session reads</p>
        </div>
      </div>

      {d.warnings.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Configuration Notices
          </h3>
          {d.warnings.map((w) => (
            <div
              key={w.title}
              className={`flex items-start gap-3 rounded-card border p-4 text-sm ${
                w.level === "warning"
                  ? "border-status-warning/40 bg-status-warning/10 text-fg"
                  : "border-line bg-surface-secondary text-fg-muted"
              }`}
            >
              {w.level === "warning" ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" />
              ) : (
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-intel" />
              )}
              <div>
                <p className="font-semibold text-fg">{w.title}</p>
                <p className="mt-0.5 text-xs text-fg-muted">{w.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-intel" />
          <h3 className="text-base font-semibold text-fg">Immutable Administrative Audit Log</h3>
        </div>
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {d.auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-fg-muted">
                    No administrative audit events recorded yet.
                  </td>
                </tr>
              ) : (
                d.auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 font-mono text-xs text-fg-subtle">
                      {new Date(log.created_at).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-medium text-fg">{log.admin_email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-intel">{log.action}</td>
                    <td className="px-4 py-3 font-mono text-xs text-fg-muted">{log.target_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
