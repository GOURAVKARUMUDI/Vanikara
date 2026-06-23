"use client";

import { useEffect, useState } from "react";
import { 
  Settings, 
  Database, 
  Palette, 
  Sun, 
  CloudSun, 
  Sunset, 
  Moon, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle
} from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import { useTheme, AtmosphereMode, ThemeMode } from "@/components/layout/ThemeContext";

export default function SettingsManager() {
  const { theme, resolvedTheme, atmosphere, setTheme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(true);
  const [forcingAtmosphere, setForcingAtmosphere] = useState<AtmosphereMode | null>(null);

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

  const handleSetTheme = (mode: ThemeMode) => {
    setTheme(mode);
    setForcingAtmosphere(null);
  };

  const handleForceAtmosphere = (atm: AtmosphereMode) => {
    setForcingAtmosphere(atm);
    const root = document.documentElement;
    root.setAttribute("data-atmosphere", atm);
    // Determine the typical resolved theme for this atmosphere
    const resolved = (atm === "morning" || atm === "afternoon") ? "light" : "dark";
    root.setAttribute("data-theme", resolved);
  };

  const resetAtmosphereOverride = () => {
    setForcingAtmosphere(null);
    // Re-trigger theme logic to restore original calculated theme & atmosphere
    setTheme(theme);
  };

  const brandPresets = [
    {
      id: "morning" as AtmosphereMode,
      name: "Morning Rise",
      time: "06:00 - 12:00",
      theme: "Light Mode",
      colorName: "Gold Amber",
      colorHex: "#FBBF24",
      rgb: "251, 191, 36",
      desc: "Bright, energized theme with golden amber lighting representing clean creation and visual clarity.",
      icon: Sun,
    },
    {
      id: "afternoon" as AtmosphereMode,
      name: "Standard Afternoon",
      time: "12:00 - 17:00",
      theme: "Light Mode",
      colorName: "Brand Blue",
      colorHex: "#1E6BD6",
      rgb: "30, 107, 214",
      desc: "Neutral, high-contrast workspace theme focusing on business administration and operational metrics.",
      icon: CloudSun,
    },
    {
      id: "evening" as AtmosphereMode,
      name: "Sunset Rose",
      time: "17:00 - 20:00",
      theme: "Dark Mode",
      colorName: "Sunset Rose",
      colorHex: "#F43F5E",
      rgb: "244, 63, 94",
      desc: "Elegant twilight workspace featuring warm crimson gradients that alleviate digital eye fatigue.",
      icon: Sunset,
    },
    {
      id: "night" as AtmosphereMode,
      name: "Midnight Indigo",
      time: "20:00 - 06:00",
      theme: "Dark Mode",
      colorName: "Indigo Light",
      colorHex: "#818CF8",
      rgb: "129, 140, 248",
      desc: "Immersive cosmic background featuring deep space styling and low-light operations layout.",
      icon: Moon,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-[var(--accent-color)]" />
          Ecosystem Configurations
        </h2>
        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
          Audit database microservices, preview visual brand presets, and review environmental attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Brand Presets Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4.5 h-4.5 text-[var(--accent-color)]" />
              1. Brand Atmospheric Presets
            </h3>
            {forcingAtmosphere && (
              <button 
                onClick={resetAtmosphereOverride}
                className="text-[9px] font-black uppercase text-[var(--accent-color)] hover:underline cursor-pointer"
              >
                Reset to Auto Atmosphere
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandPresets.map((preset) => {
              const PresetIcon = preset.icon;
              const isActive = forcingAtmosphere 
                ? forcingAtmosphere === preset.id 
                : atmosphere === preset.id;

              return (
                <Card key={preset.id} hover={!isActive} className={`relative transition-all ${
                  isActive ? "border-2 border-[var(--accent-color)] bg-[var(--glass-bg-hover)] shadow-lg" : ""
                }`}>
                  <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-2 rounded-xl text-white" 
                            style={{ backgroundColor: preset.colorHex }}
                          >
                            <PresetIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-xs text-[var(--text-primary)] uppercase">
                              {preset.name}
                            </h4>
                            <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase">
                              {preset.time} • {preset.theme}
                            </span>
                          </div>
                        </div>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-[var(--accent-color)] text-white text-[8px] font-black uppercase rounded tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {preset.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--glass-border)] flex justify-between items-center text-[9px] font-bold">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.colorHex }}
                        />
                        <span className="text-slate-400">RGB: {preset.rgb}</span>
                      </div>
                      <button
                        onClick={() => handleForceAtmosphere(preset.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isActive 
                            ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]" 
                            : "bg-slate-500/5 text-[var(--text-primary)] border-[var(--glass-border)] hover:bg-slate-500/10"
                        }`}
                      >
                        Force Apply
                      </button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

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
              <div className="flex gap-1.5 bg-slate-500/5 p-1 rounded-xl border border-[var(--glass-border)]">
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
                  className="p-1 hover:bg-slate-500/10 rounded transition-all text-slate-400 hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? "animate-spin text-[var(--accent-color)]" : ""}`} />
                </button>
              </div>

              {loadingDb ? (
                <div className="py-6 text-center text-xs text-slate-500 flex justify-center items-center gap-2">
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
                        <span className="text-slate-400">SUPABASE_URL</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          dbStatus.env.NEXT_PUBLIC_SUPABASE_URL === "Configured" 
                            ? "bg-green-500/10 text-green-400" 
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {dbStatus.env.NEXT_PUBLIC_SUPABASE_URL}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">SERVICE_ROLE_KEY</span>
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
                      <span className="text-slate-400">Database Connection</span>
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
                          <span className="text-slate-400">{tbl}</span>
                          <span className={`w-2 h-2 rounded-full ${isOk ? "bg-green-500" : "bg-red-500/40"}`} title={isOk ? "Verified online" : "Offline / Mocked fallback"} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Runtime info */}
                  <div className="space-y-2 pt-2 border-t border-[var(--glass-border)] font-mono text-[10px] text-slate-400">
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
