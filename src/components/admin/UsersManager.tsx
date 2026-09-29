"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle2, RefreshCw, Search, Users } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";

interface SiteUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string;
  blocked: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

/**
 * People who signed in on the website with Google. Accounts give visitors
 * no extra access, so the only admin action is blocking an account (it can
 * no longer sign in). Admin access is never granted from here.
 */
export default function UsersManager() {
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load users");
      setUsers(json.data || []);
    } catch {
      setError("Couldn't load users. Check the database connection in Settings.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setBlocked = async (user: SiteUser, blocked: boolean) => {
    if (blocked && !confirm(`Block ${user.email}? They won't be able to sign in until unblocked.`)) return;
    try {
      setUpdatingId(user.id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, blocked }),
      });
      if (res.ok) setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, blocked } : u)));
    } finally {
      setUpdatingId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = users.filter(
    (u) => !query || u.email?.toLowerCase().includes(query) || u.name?.toLowerCase().includes(query)
  );
  const activeCount = users.filter((u) => !u.blocked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
            <Users aria-hidden="true" className="h-5 w-5 text-intel" />
            Website accounts
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            {users.length} signed up with Google · {activeCount} active. Accounts don&apos;t grant any admin access.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              aria-label="Search users"
              className="h-10 w-full rounded-compact border border-line-strong bg-surface-raised/80 pl-10 pr-4 text-sm text-fg focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15"
            />
          </div>
          <button type="button" onClick={fetchUsers} aria-label="Refresh" className="btn btn-secondary btn-md shrink-0 !px-3">
            <RefreshCw aria-hidden="true" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <Card hover={false}>
        <CardBody className="overflow-x-auto !p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-fg-subtle">
              <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin text-intel" /> Loading accounts…
            </div>
          ) : error ? (
            <div className="p-12 text-center text-sm text-fg-muted">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-fg-subtle">
              {users.length === 0 ? "No one has signed up yet." : "No matching accounts."}
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-surface-sunken/60 text-xs font-semibold text-fg-muted">
                <tr>
                  <th className="px-5 py-3">Person</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Last sign-in</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-surface-sunken/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.avatar_url} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
                        ) : (
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-action text-xs font-bold uppercase text-white">
                            {(u.name || u.email)[0]}
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-fg">{u.name || u.email.split("@")[0]}</div>
                          <div className="truncate text-xs text-fg-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-fg-muted">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3 text-xs text-fg-muted">{formatDate(u.last_sign_in_at)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.blocked ? "bg-brand-red/10 text-brand-red dark:text-ambition" : "bg-intel/10 text-intel"
                        }`}
                      >
                        {u.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setBlocked(u, !u.blocked)}
                        disabled={updatingId === u.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg disabled:opacity-50"
                      >
                        {u.blocked ? (
                          <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                          <Ban aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                        {u.blocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
