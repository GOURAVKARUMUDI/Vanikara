"use client";

import { useEffect, useState } from "react";
import { FolderGit2, Plus, Edit2, Trash2, Check, RefreshCw } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ProjectsManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: "", title: "", tag: "", tagline: "", problem: "", solution: "", progress: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const json = await res.json();
      setProjects(json.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (p: any) => {
    setForm(p);
    setIsEditing(true);
  };

  const handleClear = () => {
    setForm({ id: "", title: "", tag: "", tagline: "", problem: "", solution: "", progress: 0 });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        handleClear();
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* List Projects */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[var(--accent-color)]" />
            Ecosystem Projects (CMS)
          </h2>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
            Add or modify flagship product details rendered across the main storyboards.
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 flex justify-center items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-color)]" /> Fetching projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl">
              No projects configured. Use the form to configure the first portfolio item.
            </div>
          ) : (
            projects.map((p) => (
              <Card key={p.id} hover>
                <CardBody className="p-6 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-[var(--accent-color)] tracking-wider">
                      {p.tag}
                    </span>
                    <h4 className="font-display font-black text-sm text-[var(--text-primary)] uppercase">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {p.tagline}
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-[10px] font-bold text-slate-400">
                      <span>Status: <strong className="text-[var(--text-primary)] font-extrabold">{p.status?.toUpperCase() || "IDEA"}</strong></span>
                      <span>Progress: <strong className="text-[var(--accent-color)] font-extrabold">{p.progress}%</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-slate-500/5 hover:bg-slate-500/10 border border-[var(--glass-border)] rounded-xl text-slate-500 hover:text-[var(--text-primary)] transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Visual Creator/Editor Form */}
      <div className="lg:col-span-5">
        <Card hover className="sticky top-28">
          <CardBody className="p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[var(--accent-color)]" />
              {isEditing ? "Modify Project details" : "Create New Project Card"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Project Name</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Vanik"
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Project Tag Category</label>
                <input
                  type="text"
                  required
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="e.g. Campus Marketplace"
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Tagline</label>
                <input
                  type="text"
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Short product summary sentence..."
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Completion Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1 font-bold text-xs uppercase tracking-wide gap-1.5">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? "Saving..." : isEditing ? "Save Edits" : "Publish Project"}
                </Button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-5 py-3 border border-[var(--glass-border)] rounded-full text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:bg-slate-500/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
