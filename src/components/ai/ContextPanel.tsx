"use client";

import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft, FileText, Shield, Activity, Trash2, Upload } from "lucide-react";

interface ContextPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  activeContext: string;
  setActiveContext: (context: string) => void;
  isAuthenticated: boolean;
}

export default function ContextPanel({
  isOpen,
  setIsOpen,
  files,
  setFiles,
  activeContext,
  setActiveContext,
  isAuthenticated
}: ContextPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const attachedFile = e.target.files?.[0];
    if (!attachedFile) return;

    setUploading(true);
    setUploadStatus("Reading data...");
    
    const formData = new FormData();
    formData.append("file", attachedFile);

    try {
      const res = await fetch("/api/ai/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const newFile = {
          id: data.fileId,
          name: data.fileName,
          size: `${(data.sizeBytes / 1024).toFixed(1)} KB`,
          textContext: data.textContext
        };
        setFiles(prev => [newFile, ...prev]);
        setActiveContext(data.textContext); // Set active context automatically for grounding
        setUploadStatus("Successfully parsed!");
        setTimeout(() => setUploadStatus(""), 2000);
      } else {
        setUploadStatus(data.error || "Failed upload.");
      }
    } catch (_err) {
      setUploadStatus("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setActiveContext(""); // Reset grounded context
  };

  return (
    <div
      className={`relative h-[calc(100vh-4rem)] border-l border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-300 flex flex-col z-20 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Collapse Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-3 top-5 w-6 h-6 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--accent-color)] text-[var(--text-secondary)] hover:text-white flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95"
      >
        {isOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Grounding / Upload section (Only if Authenticated) */}
      {isAuthenticated ? (
        <>
          <div className="p-4 border-b border-[var(--glass-border)] flex-shrink-0">
            {isOpen ? (
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2.5">
                  Knowledge Grounding (RAG)
                </span>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.csv,.json,.pdf,.docx"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-500/5 hover:bg-slate-500/10 border border-dashed border-[var(--glass-border)] rounded-xl text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  Index Document
                </button>

                {uploadStatus && (
                  <div className="mt-2 text-[10px] font-bold text-[var(--accent-color)] animate-pulse truncate text-center">
                    {uploadStatus}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Index Document"
                className="w-8 h-8 mx-auto flex items-center justify-center rounded-xl bg-slate-500/5 border border-dashed border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <Upload className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Uploaded Documents List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {isOpen && (
              <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                Grounded Indices
              </span>
            )}

            {files.length === 0 && isOpen && (
              <div className="text-[10px] text-[var(--text-secondary)] py-4 text-center italic leading-relaxed">
                Attach text/docs to build custom local context indexes.
              </div>
            )}

            {files.map((file) => {
              const isGrounded = activeContext === file.textContext;
              return (
                <div
                  key={file.id}
                  onClick={() => setActiveContext(isGrounded ? "" : file.textContext)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 group relative ${
                    isGrounded
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] shadow-sm"
                      : "border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  {isOpen && (
                    <div className="min-w-0 flex-1 pr-6">
                      <span className="block text-[11px] font-bold truncate leading-tight">{file.name}</span>
                      <span className="block text-[9px] text-[var(--text-secondary)] mt-1">{file.size}</span>
                    </div>
                  )}
                  {isOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Guest Locked Features panel */
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 scrollbar-thin">
          {isOpen ? (
            <div className="p-3.5 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3 text-[10px] text-[var(--text-secondary)] leading-relaxed">
              <div className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5 text-[9px] uppercase tracking-wider">
                🔒 Authenticated Workspace
              </div>
              <p className="font-medium">
                This capability is available inside your authenticated workspace.
              </p>
              <div className="font-bold text-[var(--text-primary)] uppercase tracking-wide text-[8px] border-t border-[var(--glass-border)] pt-2.5 mt-1.5">
                Sign in to unlock:
              </div>
              <ul className="list-disc pl-3.5 space-y-1.5 font-medium text-[9px]">
                <li>File uploads</li>
                <li>Long-term memory</li>
                <li>Document intelligence</li>
                <li>Workspace history</li>
                <li>Custom AI agents</li>
              </ul>
              <button
                onClick={() => window.location.href = "/login"}
                className="w-full py-2 bg-[var(--accent-color)] hover:opacity-90 text-white font-semibold text-[8px] uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm text-center mt-2.5"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4" title="Sign in to unlock Document analysis & Agent parameters">
              <div className="w-8 h-8 rounded-xl border border-dashed border-red-500/20 bg-red-500/5 flex items-center justify-center text-xs">
                🔒
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agents & System Memory Modules (Only if Authenticated or generic stats for guest) */}
      {isOpen && (
        <div className="p-4 border-t border-[var(--glass-border)] space-y-4 bg-slate-500/5">
          <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              Active System Agent
            </span>
            <div className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[10px] space-y-1 font-mono leading-relaxed">
              <div className="font-extrabold text-[var(--text-primary)]">
                {isAuthenticated ? "Cygma Core Router v1.2" : "Cygma Guest Engine"}
              </div>
              <div className="text-[var(--text-secondary)]">
                {isAuthenticated ? "Mode: Grounded vector query" : "Mode: Limited Sandbox Rate"}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
              Core Node Status
            </span>
            <div className="text-[10px] font-mono text-[var(--text-secondary)] flex justify-between">
              <span>Status: Operational</span>
              <span>Latency: 28ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
