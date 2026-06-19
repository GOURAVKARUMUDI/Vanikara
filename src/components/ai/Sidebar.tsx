"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  MessageSquare, Plus, ChevronLeft, ChevronRight, Trash2, 
  Sparkles, Brain, Cpu, Pin, Edit2, Check, X 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface SidebarProps {
  currentConvId: string | null;
  setCurrentConvId: (id: string | null) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAuthenticated: boolean;
}

const MODELS = [
  { id: "gpt-4o", name: "GPT-4o (OpenAI)", icon: <Sparkles className="w-3.5 h-3.5" />, desc: "High reasoning & text completions." },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet (Anthropic)", icon: <Brain className="w-3.5 h-3.5" />, desc: "Deep analytical & code synthesis." },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Google)", icon: <Cpu className="w-3.5 h-3.5" />, desc: "Massive context & logical search." }
];

export default function Sidebar({
  currentConvId,
  setCurrentConvId,
  selectedModel,
  setSelectedModel,
  onNewChat,
  isOpen,
  setIsOpen,
  isAuthenticated
}: SidebarProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
  const supabase = createClient();

  // Load pinned conversation IDs from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vanikara_pinned_conversations");
      if (stored) {
        try {
          setPinnedIds(JSON.parse(stored));
        } catch {
          setPinnedIds([]);
        }
      }
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setConversations([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timeoutId = setTimeout(() => {
      fetchConversations();
    }, 0);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchConversations();
    });

    return () => {
      clearTimeout(timeoutId);
      if (subscription) subscription.unsubscribe();
    };
  }, [isAuthenticated, fetchConversations, supabase.auth]);

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (!error) {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConvId === id) {
        setCurrentConvId(null);
      }
      // Clean up local storage pin if deleted
      setPinnedIds((prev) => {
        const updated = prev.filter((p) => p !== id);
        localStorage.setItem("vanikara_pinned_conversations", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Toggle Pinned status
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds((prev) => {
      const updated = prev.includes(id) 
        ? prev.filter((p) => p !== id) 
        : [...prev, id];
      localStorage.setItem("vanikara_pinned_conversations", JSON.stringify(updated));
      return updated;
    });
  };

  // Inline Rename Thread submission
  const handleRenameSubmit = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingTitle.trim()) return;

    const { error } = await supabase
      .from("conversations")
      .update({ title: editingTitle.trim() })
      .eq("id", id);

    if (!error) {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: editingTitle.trim() } : c))
      );
      setEditingId(null);
    } else {
      alert("Failed to update thread title.");
    }
  };

  const handleStartRename = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(title);
  };

  // Sort conversations putting pinned items at the top
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0; // Maintain relative ordering otherwise
    });
  }, [conversations, pinnedIds]);

  return (
    <div
      className={`relative h-[calc(100vh-4rem)] border-r border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-300 flex flex-col z-20 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Collapse Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-5 w-6 h-6 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--accent-color)] text-[var(--text-secondary)] hover:text-white flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95"
      >
        {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* New Chat Button */}
      <div className="p-4 flex-shrink-0">
        {isOpen ? (
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-color)] hover:opacity-90 text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-98 shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Thread
          </button>
        ) : (
          <button
            onClick={onNewChat}
            title="New Thread"
            className="w-8 h-8 mx-auto flex items-center justify-center rounded-xl bg-[var(--accent-color)] text-white hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Model Router Selector */}
      {isOpen && (
        <div className="px-4 py-2 border-b border-[var(--glass-border)] flex-shrink-0 select-none">
          <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2.5">
            Model Router
          </span>
          <div className="space-y-1.5">
            {MODELS.map((modelOption) => {
              const active = selectedModel === modelOption.id;
              return (
                <button
                  key={modelOption.id}
                  onClick={() => setSelectedModel(modelOption.id)}
                  className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer text-xs flex gap-2.5 items-center ${
                    active
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--accent-color)] font-bold shadow-sm"
                      : "border-[var(--glass-border)] bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-500/5"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${active ? 'bg-[var(--accent-color)]/10' : 'bg-slate-500/5'}`}>
                    {modelOption.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate leading-none">{modelOption.name}</span>
                    <span className="block text-[8px] text-[var(--text-secondary)] mt-0.5 leading-none font-normal truncate">
                      {modelOption.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Guest Session Status Widget */}
      {!isAuthenticated && isOpen && (
        <div className="mx-4 my-4 p-3 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-2.5 flex-shrink-0 select-none">
          <div className="text-[10px] font-extrabold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse" />
            Guest Session
          </div>
          <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed">
            Conversation is temporary. Chats, files, and settings will not be saved.
          </p>
          <ul className="space-y-1.5 text-[9px] text-[var(--text-secondary)] font-medium pl-0 list-none">
            <li className="flex items-center gap-1.5">⏱ Conversation is temporary</li>
            <li className="flex items-center gap-1.5">🧠 No Memory</li>
            <li className="flex items-center gap-1.5">📁 No File Uploads</li>
          </ul>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full py-2 bg-[var(--accent-color)] hover:opacity-90 text-white font-semibold text-[8px] uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm text-center"
          >
            Upgrade to Workspace
          </button>
        </div>
      )}

      {/* Collapsed Guest Icon indicator */}
      {!isAuthenticated && !isOpen && (
        <div className="mt-auto mb-4 mx-auto" title="Guest Session (Temporary)">
          <div className="w-8 h-8 rounded-xl border border-dashed border-red-500/20 bg-red-500/5 flex items-center justify-center text-xs">
            🔓
          </div>
        </div>
      )}

      {/* History Threads list (Only if Authenticated) */}
      {isAuthenticated && (
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          {isOpen && (
            <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1 select-none">
              Chat Streams
            </span>
          )}
          
          {loading && isOpen && (
            <div className="text-[10px] text-[var(--text-secondary)] py-2 animate-pulse font-medium select-none">
              Syncing histories...
            </div>
          )}

          {!loading && conversations.length === 0 && isOpen && (
            <div className="text-[10px] text-[var(--text-secondary)] py-6 text-center italic leading-relaxed select-none">
              No active threads. Let's initialize a new sequence.
            </div>
          )}

          {sortedConversations.map((conv) => {
            const active = currentConvId === conv.id;
            const isPinned = pinnedIds.includes(conv.id);
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => !isEditing && setCurrentConvId(conv.id)}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between group border ${
                  active
                    ? "bg-slate-500/10 text-[var(--text-primary)] font-bold border-[var(--glass-border)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-500/5 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isPinned ? 'text-amber-500' : 'text-[var(--accent-color)]'}`} />
                  {isOpen && (
                    <div className="flex-grow min-w-0">
                      {isEditing ? (
                        <form onSubmit={(e) => handleRenameSubmit(conv.id, e)} className="flex items-center gap-1.5 w-full">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-slate-500/15 text-[var(--text-primary)] text-xs rounded px-1.5 py-0.5 border border-[var(--accent-color)] focus:outline-none font-medium"
                            autoFocus
                          />
                          <button type="submit" className="text-green-500 hover:text-green-600">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="text-red-500 hover:text-red-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <span className="truncate block font-display leading-normal">{conv.title}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Actions on Hover */}
                {isOpen && !isEditing && (
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => handleTogglePin(conv.id, e)}
                      className={`p-1 rounded-lg transition-all cursor-pointer ${isPinned ? 'text-amber-500 hover:text-amber-600' : 'hover:text-[var(--text-primary)]'}`}
                      title={isPinned ? "Unpin thread" : "Pin thread to top"}
                    >
                      <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-500/20' : ''}`} />
                    </button>
                    
                    <button
                      onClick={(e) => handleStartRename(conv.id, conv.title, e)}
                      className="p-1 rounded-lg hover:text-[var(--text-primary)] transition-all cursor-pointer"
                      title="Rename thread"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      className="p-1 rounded-lg hover:text-red-500 transition-all cursor-pointer"
                      title="Purge thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
