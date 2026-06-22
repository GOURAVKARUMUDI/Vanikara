"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/ui/Button";
import { ShieldCheck, LogIn, Compass, Terminal, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/ai/Sidebar"), { ssr: false });
const ChatArea = dynamic(() => import("@/components/ai/ChatArea"), { ssr: false });
const ContextPanel = dynamic(() => import("@/components/ai/ContextPanel"), { ssr: false });
const AIScene = dynamic(() => import("@/components/ai/AIScene"), { ssr: false });
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileCygmaAI from "@/components/mobile/MobileCygmaAI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const [user, setUser] = useState<any>(null);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Right panel context grounding details
  const [files, setFiles] = useState<any[]>([]);
  const [activeContext, setActiveContext] = useState("");
  
  // Collapsible panels states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isContextOpen, setIsContextOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check authentication state
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Fetch messages when conversation ID changes
  useEffect(() => {
    if (!currentConvId || !user) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", currentConvId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            role: m.sender_role as "user" | "assistant",
            content: m.content
          }))
        );
      }
    };

    fetchMessages();
  }, [currentConvId, user]);

  const handleSendMessage = async (text: string) => {
    if (isStreaming) return;

    // Rate Limiting for Guest Users (unauthenticated)
    if (!user) {
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

      // Filter timestamps in the last 24h
      timestamps = timestamps.filter(t => now - t < oneDayMs);

      if (timestamps.length >= 50) {
        const limitMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "You have reached today's guest usage limit. Sign in to continue chatting with CYGMA AI."
        };
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), role: "user", content: text },
          limitMsg
        ]);
        return;
      }

      // Log request timestamp
      timestamps.push(now);
      localStorage.setItem(key, JSON.stringify(timestamps));
    }

    // Truncate guest query context (~4,000 tokens / 16,000 characters)
    let processedText = text;
    if (!user && text.length > 16000) {
      processedText = text.slice(0, 16000) + "... [truncated]";
    }

    // Append user message immediately
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText("");

    // Setup streaming controllers
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build conversation history for guest multi-turn context
      // For authenticated users, the backend fetches history from the database
      const guestHistory = !user
        ? messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        : undefined;

      // Streaming flow (Unified backend router)
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: processedText,
          model: selectedModel,
          fileContext: activeContext,
          conversationId: currentConvId,
          ...(guestHistory ? { history: guestHistory } : {}),
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        // Try to extract a meaningful error from the response body
        let errorMessage = "Failed to connect to CYGMA AI. Please try again.";
        try {
          const errBody = await response.json();
          if (errBody?.error) errorMessage = errBody.error;
        } catch {
          // Response wasn't JSON, use default message
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let chunkText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Extract metadata if returned in first chunk
          if (chunk.startsWith("[METADATA]:")) {
            const metaLine = chunk.split("\n")[0];
            const metaJson = JSON.parse(metaLine.replace("[METADATA]:", ""));
            if (metaJson.conversationId && !currentConvId) {
              setCurrentConvId(metaJson.conversationId);
            }
            // Skip enqueuing metadata token to user-facing prompt text area
            const rest = chunk.replace(metaLine + "\n", "");
            if (rest) {
              chunkText += rest;
              setStreamingText(chunkText);
            }
          } else {
            chunkText += chunk;
            setStreamingText(chunkText);
          }
        }
      }

      if (!controller.signal.aborted) {
        const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: chunkText };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: err.message || "An unexpected error occurred. Please try again." }
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

  const handleNewChat = () => {
    handleStopGeneration();
    setCurrentConvId(null);
    setMessages([]);
  };

  if (isMobile) {
    return (
      <>
        <AIScene />
        <MobileCygmaAI
          user={user}
          currentConvId={currentConvId}
          setCurrentConvId={setCurrentConvId}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          messages={messages}
          setMessages={setMessages}
          streamingText={streamingText}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          onNewChat={handleNewChat}
          files={files}
          setFiles={setFiles}
          activeContext={activeContext}
          setActiveContext={setActiveContext}
          isAuthenticated={!!user}
        />
      </>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-transparent relative animate-in fade-in duration-300">
      <AIScene />
      
      {/* 1. Collapsible Left Sidebar */}
      <Sidebar
        currentConvId={currentConvId}
        setCurrentConvId={setCurrentConvId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isAuthenticated={!!user}
      />

      {/* 2. Central Conversational Chat Area */}
      <ChatArea
        messages={messages}
        setMessages={setMessages}
        streamingText={streamingText}
        isStreaming={isStreaming}
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        selectedModel={selectedModel}
        isGrounded={!!activeContext}
        isAuthenticated={!!user}
      />

      {/* 3. Collapsible Right Context Utility Panel */}
      <ContextPanel
        isOpen={isContextOpen}
        setIsOpen={setIsContextOpen}
        files={files}
        setFiles={setFiles}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        isAuthenticated={!!user}
      />

    </div>
  );
}
