"use client";

import { useEffect, useState } from "react";
import { Briefcase, Mail, CheckCircle, XCircle, RefreshCw, MessageSquare } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CareersManager() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load notes on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vanikara_candidate_notes");
      if (stored) {
        try {
          setNotes(JSON.parse(stored));
        } catch {
          setNotes({});
        }
      }
    }
  }, []);

  const handleSaveNote = (id: string, noteText: string) => {
    const updated = { ...notes, [id]: noteText };
    setNotes(updated);
    localStorage.setItem("vanikara_candidate_notes", JSON.stringify(updated));
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/careers");
      const json = await res.json();
      setCandidates(json.data || []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/careers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        fetchCandidates();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCandidates = candidates.filter((cand) => {
    const matchesSearch = 
      cand.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.cover_letter?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPosition = 
      positionFilter === "all" || cand.position === positionFilter;
      
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[var(--accent-color)]" />
          Careers & Internship Applications
        </h2>
        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
          Review candidate resumes, statement letters, and shortlist candidates for interviews.
        </p>
      </div>

      {/* Search and Position Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-4 rounded-3xl backdrop-blur-md select-none">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search applicants by name, email, or statement text..."
          className="flex-grow px-4 py-2.5 bg-slate-500/5 border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-semibold"
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-semibold cursor-pointer"
        >
          <option value="all" className="bg-slate-900 text-white font-medium">All Positions</option>
          <option value="React Frontend Developer Intern" className="bg-slate-900 text-white font-medium">Frontend Intern</option>
          <option value="Node.js Fullstack Intern" className="bg-slate-900 text-white font-medium">Fullstack Intern</option>
          <option value="Campus Rep Coordinator" className="bg-slate-900 text-white font-medium">Campus Rep</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-color)]" /> Fetching candidates...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl">
            No matching candidates found.
          </div>
        ) : (
          filteredCandidates.map((cand) => (
            <Card key={cand.id} hover>
              <CardBody className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--glass-border)] pb-3 select-none">
                  <div>
                    <span className="text-[9px] font-black uppercase text-[var(--accent-color)] tracking-wider block">
                      {cand.position}
                    </span>
                    <h4 className="font-display font-black text-sm text-[var(--text-primary)] mt-0.5 uppercase">
                      {cand.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-[var(--accent-color)]" /> {cand.email}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider border ${
                    cand.status === "new"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : cand.status === "shortlisted"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    {cand.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                  <strong>Statement of Intent / Cover Letter:</strong>
                  <p className="bg-slate-500/5 p-4 rounded-xl border border-[var(--glass-border)] whitespace-pre-wrap">
                    {cand.cover_letter || "No cover letter submitted."}
                  </p>
                </div>

                {/* Admin Evaluation Notes */}
                <div className="pt-4 border-t border-[var(--glass-border)] space-y-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Admin Evaluation Notes
                  </label>
                  <textarea
                    value={notes[cand.id] || ""}
                    onChange={(e) => handleSaveNote(cand.id, e.target.value)}
                    placeholder="Enter screening feedback, test scores, or background details..."
                    className="w-full h-20 p-3 bg-slate-500/5 border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] resize-none font-medium placeholder:text-slate-500/40"
                  />
                </div>

                <div className="pt-2 flex justify-between items-center gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-slate-400">
                    <span>Received: {new Date(cand.created_at || Date.now()).toLocaleDateString()}</span>
                    {cand.resume_url && (
                      <a 
                        href={cand.resume_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[var(--accent-color)] hover:underline uppercase font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        📄 View Resume
                      </a>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {cand.status !== "shortlisted" && (
                      <button
                        onClick={() => handleUpdateStatus(cand.id, "shortlisted")}
                        disabled={updatingId === cand.id}
                        className="px-3 py-1.5 bg-slate-500/5 hover:bg-green-500/15 border border-[var(--glass-border)] hover:border-green-500/20 rounded-lg text-[9px] font-black uppercase tracking-wider text-green-500 cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Shortlist
                      </button>
                    )}
                    {cand.status !== "rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(cand.id, "rejected")}
                        disabled={updatingId === cand.id}
                        className="px-3 py-1.5 bg-slate-500/5 hover:bg-red-500/15 border border-[var(--glass-border)] hover:border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-wider text-red-400 cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
