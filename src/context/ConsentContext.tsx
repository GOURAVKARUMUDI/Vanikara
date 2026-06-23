"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ConsentSettings {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ConsentContextType {
  consent: ConsentSettings;
  hasSetConsent: boolean;
  showBanner: boolean;
  showModal: boolean;
  consentVersion: string;
  policyText: string;
  optionalServices: Record<string, boolean>;
  setShowBanner: (show: boolean) => void;
  setShowModal: (show: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (prefs: Omit<ConsentSettings, "essential">) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  refreshSettings: () => void;
}

const DEFAULT_CONSENT: ConsentSettings = {
  essential: true,
  preferences: false,
  analytics: false,
  marketing: false
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentSettings>(DEFAULT_CONSENT);
  const [hasSetConsent, setHasSetConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // CMP Configs synced from the server configuration
  const [consentVersion, setConsentVersion] = useState("1.0.0");
  const [policyText, setPolicyText] = useState(
    "We use essential cookies to operate our website and optional cookies to improve performance, personalize your experience, and understand how visitors use our platform."
  );
  const [optionalServices, setOptionalServices] = useState<Record<string, boolean>>({
    googleAnalytics: true,
    facebookPixel: false,
    hotjar: false
  });

  // Load policy configurations and user preferences on mount
  const loadConsentData = async () => {
    // Immediately check local storage to prevent rendering delays
    const stored = localStorage.getItem("cookie_consent_settings");
    const storedVer = localStorage.getItem("cookie_consent_version");

    if (stored) {
      setConsent(JSON.parse(stored));
      setHasSetConsent(true);
      setShowBanner(false);
    } else {
      // Defer banner until first user interaction to prevent it from replacing the true LCP
      const triggerBanner = () => {
        setShowBanner(true);
        window.removeEventListener("scroll", triggerBanner);
        window.removeEventListener("touchstart", triggerBanner);
        window.removeEventListener("mousemove", triggerBanner);
        window.removeEventListener("keydown", triggerBanner);
      };

      window.addEventListener("scroll", triggerBanner, { passive: true });
      window.addEventListener("touchstart", triggerBanner, { passive: true });
      window.addEventListener("mousemove", triggerBanner, { passive: true });
      window.addEventListener("keydown", triggerBanner, { passive: true });
    }

    // Fetch latest policy version from the admin privacy API in the background
    try {
      const res = await fetch("/api/admin/privacy");
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data) {
          setConsentVersion(body.data.currentVersion);
          setPolicyText(body.data.policyText);
          setOptionalServices(body.data.optionalServices);

          // If they consented to an older version, we might want to re-trigger the banner
          // but for now we just update the text in case they open preferences.
          if (stored && storedVer !== body.data.currentVersion) {
            // Optional: trigger banner again for new version
            // setShowBanner(true); 
          }
        }
      }
    } catch (_e) {
      // Ignore background fetch errors
    }
  };

  useEffect(() => {
    loadConsentData();
  }, []);

  const persistConsent = async (settings: ConsentSettings, action: "accept_all" | "reject_optional" | "custom") => {
    setConsent(settings);
    setHasSetConsent(true);
    setShowBanner(false);
    setShowModal(false);

    // Save in local storage
    localStorage.setItem("cookie_consent_settings", JSON.stringify(settings));
    localStorage.setItem("cookie_consent_version", consentVersion);

    // Track consent update in database via API (updates stats anonymously)
    try {
      await fetch("/api/privacy/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          preferences: settings,
          version: consentVersion
        })
      });
    } catch (_e) {
      // Fail silently (local state persists)
    }

    // Trigger standard analytics initialization rules dynamically
    if (settings.analytics) {
      // E.g. trigger ga('consent', 'update', { 'analytics_storage': 'granted' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag?.("consent", "update", {
        analytics_storage: "granted"
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag?.("consent", "update", {
        analytics_storage: "denied"
      });
    }
  };

  const acceptAll = () => {
    const allAccepted: ConsentSettings = {
      essential: true,
      preferences: true,
      analytics: true,
      marketing: true
    };
    persistConsent(allAccepted, "accept_all");
  };

  const rejectOptional = () => {
    const onlyEssential: ConsentSettings = {
      essential: true,
      preferences: false,
      analytics: false,
      marketing: false
    };
    persistConsent(onlyEssential, "reject_optional");
  };

  const savePreferences = (prefs: Omit<ConsentSettings, "essential">) => {
    const customSettings: ConsentSettings = {
      essential: true,
      ...prefs
    };
    persistConsent(customSettings, "custom");
  };

  const openPreferences = () => {
    setShowModal(true);
  };

  const closePreferences = () => {
    setShowModal(false);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasSetConsent,
        showBanner,
        showModal,
        consentVersion,
        policyText,
        optionalServices,
        setShowBanner,
        setShowModal,
        acceptAll,
        rejectOptional,
        savePreferences,
        openPreferences,
        closePreferences,
        refreshSettings: loadConsentData
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}