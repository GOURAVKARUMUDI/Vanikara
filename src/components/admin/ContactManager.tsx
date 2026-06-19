"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Calendar, Mail, Trash2, ShieldCheck, Check } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ContactManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "converted">("all");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const json = await res.json();
      setMessages(json.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleArchive = async (id: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "converted" })
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to archive message:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || msg.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--accent-color)]" />
          Incoming Contact Forms
        </h2>
        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
          View visitor inquiry transcripts, change follow-up statuses, and purge logs.
        </p>
      </div>

      {/* Live Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-4 rounded-3xl backdrop-blur-md select-none">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inquiries by name, email, or message contents..."
          className="flex-grow px-4 py-2.5 bg-slate-500/5 border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-semibold"
        />
        <div className="flex gap-1 bg-slate-500/10 p-1 rounded-xl w-fit">
          {(["all", "new", "converted"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-[var(--accent-color)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {status === "converted" ? "Archived" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Fetching messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl">
            No matching submissions found.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <Card key={msg.id} hover>
              <CardBody className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--glass-border)] pb-3 select-none">
                  <div>
                    <h4 className="font-display font-black text-sm text-[var(--text-primary)] uppercase">
                      {msg.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-[var(--accent-color)]" /> {msg.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                      msg.status === "new"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-green-500/10 text-green-500 border-green-500/20"
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed bg-slate-500/5 p-4 rounded-xl border border-[var(--glass-border)]">
                  {msg.message}
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    Source: {msg.source || "Website Form"}
                  </div>
                  <div className="flex gap-2">
                    {msg.status !== "converted" && (
                      <button
                        onClick={() => handleArchive(msg.id)}
                        disabled={updatingId === msg.id}
                        className="px-3 py-1.5 bg-slate-500/5 hover:bg-green-500/15 border border-[var(--glass-border)] hover:border-green-500/20 rounded-lg text-[9px] font-black uppercase tracking-wider text-green-500 cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Archive
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg text-red-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
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
