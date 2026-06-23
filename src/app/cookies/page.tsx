"use client";

import { useState, useEffect } from "react";
import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Cookie, Check, RefreshCw } from "lucide-react";
import { FadeUp } from "@/components/Animate";
import { useConsent } from "@/context/ConsentContext";

export default function CookiesPage() {
  const { consent, savePreferences } = useConsent();
  
  const [preferences, setPreferences] = useState({
    preferences: false,
    analytics: false,
    marketing: false
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setPreferences({
      preferences: consent.preferences,
      analytics: consent.analytics,
      marketing: consent.marketing
    });
  }, [consent]);

  const handleToggle = (key: "preferences" | "analytics" | "marketing") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      savePreferences(preferences);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 800);
  };

  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Data Compliance"
        title={<>Cookie <span className="gradient-text">Policy</span></>}
        subtitle="Understand how VANIKARA uses cookies to optimize page loads, remember preferences, and analyze node latency."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Preference Center Panel */}
          <div className="lg:col-span-5">
            <FadeUp>
              <Card hover className="relative overflow-hidden">
                <CardBody className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-2 border-b border-[var(--glass-border)] pb-3 select-none">
                    <Cookie className="w-5 h-5 text-[var(--accent-color)]" />
                    <h3 className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)]">
                      Cookie Preference Center
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* 1. Essential */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Essential Cookies (Required)</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Necessary for fundamental website operations (e.g. logging into your user dashboard, secure Stripe gateways).
                        </p>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-slate-500/10 text-[var(--text-secondary)] border border-[var(--glass-border)] px-2.5 py-1 rounded">
                        Active
                      </span>
                    </div>

                    {/* 2. Preferences / Functional */}
                    <div className="flex items-start justify-between gap-4 border-t border-[var(--glass-border)] pt-4">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Functional Cookies</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Remembers your customized dashboard settings (e.g. selected theme atmosphere morning/night).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("preferences")}
                        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          preferences.preferences ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            preferences.preferences ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 3. Analytics / Analytical */}
                    <div className="flex items-start justify-between gap-4 border-t border-[var(--glass-border)] pt-4">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Analytical Cookies</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Tracks page latencies and server node request times to measure load metrics.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("analytics")}
                        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          preferences.analytics ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            preferences.analytics ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 4. Marketing */}
                    <div className="flex items-start justify-between gap-4 border-t border-[var(--glass-border)] pt-4">
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-[var(--text-primary)]">Marketing & Targeting</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                          Facilitates tracking for partners and campaigns.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle("marketing")}
                        className={`w-10 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          preferences.marketing ? "bg-[var(--accent-color)]" : "bg-slate-500/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                            preferences.marketing ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--glass-border)]">
                    <Button
                      onClick={handleSave}
                      disabled={saveStatus !== "idle"}
                      className="w-full font-bold text-xs uppercase tracking-wide gap-1.5"
                    >
                      {saveStatus === "saving" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      {saveStatus === "saved" && <Check className="w-3.5 h-3.5" />}
                      {saveStatus === "idle" && "Save My Preferences"}
                      {saveStatus === "saving" && "Saving..."}
                      {saveStatus === "saved" && "Saved Successfully"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </FadeUp>
          </div>

          {/* Right Column: Policy text details */}
          <div className="lg:col-span-7 space-y-6">
            <FadeUp delay={0.1}>
              <h2 className="font-display font-black text-2xl text-[var(--text-primary)] uppercase tracking-wide">
                Cookie Disclosures & Classifications
              </h2>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-4 font-medium">
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mt-4">What are Cookies?</h3>
                <p>
                  Cookies are tiny files stored on your local hardware device during browser sessions. They let web servers remember user profile credentials, selected layout parameters, and optimize database cache queries.
                </p>

                <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mt-4">How We Use Cookies</h3>
                <p>
                  VANIKARA Intelligence Private Limited utilizes cookies to track session tokens and provide user access to dashboard features. Analytical cookies help inspect routing latency across our vector databases and API gateways.
                </p>

                <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mt-4">Managing Preferences</h3>
                <p>
                  You can modify your preferences at any time using our preference center on the left. Alternatively, you can configure your browser to reject all cookie parameters. Note that blocking essential session cookies will prevent log in to the client dashboard.
                </p>
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </div>
  );
}
