"use client";

import { useState } from "react";
import { MessageSquare, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/ai/Sidebar";
import ChatArea from "@/components/ai/ChatArea";
import ContextPanel from "@/components/ai/ContextPanel";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MobileCygmaAIProps {
  user: any;
  currentConvId: string | null;
  setCurrentConvId: (id: string | null) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  streamingText: string;
  isStreaming: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onStopGeneration: () => void;
  onNewChat: () => void;
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  activeContext: string;
  setActiveContext: (context: string) => void;
  isAuthenticated: boolean;
}

export default function MobileCygmaAI({
  user,
  currentConvId,
  setCurrentConvId,
  selectedModel,
  setSelectedModel,
  messages,
  setMessages,
  streamingText,
  isStreaming,
  onSendMessage,
  onStopGeneration,
  onNewChat,
  files,
  setFiles,
  activeContext,
  setActiveContext,
  isAuthenticated
}: MobileCygmaAIProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showContext, setShowContext] = useState(false);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden bg-transparent relative z-10">
      {/* Mobile Top Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/20 border-b border-[var(--glass-border)] backdrop-blur-md select-none shrink-0">
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/15 border border-[var(--glass-border)] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>Threads</span>
        </button>

        <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase">
          CYGMA AI • {selectedModel.replace("-3-5-sonnet", "").toUpperCase()}
        </span>

        <button
          onClick={() => setShowContext(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/15 border border-[var(--glass-border)] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>Grounding</span>
        </button>
      </div>

      {/* Main viewport is 100% ChatArea */}
      <div className="flex-grow relative overflow-hidden chat-input-safe-area">
        <ChatArea
          messages={messages}
          setMessages={setMessages}
          streamingText={streamingText}
          isStreaming={isStreaming}
          onSendMessage={onSendMessage}
          onStopGeneration={onStopGeneration}
          selectedModel={selectedModel}
          isGrounded={!!activeContext}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* Slide-over Left Sidebar drawer */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-md pointer-events-auto"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-16 bottom-0 w-[85vw] max-w-[340px] bg-slate-950/85 backdrop-blur-3xl border-r border-[var(--glass-border)] z-40 flex flex-col pointer-events-auto shadow-2xl"
            >
              <div className="p-3 border-b border-[var(--glass-border)] flex items-center justify-between shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                  Conversations
                </span>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-500/10 text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-grow overflow-hidden relative">
                <Sidebar
                  currentConvId={currentConvId}
                  setCurrentConvId={(id) => {
                    setCurrentConvId(id);
                    setShowSidebar(false);
                  }}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  onNewChat={() => {
                    onNewChat();
                    setShowSidebar(false);
                  }}
                  isOpen={true}
                  setIsOpen={() => {}}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-over Right Context drawer */}
      <AnimatePresence>
        {showContext && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContext(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-md pointer-events-auto"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-16 bottom-0 w-[85vw] max-w-[340px] bg-slate-950/85 backdrop-blur-3xl border-l border-[var(--glass-border)] z-40 flex flex-col pointer-events-auto shadow-2xl"
            >
              <div className="p-3 border-b border-[var(--glass-border)] flex items-center justify-between shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                  Grounding Sources
                </span>
                <button
                  onClick={() => setShowContext(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-500/10 text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-grow overflow-hidden relative">
                <ContextPanel
                  isOpen={true}
                  setIsOpen={() => {}}
                  files={files}
                  setFiles={setFiles}
                  activeContext={activeContext}
                  setActiveContext={setActiveContext}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
