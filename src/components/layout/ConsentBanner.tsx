"use client";

import Link from "next/link";
import { useConsent } from "@/context/ConsentContext";
import Button from "@/components/ui/Button";

/**
 * Cookie consent notice. Non-blocking: the page stays usable while it is open.
 */
export default function ConsentBanner() {
  const { showBanner, acceptAll, rejectOptional, openPreferences } = useConsent();

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      data-open={showBanner}
      className="consent-banner liquid-glass glass-strong fixed inset-x-3 bottom-3 z-[45] rounded-feature p-5 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm sm:p-6"
      hidden={!showBanner}
    >
      <p className="text-sm font-semibold text-fg">Cookies on this site</p>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-muted">
        We use essential cookies to run the site and, with your permission, optional ones to understand how it is used.
        Read our{" "}
        <Link href="/legal/cookies" className="font-semibold text-intel underline-offset-2 hover:underline">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button onClick={rejectOptional} variant="secondary" size="sm">
          Essential only
        </Button>
        <Button onClick={acceptAll} size="sm">
          Accept all
        </Button>
      </div>
      <button
        type="button"
        onClick={openPreferences}
        className="mt-3 w-full rounded-compact py-1.5 text-[0.8125rem] font-medium text-fg-muted transition-colors hover:text-fg"
      >
        Manage preferences
      </button>
    </div>
  );
}
