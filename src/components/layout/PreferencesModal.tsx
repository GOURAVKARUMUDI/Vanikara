"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useConsent, ConsentSettings } from "@/context/ConsentContext";
import Button from "@/components/ui/Button";

type OptionalKey = keyof Omit<ConsentSettings, "essential">;

const CATEGORIES: { key: OptionalKey; title: string; desc: string }[] = [
  {
    key: "preferences",
    title: "Preferences",
    desc: "Remember choices such as light or dark theme between visits.",
  },
  {
    key: "analytics",
    title: "Analytics",
    desc: "Help us understand which pages are useful and how the site performs.",
  },
  {
    key: "marketing",
    title: "Marketing",
    desc: "Not currently used. Off unless you turn it on.",
  },
];

/**
 * Cookie preferences dialog. Focus moves into the dialog on open, Tab is
 * contained, Escape closes and focus returns to the element that opened it.
 */
export default function PreferencesModal() {
  const { showModal, consent, closePreferences, savePreferences, acceptAll, rejectOptional } = useConsent();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef(closePreferences);
  const consentRef = useRef(consent);
  useEffect(() => {
    closeRef.current = closePreferences;
    consentRef.current = consent;
  });
  const [localPrefs, setLocalPrefs] = useState<Record<OptionalKey, boolean>>({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (!showModal) return;
    const current = consentRef.current;
    setLocalPrefs({ preferences: current.preferences, analytics: current.analytics, marketing: current.marketing });
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={closePreferences}
        className="rise-in absolute inset-0 bg-navy/30 backdrop-blur-sm dark:bg-black/50"
        style={{ animationDuration: "300ms" }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-dialog-title"
        className="rise-in liquid-glass glass-strong relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-panel"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id="cookie-dialog-title" className="text-lg font-bold text-fg">
              Cookie preferences
            </h2>
            <p className="mt-1 text-[0.8125rem] text-fg-muted">Choose which optional cookies we may use.</p>
          </div>
          <button
            type="button"
            onClick={closePreferences}
            aria-label="Close cookie preferences"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-6 py-5">
          <div className="flex items-start justify-between gap-6 rounded-card border border-line p-4">
            <div>
              <p className="text-sm font-semibold text-fg">Essential</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-muted">
                Needed for the site to work — for example sign-in sessions and remembering this choice. Always on.
              </p>
            </div>
            <span className="shrink-0 pt-0.5 text-xs font-semibold text-fg-subtle">Always on</span>
          </div>

          {CATEGORIES.map((category) => {
            const checked = localPrefs[category.key];
            const labelId = `cookie-${category.key}`;
            return (
              <div key={category.key} className="flex items-start justify-between gap-6 rounded-card border border-line p-4">
                <div>
                  <p id={labelId} className="text-sm font-semibold text-fg">
                    {category.title}
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-fg-muted">{category.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  aria-labelledby={labelId}
                  onClick={() => setLocalPrefs((prev) => ({ ...prev, [category.key]: !prev[category.key] }))}
                  className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                    checked ? "bg-action" : "bg-line-strong"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-brand ${
                      checked ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          <Button onClick={rejectOptional} variant="ghost" size="sm">
            Essential only
          </Button>
          <Button onClick={acceptAll} variant="secondary" size="sm">
            Accept all
          </Button>
          <Button onClick={() => savePreferences(localPrefs)} size="sm">
            Save choices
          </Button>
        </div>
      </div>
    </div>
  );
}
