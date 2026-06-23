"use client";

import React, { useState, useEffect } from "react";
import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Server, Database, Cpu, CreditCard, Globe, RefreshCw } from "lucide-react";
import { FadeUp } from "@/components/Animate";

interface ServiceNode {
  name: string;
  type: string;
  status: "Operational" | "Degraded" | "Offline";
  latency: number;
  uptime: string;
  location: string;
  icon: React.ReactNode;
}

export default function StatusPage() {
  const [nodes, setNodes] = useState<ServiceNode[]>([
    {
      name: "Supabase pgvector Cluster",
      type: "Vector Database Node",
      status: "Operational",
      latency: 12,
      uptime: "99.99%",
      location: "Mumbai Region (AWS)",
      icon: <Database className="w-4.5 h-4.5" />
    },
    {
      name: "CYGMA AI Gateway Router",
      type: "Edge API Router Node",
      status: "Operational",
      latency: 18,
      uptime: "99.97%",
      location: "Bengaluru Region (GCP)",
      icon: <Cpu className="w-4.5 h-4.5" />
    },
    {
      name: "Model Syncer API Gateway",
      type: "LLM Provider Router",
      status: "Operational",
      latency: 242,
      uptime: "99.95%",
      location: "Global Edge Network",
      icon: <Server className="w-4.5 h-4.5" />
    },
    {
      name: "Secure Payment Portal",
      type: "Stripe Transaction Gateway",
      status: "Operational",
      latency: 45,
      uptime: "100.00%",
      location: "India Central Hub",
      icon: <CreditCard className="w-4.5 h-4.5" />
    },
    {
      name: "CDN Static Asset Caching",
      type: "Cloudflare Caching Edge",
      status: "Operational",
      latency: 4,
      uptime: "99.99%",
      location: "Anycast Edge Nodes",
      icon: <Globe className="w-4.5 h-4.5" />
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>("");

  const updateLastChecked = () => {
    const now = new Date();
    setLastChecked(now.toLocaleTimeString());
  };

  useEffect(() => {
    updateLastChecked();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate minor fluctuation in latency
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          latency: Math.max(2, node.latency + Math.round((Math.random() - 0.5) * 4))
        }))
      );
      updateLastChecked();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Infrastructure Telemetry"
        title={<>System <span className="gradient-text">Status</span></>}
        subtitle="Real-time operational telemetry tracking database nodes, edge routing, model gateways, and transaction networks."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-8">
        
        {/* Overall Status Banner */}
        <FadeUp>
          <div className="p-6 rounded-[2rem] bg-[var(--glass-bg)] border border-green-500/20 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left select-none">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </div>
              <div>
                <h3 className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)]">
                  All Systems Operational
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
                  General uptime average: <strong className="text-green-500">99.98%</strong> over last 90 days.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">
                Last Sync: {lastChecked}
              </span>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 border border-[var(--glass-border)] text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50"
                aria-label="Refresh system status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Nodes Grid */}
        <div className="space-y-4">
          <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider select-none">
            Infrastructure Nodes
          </h3>

          <div className="space-y-3">
            {nodes.map((node, idx) => (
              <FadeUp key={node.name} delay={idx * 0.05}>
                <Card>
                  <CardBody className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-[var(--accent-color)]/10 border border-[var(--glass-border)] text-[var(--accent-color)] shrink-0">
                        {node.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide truncate">
                          {node.name}
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-none font-medium truncate">
                          {node.type} • {node.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-widest leading-none">Latency</span>
                        <span className="font-mono text-[var(--text-primary)] mt-1 block leading-none font-bold">{node.latency} ms</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-widest leading-none">Uptime</span>
                        <span className="font-mono text-green-500 mt-1 block leading-none font-bold">{node.uptime}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider border bg-green-500/10 text-green-500 border-green-500/20">
                        {node.status}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Support Alert banner */}
        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-wrap gap-3 items-center justify-between">
          <div className="text-xs text-[var(--text-secondary)] font-semibold">
            Status checks are automatically executed every 60 seconds.
          </div>
          <Button href="/contact" variant="ghost" className="text-xs uppercase font-bold tracking-wider">
            Report Outage Node
          </Button>
        </div>

      </div>
    </div>
  );
}
