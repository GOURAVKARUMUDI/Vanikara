"use client";

import { useState, useRef, useEffect } from "react";
import { FadeUp } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Send, Sparkles, Square, ArrowRight, Lightbulb } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PRESET_PROMPTS = [
  { label: "Brainstorm project ideas", text: "Suggest 3 unique project ideas combining AI and student campus logistics." },
  { label: "TypeScript interface helper", text: "Write a TypeScript interface for tracking custom campus printing orders." },
  { label: "Vector database simplified", text: "Explain vector search and semantic similarity in simple terms." }
];

export default function CygmaPreviewSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am CYGMA AI, the intelligence layer powering VANIKARA's digital ecosystem. Ask me to draft concepts, generate code, or solve problems in real-time."
    }
  ]);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll the chat preview box locally within the container without hijacking page scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, streamingText]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Check localStorage rate limits (matching the /ai page limit logic)
    const now = Date.now();
    const key = "cygma_guest_requests";
    const oneDayMs = 24 * 60 * 60 * 1000;
    let timestamps: number[] = [];

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        timestamps = JSON.parse(stored);
      }
    } catch (e) {
      timestamps = [];
    }

    timestamps = timestamps.filter(t => now - t < oneDayMs);

    if (timestamps.length >= 50) {
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: text },
        { id: crypto.randomUUID(), role: "assistant", content: "You have reached today's guest limit (50 messages). Please sign in to upgrade to an unrestricted workspace." }
      ]);
      return;
    }

    timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(timestamps));

    // Add user message
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build guest conversation history for multi-turn context
      const guestHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          model: "gpt-4o",
          fileContext: "",
          history: guestHistory,
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        let errorMessage = "Preview stream error. Please try again.";
        try {
          const errBody = await response.json();
          if (errBody?.error) errorMessage = errBody.error;
        } catch {
          // Response wasn't JSON
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          if (chunk.startsWith("[METADATA]:")) {
            const metaLine = chunk.split("\n")[0];
            const rest = chunk.replace(metaLine + "\n", "");
            if (rest) {
              accumulated += rest;
              setStreamingText(accumulated);
            }
          } else {
            accumulated += chunk;
            setStreamingText(accumulated);
          }
        }
      }

      if (!controller.signal.aborted) {
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: accumulated }
        ]);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: err.message || "Failed to establish real-time stream. Please try again." }
        ]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setStreamingText("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const query = input;
    setInput("");
    handleSendMessage(query);
  };

  const parseMarkdown = (text: string) => {
    if (!text) return "";
    let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Code blocks
    escaped = escaped.replace(/```([\s\S]*?)```/g, (_, code) => {
      const trimmedCode = code.trim();
      return `<pre class="p-3 bg-[#070b16] text-indigo-300 font-mono text-[10px] sm:text-xs rounded-xl border border-white/5 my-2.5 overflow-x-auto leading-relaxed select-all"><code>${trimmedCode}</code></pre>`;
    });

    // Inline code tags
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-500/10 text-[var(--accent-color)] font-mono text-xs rounded border border-[var(--glass-border)]">$1</code>');

    // Bold text
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-[var(--text-primary)]">$1</strong>');

    // Bullet points
    escaped = escaped.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc pl-1 mb-0.5 text-[var(--text-secondary)]">$1</li>');

    return escaped.split('\n\n').map(p => {
      if (p.trim().startsWith('<pre') || p.trim().startsWith('<li')) return p;
      return `<p class="mb-2 last:mb-0 leading-relaxed">${p}</p>`;
    }).join('');
  };

  return (
    <SectionContainer id="cygma-preview" className="overflow-hidden">
      {/* Background radial atmosphere blur glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#1E6BD6]/10 to-[#FF7A00]/10 opacity-30 filter blur-[120px] rounded-full pointer-events-none -z-10" />

      <ContentContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Product Intro + Prompt Pre-sets */}
          <div className="lg:col-span-5 space-y-6">
            <FadeUp>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
                PREVIEW WORKSPACE
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2 uppercase">
                CYGMA AI sandbox
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Interact with the real-time AI core powering VANIKARA&apos;s logistics and automation systems. Ask anything directly. No registration required.
              </p>
            </FadeUp>

            {/* Clickable suggested presets */}
            <div className="flex sm:block overflow-x-auto snap-x sm:snap-none pb-4 sm:pb-0 gap-3 sm:gap-0 sm:space-y-3 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
              {PRESET_PROMPTS.map((preset, index) => (
                <FadeUp key={preset.label} delay={0.08 * (index + 1)} className="w-[85vw] sm:w-auto shrink-0 snap-center sm:snap-align-none">
                  <button
                    onClick={() => {
                      if (!isStreaming) {
                        setInput("");
                        handleSendMessage(preset.text);
                      }
                    }}
                    disabled={isStreaming}
                    className="w-full h-full p-3 sm:p-4 text-left rounded-xl sm:rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)] text-xs cursor-pointer transition-all hover:scale-[1.01] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between group disabled:opacity-50 disabled:pointer-events-none gap-2 sm:gap-0"
                  >
                    <div className="space-y-1 sm:pr-4">
                      <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 text-[#FFC400]" />
                        {preset.label}
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] line-clamp-2 sm:truncate sm:max-w-sm whitespace-normal sm:whitespace-nowrap">
                        {preset.text}
                      </div>
                    </div>
                    <ArrowRight className="hidden sm:block w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.35}>
              <div className="pt-2">
                <Button href="/ai" variant="secondary" size="md" className="gap-2 group">
                  Launch Full Workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </FadeUp>
          </div>

          {/* Right Side: Glass Chat Console Mock */}
          <div className="lg:col-span-7 mt-4 sm:mt-0">
            <FadeUp delay={0.15}>
              <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-2xl backdrop-blur-md overflow-hidden flex flex-col h-[360px] sm:h-[480px]">
                {/* Console Header */}
                <div className="px-6 py-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-slate-500/5 select-none shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] animate-pulse" />
                    <span className="font-mono text-[10px] font-bold text-[var(--text-primary)] tracking-wider">
                      CYGMA-4O // GUEST_SESSION
                    </span>
                  </div>
                  <div className="text-[9px] font-semibold text-[var(--text-secondary)] bg-[var(--selection-bg)] px-2 py-0.5 rounded border border-[var(--glass-border)]">
                    Active Stream
                  </div>
                </div>

                {/* Console Message Stream Area */}
                <div 
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs scrollbar-thin"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-start ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--glass-border)] flex items-center justify-center text-xs shrink-0 select-none">
                          🔮
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl border transition-all ${
                          msg.role === "user"
                            ? "bg-[var(--accent-color)] border-transparent text-white rounded-tr-sm"
                            : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] rounded-tl-sm"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div 
                            className="prose prose-sm leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} 
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Streaming Block */}
                  {streamingText && (
                    <div className="flex gap-3 items-start justify-start">
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--glass-border)] flex items-center justify-center text-xs shrink-0 select-none">
                        🔮
                      </div>
                      <div className="max-w-[85%] p-3.5 rounded-2xl border bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] rounded-tl-sm">
                        <div 
                          className="prose prose-sm leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(streamingText) }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Tray */}
                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-[var(--glass-border)] bg-slate-500/5 shrink-0 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isStreaming}
                    placeholder={
                      isStreaming ? "Generating response..." : "Ask CYGMA AI anything..."
                    }
                    className="flex-1 px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-color)]/70 transition-all font-medium disabled:opacity-60"
                  />
                  
                  {isStreaming ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all cursor-pointer flex items-center justify-center"
                      title="Stop generation"
                      aria-label="Stop generation"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="p-3 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 disabled:bg-slate-500/10 text-white disabled:text-[var(--text-secondary)]/40 rounded-xl border border-transparent disabled:border-[var(--glass-border)] transition-all cursor-pointer flex items-center justify-center"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Status Bar */}
                <div className="px-4 py-1.5 border-t border-[var(--glass-border)] bg-slate-500/10 flex justify-between items-center text-[9px] font-semibold text-[var(--text-secondary)] select-none shrink-0">
                  <span>Guest Access Allowed</span>
                  <span>50 Requests / Day Limit</span>
                </div>
              </div>
            </FadeUp>
          </div>

        </div>
      </ContentContainer>
    </SectionContainer>
  );
}
