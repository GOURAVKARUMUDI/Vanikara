"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Briefcase } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import Button from "@/components/ui/Button";

interface JobRow {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  work_arrangement: string;
  status: string;
  created_at: string;
}

export default function JobsManager() {
  const { data, isLoading, mutate } = useSWR<{ data?: { items: JobRow[]; tableReady: boolean } }>(
    "/api/admin/jobs",
    fetcher
  );
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    department: "Engineering",
    location: "Guntur, Andhra Pradesh",
    employment_type: "Full-time",
    work_arrangement: "On-site",
    description: "",
    status: "draft",
  });

  const items = data?.data?.items ?? [];
  const tableReady = data?.data?.tableReady ?? true;

  const createJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error?.message || "Failed to create position.");
      } else {
        setCreating(false);
        setForm({
          title: "",
          department: "Engineering",
          location: "Guntur, Andhra Pradesh",
          employment_type: "Full-time",
          work_arrangement: "On-site",
          description: "",
          status: "draft",
        });
        mutate();
      }
    } catch {
      setError("Network error while creating position.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-fg">Published & Draft Job Positions</h2>
          <p className="text-sm text-fg-muted">
            Manage open positions displayed on /careers. Only published roles appear publicly.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          <Plus className="h-4 w-4" />
          {creating ? "Cancel" : "New Position"}
        </Button>
      </div>

      {!tableReady && (
        <div className="rounded-compact border border-status-warning/40 bg-status-warning/10 p-4 text-sm text-fg">
          The <code className="font-mono">job_positions</code> table is not yet created in Supabase. Run{" "}
          <code className="font-mono">supabase/migrations/20261126_v2_enterprise_schema.sql</code> to activate job management.
        </div>
      )}

      {creating && (
        <form onSubmit={createJob} className="surface p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-fg">Job Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="v2-input mt-1"
                placeholder="e.g., Full-Stack Software Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-fg">Department *</label>
              <input
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="v2-input mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-fg">Employment Type</label>
              <select
                value={form.employment_type}
                onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                className="v2-input mt-1"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-fg">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="v2-input mt-1"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-fg">Role Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="v2-input mt-1 min-h-[100px]"
              placeholder="Describe the scope, responsibilities, and qualifications..."
            />
          </div>
          {error && <p className="text-sm text-status-error">{error}</p>}
          <Button type="submit" size="sm" loading={saving}>
            Save Position
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="surface p-6 text-sm text-fg-muted">Loading positions...</div>
      ) : items.length === 0 ? (
        <div className="surface p-8 text-center">
          <Briefcase className="mx-auto h-6 w-6 text-fg-subtle" />
          <p className="mt-2 text-sm font-medium text-fg">No job positions created yet</p>
        </div>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-secondary font-mono text-xs uppercase text-fg-subtle">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((job) => (
                <tr key={job.id}>
                  <td className="px-4 py-3 font-medium text-fg">{job.title}</td>
                  <td className="px-4 py-3 text-fg-muted">{job.department}</td>
                  <td className="px-4 py-3 text-fg-muted">{job.employment_type}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-intel">{job.status}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Change status for ${job.title}`}
                      value={job.status}
                      onChange={(e) => updateStatus(job.id, e.target.value)}
                      className="rounded border border-line bg-surface px-2 py-1 text-xs text-fg"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="closed">Closed</option>
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
