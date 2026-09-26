"use client";

import { useConsent } from "@/context/ConsentContext";

export default function CookieSettingsButton({ className = "" }: { className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Cookie settings
    </button>
  );
}
