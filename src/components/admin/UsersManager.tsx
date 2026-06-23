"use client";

import { useEffect, useState } from "react";
import { Users, Search, RefreshCw } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";

export default function UsersManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      setUsers(json.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to change user role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--accent-color)]" />
            Registered Portal Users
          </h2>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
            Audit user profiles, modify roles, and verify registry timestamps.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email address..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      <Card hover>
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 flex justify-center items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-color)]" /> Fetching registry database...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No matching user profiles found.
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-500/5 text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest border-b border-[var(--glass-border)] select-none">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Registry Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-secondary)]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--text-primary)]">{u.email?.split("@")[0]}</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        u.role === "admin"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : u.role === "premium" || u.role === "pro"
                          ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[10px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => handleRoleChange(u.id, "admin")}
                            disabled={updatingId === u.id}
                            className="px-2.5 py-1 bg-slate-500/5 hover:bg-red-500/15 border border-[var(--glass-border)] hover:border-red-500/20 text-[9px] font-black uppercase rounded-lg transition-all text-red-400 cursor-pointer disabled:opacity-50"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u.id, "user")}
                            disabled={updatingId === u.id}
                            className="px-2.5 py-1 bg-slate-500/5 hover:bg-blue-500/15 border border-[var(--glass-border)] hover:border-blue-500/20 text-[9px] font-black uppercase rounded-lg transition-all text-blue-400 cursor-pointer disabled:opacity-50"
                          >
                            Remove Admin
                          </button>
                        )}
                      </div>
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
