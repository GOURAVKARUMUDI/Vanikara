"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, AlertCircle, Copy, Check, RotateCw, Square, MessageSquare, 
  Terminal, Lightbulb, Mic, MicOff, Volume2, VolumeX, Download, UploadCloud 
} from "lucide-react";
import Button from "@/components/ui/Button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  streamingText: string;
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onStopGeneration: () => void;
  selectedModel: string;
  isGrounded: boolean;
  isAuthenticated: boolean;
}

const PROMPT_SUGGESTIONS = [
  { label: "Find PGs under 9k", text: "Find a quiet double sharing PG room near university block under 9,000 INR with laundry and verified amenities." },
  { label: "Textbook binding logic", text: "Show how Vanik coordinate custom thesis printing and binding logistics workflows." },
  { label: "Optimize database index", text: "Give me a PostgreSQL index optimization query for high-density campus tenant profiles." },
  { label: "Vector search explain", text: "Explain how CYGMA Vector index scores similarities of natural language PG requests." }
];

export default function ChatArea({
  messages,
  setMessages,
  streamingText,
  isStreaming,
  onSendMessage,
  onStopGeneration,
  selectedModel,
  isGrounded,
  isAuthenticated
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Voice speech states
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Drag-and-drop states
  const [isDragging, setIsDragging] = useState(false);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // STT initialization on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-IN"; // Default English India locale

        rec.onresult = (event: any) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              text += event.results[i][0].transcript;
            }
          }
          if (text) {
            setInput((prev) => (prev ? prev + " " + text : text));
          }
        };

        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  // Global click event listener for code copying (Event Delegation)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("copy-code-btn")) {
        const base64Code = target.getAttribute("data-code");
        if (base64Code) {
          try {
            const code = decodeURIComponent(escape(atob(base64Code)));
            navigator.clipboard.writeText(code);
            const originalText = target.innerText;
            target.innerText = "Copied!";
            target.style.color = "#10b981"; // green highlight
            setTimeout(() => {
              target.innerText = originalText;
              target.style.color = "";
            }, 1800);
          } catch (err) {
            console.error("Failed to copy code block:", err);
          }
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    // Stop recording speech before sending
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    onSendMessage(input);
    setInput("");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Toggle Voice Input (STT)
  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      alert("Browser speech dictation is not supported or requires secure origins.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Toggle Read Aloud (TTS)
  const handleToggleSpeak = (text: string, msgId: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      
      // Strip code snippets and markdown markers for clean speech synthesis
      const cleanText = text
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/^- (.+)$/gm, "$1")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText || "Code snippet provided.");
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Export thread to Markdown file
  const handleExportMarkdown = () => {
    if (messages.length === 0) return;
    
    let md = `# CYGMA AI Workspace Export\n`;
    md += `Exported: ${new Date().toLocaleString()}\n`;
    md += `Model Routing Node: ${selectedModel.toUpperCase()}\n\n`;
    md += `---\n\n`;

    messages.forEach((msg) => {
      const sender = msg.role === "user" ? "User Inquiry" : "Cygma Engine";
      md += `### **${sender}**\n\n${msg.content}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cygma-chat-export-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag and Drop files handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      alert(`CYGMA: Dropped ${droppedFiles.length} file(s). You can upload and ground files inside the Context Index panel on the right!`);
    }
  };

  // Simple, highly styled markdown/syntax-highlight/table parser utility
  const parseMarkdown = (text: string) => {
    if (!text) return "";
    
    // Escape HTML tags to prevent XSS
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks with language detection and inline copy trigger
    escaped = escaped.replace(/```(\w*)\r?\n?([\s\S]*?)```/g, (_, lang, code) => {
      const trimmedCode = code.trim();
      const languageName = lang || "code";
      const base64Code = typeof window !== "undefined" ? btoa(unescape(encodeURIComponent(trimmedCode))) : "";
      
      return `
        <div class="my-4 overflow-hidden rounded-2xl border border-white/5 bg-[#070b16] select-none font-sans">
          <div class="flex items-center justify-between px-4 py-2 bg-[#0d1527] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-slate-400">
            <span>${languageName}</span>
            <button 
              type="button" 
              class="copy-code-btn hover:text-white transition-colors cursor-pointer flex items-center gap-1 uppercase font-bold" 
              data-code="${base64Code}"
            >
              Copy
            </button>
          </div>
          <pre class="p-4 overflow-x-auto text-indigo-300 font-mono text-[11px] sm:text-xs leading-relaxed select-all"><code>${trimmedCode}</code></pre>
        </div>
      `;
    });

    // Markdown Table parsing
    escaped = escaped.replace(/((?:\|[^\n]+\|\r?\n?)+)/g, (tableBlock) => {
      const lines = tableBlock.trim().split("\n");
      if (lines.length < 2) return tableBlock;

      const rows = lines.map(line => {
        const cells = line.split("|").map(c => c.trim());
        if (cells[0] === "") cells.shift();
        if (cells[cells.length - 1] === "") cells.pop();
        return cells;
      });

      const hasSeparator = rows[1]?.every(cell => /^[:-]+$/.test(cell));
      const headerRow = rows[0];
      const dataRows = hasSeparator ? rows.slice(2) : rows.slice(1);

      const thead = `<thead class="bg-[#0d1527] text-white text-[10px] uppercase tracking-wider border-b border-white/10"><tr>${headerRow.map(h => `<th class="p-3 text-left font-bold">${h}</th>`).join("")}</tr></thead>`;
      
      const tbody = `<tbody class="divide-y divide-white/5">${dataRows.map(row => `<tr>${row.map(cell => `<td class="p-3 text-[11px] font-medium text-slate-300">${cell}</td>`).join("")}</tr>`).join("")}</tbody>`;

      return `
        <div class="my-4 overflow-x-auto rounded-xl border border-white/5 bg-[#070b16]/50">
          <table class="min-w-full divide-y divide-white/5 border-collapse">
            ${thead}
            ${tbody}
          </table>
        </div>
      `;
    });

    // Inline code tags
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-500/10 text-[var(--accent-color)] font-mono text-xs rounded border border-[var(--glass-border)]">$1</code>');

    // Bold text
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-[var(--text-primary)]">$1</strong>');

    // Bullet points
    escaped = escaped.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc pl-1 mb-1 text-[var(--text-secondary)]">$1</li>');

    // Paragraph splits
    return escaped.split('\n\n').map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<pre') || trimmed.startsWith('<li') || trimmed.startsWith('<div')) return p;
      return `<p class="mb-3.5 last:mb-0 leading-relaxed">${p}</p>`;
    }).join('');
  };

  return (
    <div 
      className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative z-10"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Visual drag overlay wrapper */}
      {isDragging && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[99] border-2 border-dashed border-[var(--accent-color)] m-4 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-center pointer-events-none select-none animate-in fade-in duration-200">
          <UploadCloud className="w-12 h-12 text-[var(--accent-color)] animate-bounce" />
          <h3 className="font-display font-black text-sm uppercase tracking-widest text-[var(--text-primary)]">Drop Document Here</h3>
          <p className="text-[10px] text-[var(--text-secondary)] font-semibold max-w-xs uppercase leading-normal">
            Drop your PDF, DOCX, or CSV files to prepare them for vector index matching.
          </p>
        </div>
      )}
      
      {/* Top Banner (Guest check & Export actions) */}
      <div className="bg-[var(--accent-color)]/5 border-b border-[var(--glass-border)] px-6 py-2.5 flex items-center justify-between gap-4 z-20 flex-shrink-0 select-none">
        <div>
          {!isAuthenticated ? (
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[var(--accent-color)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping" />
                Guest Workspace
              </div>
              <div className="text-[9px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                Sign in to persist chat nodes and vector models.
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-green-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Secure Workspace Node
              </div>
              <div className="text-[9px] text-[var(--text-secondary)] mt-0.5 font-semibold">
                All histories are isolated via Supabase Row-Level Security.
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleExportMarkdown}
              className="px-3.5 py-1.5 bg-slate-500/5 hover:bg-slate-500/10 border border-[var(--glass-border)] text-white font-bold text-[8px] tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="Export thread to Markdown file"
            >
              <Download className="w-3.5 h-3.5" /> Export Markdown
            </button>
          )}

          {!isAuthenticated && (
            <button
              onClick={() => window.location.href = "/login"}
              className="px-3.5 py-1.5 bg-[var(--accent-color)] hover:opacity-90 text-white font-bold text-[8px] tracking-widest uppercase rounded-lg transition-all cursor-pointer shadow-sm text-center"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Background Orbs lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent-color)]/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-orb" />

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.length === 0 && !streamingText && (
          <div className="max-w-2xl mx-auto py-16 text-center space-y-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--accent-color)]/10 border border-[var(--glass-border)] flex items-center justify-center mx-auto text-3xl animate-pulse">
              🧠
            </div>
            
            <div className="space-y-3">
              <h2 className="font-display font-black text-2xl tracking-tight text-[var(--text-primary)] uppercase">
                Welcome to CYGMA AI Workspace
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
                Cygma processes text data inputs, indexes grounding files, and routes recommendation queries. Set parameters in the left panel to initialize.
              </p>
            </div>

            {/* Prompt presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-6 text-left">
              {PROMPT_SUGGESTIONS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setInput(preset.text)}
                  className="p-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)] text-xs text-left cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between group"
                >
                  <span className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5 group-hover:text-[var(--accent-color)] transition-colors">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] leading-normal truncate w-full">
                    {preset.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-4 items-start ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--glass-border)] flex items-center justify-center text-xs shrink-0 font-bold">
                    🔮
                  </div>
                )}
                
                <div
                  className={`relative max-w-[85%] rounded-[1.6rem] p-4 text-xs shadow-sm border transition-all ${
                    isUser
                      ? "bg-[var(--accent-color)] border-transparent text-white rounded-tr-sm"
                      : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] rounded-tl-sm backdrop-blur-md"
                  }`}
                >
                  {isUser ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div 
                      className="prose prose-sm leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} 
                    />
                  )}

                  {/* Message Actions */}
                  {!isUser && (
                    <div className="flex justify-end gap-2.5 mt-3 pt-2.5 border-t border-[var(--glass-border)] opacity-65 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-[9px] font-bold uppercase tracking-wider hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleToggleSpeak(msg.content, msg.id)}
                        className="text-[9px] font-bold uppercase tracking-wider hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-red-500" />
                            Mute
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            Speak
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onSendMessage(msg.content)}
                        className="text-[9px] font-bold uppercase tracking-wider hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                        title="Retry query generation"
                      >
                        <RotateCw className="w-3 h-3" />
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Streaming Message block */}
          {streamingText && (
            <div className="flex gap-4 items-start justify-start">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--glass-border)] flex items-center justify-center text-xs shrink-0 font-bold animate-pulse">
                🔮
              </div>
              <div className="relative max-w-[85%] rounded-[1.6rem] p-4 text-xs shadow-sm border bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] rounded-tl-sm backdrop-blur-md">
                <div 
                  className="prose prose-sm leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(streamingText) }} 
                />
                <span className="inline-block w-1.5 h-3 bg-[var(--accent-color)] ml-1 animate-pulse" />
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input container */}
      <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)]/30 backdrop-blur-md flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-grow relative flex items-end gap-2.5">
              {/* Dictation button (STT) */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isListening 
                    ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" 
                    : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                title={isListening ? "Listening... click to stop" : "Start voice dictation"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <div className="flex-grow relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Query Cygma AI via ${selectedModel.toUpperCase()}...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="w-full pl-4 pr-12 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl text-[var(--text-primary)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 resize-none h-11 max-h-36 scrollbar-none font-medium placeholder:text-[var(--text-secondary)]/50"
                />
                
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={onStopGeneration}
                    className="absolute right-3.5 bottom-3 text-red-500 hover:text-red-600 cursor-pointer"
                    title="Stop sequence calculation"
                  >
                    <Square className="w-4.5 h-4.5 fill-red-500/20" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-3.5 bottom-3 text-[var(--accent-color)] hover:opacity-85 disabled:opacity-30 cursor-pointer transition-opacity"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1.5 mt-2 px-1 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span>Model: {selectedModel}</span>
              <span className="text-slate-500/30">|</span>
              <span>{isGrounded ? "Grounding Index Active (RAG)" : "Direct prompt route"}</span>
            </div>
            <span className="text-[8px] opacity-75 font-medium text-center sm:text-right normal-case tracking-normal">
              CYGMA AI may use multiple AI models and providers to deliver responses.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
