"use client";

import { useEffect, useState } from "react";
import { Settings, Database, Palette, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import { useTheme, ThemeMode } from "@/components/layout/ThemeContext";

export default function SettingsManager() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  const fetchDbStatus = async () => {
    try {
      setLoadingDb(true);
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success) {
        setDbStatus(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch database status:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const handleSetTheme = (mode: ThemeMode) => setTheme(mode);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-[var(--accent-color)]" />
          Ecosystem Configurations
        </h2>
        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
          Review database connectivity, environment configuration and appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Brand Presets Controls */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4.5 h-4.5 text-[var(--accent-color)]" />
            1. Appearance
          </h3>

          {/* Theme Settings Mode */}
          <Card>
            <CardBody className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-display font-black text-xs text-[var(--text-primary)] uppercase">
                  Global System Theme Mode
                </h4>
                <p className="text-[10px] text-[var(--text-secondary)] font-semibold mt-0.5">
                  Currently resolved to: <strong className="text-[var(--text-primary)] uppercase">{resolvedTheme}</strong>
                </p>
              </div>
              <div className="flex gap-1.5 bg-surface-sunken p-1 rounded-xl border border-[var(--glass-border)]">
                {(["light", "dark", "auto"] as ThemeMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleSetTheme(m)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      theme === m
                        ? "bg-[var(--accent-color)] text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Database Status Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-[var(--accent-color)]" />
            2. Database Infrastructure
          </h3>

          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-3">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase">Supabase Status</span>
                <button 
                  onClick={fetchDbStatus}
                  disabled={loadingDb}
                  className="p-1 hover:bg-surface-sunken rounded transition-all text-fg-subtle hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? "animate-spin text-[var(--accent-color)]" : ""}`} />
                </button>
              </div>

              {loadingDb ? (
                <div className="py-6 text-center text-xs text-fg-subtle flex justify-center items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying infrastructure connection...
                </div>
              ) : dbStatus ? (
                <div className="space-y-4 text-xs font-medium">
                  {/* Environment Vars */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block">
                      Environment Variables
                    </span>
                    <div className="space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-fg-subtle">SUPABASE_URL</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          dbStatus.env.NEXT_PUBLIC_SUPABASE_URL === "Configured" 
                            ? "bg-green-500/10 text-green-400" 
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {dbStatus.env.NEXT_PUBLIC_SUPABASE_URL}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-fg-subtle">SERVICE_ROLE_KEY</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          dbStatus.env.SUPABASE_SERVICE_ROLE_KEY === "Configured" 
                            ? "bg-green-500/10 text-green-400" 
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {dbStatus.env.SUPABASE_SERVICE_ROLE_KEY}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connectivity */}
                  <div className="space-y-2 pt-2 border-t border-[var(--glass-border)]">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block">
                      Connectivity
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-fg-subtle">Database Connection</span>
                      <div className="flex items-center gap-1">
                        {dbStatus.dbConnected ? (
                          <>
                            <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                            <span className="text-green-500 font-bold uppercase text-[10px]">Connected</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4.5 h-4.5 text-red-500" />
                            <span className="text-red-500 font-bold uppercase text-[10px]">Fallback Mode</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tables Verified */}
                  <div className="space-y-2 pt-2 border-t border-[var(--glass-border)]">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest block">
                      Tables Connectivity Audit
                    </span>
                    <div className="space-y-1.5 font-mono text-[10px]">
                      {Object.entries(dbStatus.tablesStatus).map(([tbl, isOk]) => (
                        <div key={tbl} className="flex justify-between items-center">
                          <span className="text-fg-subtle">{tbl}</span>
                          <span className={`w-2 h-2 rounded-full ${isOk ? "bg-green-500" : "bg-red-500/40"}`} title={isOk ? "Verified online" : "Offline / Mocked fallback"} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Runtime info */}
                  <div className="space-y-2 pt-2 border-t border-[var(--glass-border)] font-mono text-[10px] text-fg-subtle">
                    <div className="flex justify-between">
                      <span>Node Runtime</span>
                      <span className="text-[var(--text-primary)] font-bold">{dbStatus.nodeVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Environment</span>
                      <span className="text-[var(--text-primary)] font-bold uppercase">{dbStatus.environment}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-red-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Failed checking DB configurations.
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
