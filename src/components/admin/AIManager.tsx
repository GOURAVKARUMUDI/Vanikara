"use client";

import { Cpu, Server, Key, ShieldCheck, RefreshCw } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";

export default function AIManager() {
  const models = [
    { name: "gpt-4o", status: "active", desc: "Core routing queries parser engine" },
    { name: "gpt-4-turbo", status: "active", desc: "Complex logistics planning fallback node" },
    { name: "gpt-3.5-turbo", status: "deprecated", desc: "Legacy campus rep parsing" }
  ];

  const dbMetrics = [
    { label: "Vector Embeddings Dimensions", val: "1536 (OpenAI text-embedding-3)" },
    { label: "Indexed Document Rows", val: "1,450 documents grounded" },
    { label: "Average Similarity Score Match", val: "0.86 (Cosine Similarity)" },
    { label: "Vector Search Index Status", val: "Operational (HNSW Index)" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[var(--accent-color)] animate-pulse" />
          CYGMA AI Control Engine
        </h2>
        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
          Diagnose active models routing states, vector similarity benchmarks, and rate limit indices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Models */}
        <div className="space-y-4">
          <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider">
            1. Active LLM Routing Nodes
          </h3>
          <div className="space-y-3">
            {models.map((m) => (
              <Card key={m.name}>
                <CardBody className="p-5 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-mono font-bold text-[var(--text-primary)]">{m.name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-medium">{m.desc}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider border ${
                    m.status === "active"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                  }`}>
                    {m.status}
                  </span>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Vector DB status */}
        <div className="space-y-4">
          <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider">
            2. Vector Database Context Metrics
          </h3>
          <Card>
            <CardBody className="p-6 space-y-4 text-xs font-medium">
              <div className="flex items-center gap-2 border-b border-[var(--glass-border)] pb-2 select-none">
                <Server className="w-4.5 h-4.5 text-[var(--accent-color)]" />
                <span className="font-display font-bold text-[var(--text-primary)]">Supabase pgvector Cluster</span>
              </div>
              <div className="space-y-3">
                {dbMetrics.map((met) => (
                  <div key={met.label} className="flex justify-between items-center gap-4">
                    <span className="text-[var(--text-secondary)]">{met.label}</span>
                    <span className="font-mono text-[var(--text-primary)] font-bold">{met.val}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

      {/* Diagnostics */}
      <Card>
        <CardBody className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-bold text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>AI Gateway Status: <strong className="text-green-500 uppercase">Operational (Latency 240ms)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[var(--accent-color)]" />
            <span>OpenAI API Thread Key: <strong className="text-[var(--text-primary)] font-extrabold">Active (Provisioned)</strong></span>
          </div>
          <button className="px-4 py-2 bg-slate-500/5 hover:bg-slate-500/10 border border-[var(--glass-border)] text-[9px] font-black uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)]">
            <RefreshCw className="w-3 h-3" /> Re-index Vector Files
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
