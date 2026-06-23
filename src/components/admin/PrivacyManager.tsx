"use client";

import React, { useState, useEffect } from "react";
import { Shield, BarChart2, Check, RefreshCw, FileText, CheckSquare, Square, Save } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface PrivacyConfigData {
  currentVersion: string;
  policyText: string;
  stats: {
    totalVisits: number;
    acceptedAll: number;
    rejectedOptional: number;
    customized: number;
    analyticsAccepted: number;
    marketingAccepted: number;
    preferencesAccepted: number;
  };
  optionalServices: {
    googleAnalytics: boolean;
    facebookPixel: boolean;
    hotjar: boolean;
  };
}

export default function PrivacyManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [data, setData] = useState<PrivacyConfigData | null>(null);
  
  // Form fields
  const [policyText, setPolicyText] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [optionalServices, setOptionalServices] = useState({
    googleAnalytics: false,
    facebookPixel: false,
    hotjar: false
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/privacy");
      const body = await res.json();
      
      if (res.ok && body.success && body.data) {
        setData(body.data);
        setPolicyText(body.data.policyText);
        setCurrentVersion(body.data.currentVersion);
        setOptionalServices(body.data.optionalServices);
      } else {
        setError(body.error || "Failed to fetch privacy settings.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleService = (key: keyof typeof optionalServices) => {
    setOptionalServices((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentVersion,
          policyText,
          optionalServices
        })
      });
      const body = await res.json();

      if (res.ok && body.success) {
        setSaveSuccess(true);
        setData(body.data);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setError(body.error || "Failed to save privacy settings.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message || "Network error. Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-xs font-bold text-[var(--text-secondary)]">
        <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent-color)]" />
        <span>Loading Privacy System and Telemetry Node...</span>
      </div>
    );
  }

  // Calculate statistics metrics
  const total = data?.stats?.totalVisits || 0;
  const getRate = (val: number) => {
    if (!total) return "0.0%";
    return `${((val / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--accent-color)] animate-pulse" />
            Consent Management Center (CMP)
          </h2>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
            Monitor real-time visitor consent metrics and publish updated legal policy caches.
          </p>
        </div>
        <button 
          onClick={fetchData} 
          className="px-4 py-2 bg-slate-500/5 hover:bg-slate-500/10 border border-[var(--glass-border)] text-[9px] font-black uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)] w-fit"
        >
          <RefreshCw className="w-3 h-3" /> Refresh Stats
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold select-none">
          ⚠️ {error}
        </div>
      )}

      {/* Aggregate Statistics */}
      <div className="space-y-4">
        <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5 select-none">
          <BarChart2 className="w-4 h-4 text-[var(--accent-color)]" />
          1. Global Consent Analytics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-5 text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-black">Total Interactions</span>
              <p className="text-3xl font-display font-black text-[var(--text-primary)] tracking-tight">{total}</p>
              <span className="text-[8px] text-[var(--text-secondary)] font-bold">visits recorded</span>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-5 text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-black">Accept All Rate</span>
              <p className="text-3xl font-display font-black text-green-500 tracking-tight">{getRate(data?.stats?.acceptedAll || 0)}</p>
              <span className="text-[8px] text-[var(--text-secondary)] font-bold">{data?.stats?.acceptedAll} users opted in</span>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-5 text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-black">Reject All Rate</span>
              <p className="text-3xl font-display font-black text-orange-500 tracking-tight">{getRate(data?.stats?.rejectedOptional || 0)}</p>
              <span className="text-[8px] text-[var(--text-secondary)] font-bold">{data?.stats?.rejectedOptional} users opted out</span>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-5 text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] font-black">Custom Rate</span>
              <p className="text-3xl font-display font-black text-blue-500 tracking-tight">{getRate(data?.stats?.customized || 0)}</p>
              <span className="text-[8px] text-[var(--text-secondary)] font-bold">{data?.stats?.customized} customized setups</span>
            </CardBody>
          </Card>
        </div>

        {/* Detailed Category Opt-Ins */}
        <Card>
          <CardBody className="p-6 space-y-4">
            <h4 className="text-xs font-display font-bold text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-2 select-none uppercase tracking-wide">
              Granular Category Opt-In Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-semibold">
              <div className="space-y-1 bg-slate-500/5 p-4 rounded-xl border border-[var(--glass-border)]">
                <span className="text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-widest">Preference Cookies</span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xl font-display font-black text-[var(--text-primary)]">{getRate(data?.stats?.preferencesAccepted || 0)}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">{data?.stats?.preferencesAccepted} accepts</span>
                </div>
              </div>
              <div className="space-y-1 bg-slate-500/5 p-4 rounded-xl border border-[var(--glass-border)]">
                <span className="text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-widest">Analytics Cookies</span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xl font-display font-black text-[var(--text-primary)]">{getRate(data?.stats?.analyticsAccepted || 0)}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">{data?.stats?.analyticsAccepted} accepts</span>
                </div>
              </div>
              <div className="space-y-1 bg-slate-500/5 p-4 rounded-xl border border-[var(--glass-border)]">
                <span className="text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-widest">Marketing Cookies</span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xl font-display font-black text-[var(--text-primary)]">{getRate(data?.stats?.marketingAccepted || 0)}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">{data?.stats?.marketingAccepted} accepts</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5 select-none">
          <FileText className="w-4 h-4 text-[var(--accent-color)]" />
          2. CMP Policy & Services Configuration
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Policy Text & Version (Left) */}
          <div className="lg:col-span-8 space-y-5">
            <Card>
              <CardBody className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Consent Banner Policy Description
                  </label>
                  <textarea
                    rows={4}
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                    required
                    className="w-full bg-slate-500/5 text-[var(--text-primary)] text-xs rounded-xl p-3 border border-[var(--glass-border)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-medium leading-relaxed resize-none"
                    placeholder="We use essential cookies to operate our website and optional cookies..."
                  />
                  <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    This text will be cached and displayed inside the floating Liquid Glass cookie consent banner on the visitor&apos;s first visit.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Consent Version Control
                  </label>
                  <input
                    type="text"
                    value={currentVersion}
                    onChange={(e) => setCurrentVersion(e.target.value)}
                    required
                    className="w-full bg-slate-500/5 text-[var(--text-primary)] text-xs rounded-xl p-3 border border-[var(--glass-border)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-mono font-bold"
                    placeholder="1.0.0"
                  />
                  <div className="p-3.5 rounded-xl border border-blue-500/10 bg-blue-500/5 text-[9px] text-blue-500 leading-normal font-bold">
                    ⚠️ IMPORTANT: Incrementing this version number will invalidate all cookie preference caches on current users&apos; browsers, forcing the cookie banner to reappear on their next visit to collect consent updates.
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Third Party Services Toggles (Right) */}
          <div className="lg:col-span-4 space-y-5">
            <Card>
              <CardBody className="p-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-2 select-none tracking-widest">
                  Optional Tracking Integrations
                </h4>
                
                <div className="space-y-3.5">
                  {[
                    { key: "googleAnalytics", label: "Google Analytics (gtag)" },
                    { key: "facebookPixel", label: "Facebook Pixel (fbp)" },
                    { key: "hotjar", label: "Hotjar UX Tracking" }
                  ].map((service) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const active = (optionalServices as any)[service.key];
                    return (
                      <button
                        type="button"
                        key={service.key}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => handleToggleService(service.key as any)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--glass-border)] bg-slate-500/5 hover:bg-slate-500/10 transition-colors text-xs text-[var(--text-primary)] font-bold text-left cursor-pointer"
                      >
                        <span>{service.label}</span>
                        {active ? (
                          <CheckSquare className="w-5 h-5 text-[var(--accent-color)] shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-[var(--text-secondary)] opacity-60 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed font-medium">
                  When enabled, the Consent Provider automatically activates scripts associated with these services *only* after the visitor grants consent for the corresponding categories.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Submit Bar */}
        <Card>
          <CardBody className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">
              Current Cache Node Target: <strong className="text-[var(--text-primary)] font-extrabold">privacy_config.json</strong>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {saveSuccess && (
                <div className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Policy caches updated successfully.
                </div>
              )}
              
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto font-bold text-xs uppercase tracking-wide gap-1.5 shrink-0 py-2.5 px-6"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Publish New Policy
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
