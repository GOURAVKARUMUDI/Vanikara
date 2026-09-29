"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DAYPART_BOOT_JS, daypartForTime, msUntilNextBoundary, themeForTime, type Daypart } from "@/lib/daypart";

export type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

/** Screen point the theme-switch reveal grows from. */
export type RevealOrigin = { x: number; y: number };

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  daypart: Daypart;
  /** Pass an origin to switch with a circular reveal from that point. */
  setTheme: (theme: ThemeMode, origin?: RevealOrigin) => void;
}

export const THEME_STORAGE_KEY = "vanikara-theme";

/**
 * Runs in <head> before first paint so the correct theme is applied
 * immediately (no light/dark flash). "auto" follows local time (see
 * lib/daypart). Also marks JS as available, flags Chromium for the
 * liquid-glass refraction filter, and records the first-visit intro.
 */
export const THEME_BOOT_SCRIPT = `(function(){var r=document.documentElement;r.classList.add('js');try{var b=navigator.userAgentData&&navigator.userAgentData.brands;if(b&&b.some(function(x){return x.brand==='Chromium'}))r.classList.add('lg-refract')}catch(e){}try{${DAYPART_BOOT_JS}var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||(t!=='light'&&autoDark);r.setAttribute('data-theme',d?'dark':'light');if(sessionStorage.getItem('vk-intro')){r.classList.add('intro-seen')}else{sessionStorage.setItem('vk-intro','1');r.classList.add('intro-first');setTimeout(function(){r.classList.remove('intro-first')},1200)}}catch(e){r.setAttribute('data-theme','light')}})();`;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
  }
  return "auto";
}

function resolve(theme: ThemeMode): ResolvedTheme {
  return theme === "auto" ? themeForTime() : theme;
}

type StartViewTransition = (cb: () => void) => { finished: Promise<void> };

/**
 * Applies a DOM change inside a View Transition when the browser supports
 * it: a circular reveal from `origin`, or a soft cross-fade without one.
 */
function withTransition(apply: () => void, origin?: RevealOrigin) {
  const root = document.documentElement;
  const start = (document as Document & { startViewTransition?: StartViewTransition }).startViewTransition;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!start || reduced || document.visibilityState !== "visible") {
    apply();
    return;
  }
  if (origin) {
    const radius = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y));
    root.style.setProperty("--vt-x", `${origin.x}px`);
    root.style.setProperty("--vt-y", `${origin.y}px`);
    root.style.setProperty("--vt-r", `${radius}px`);
    root.classList.add("theme-transition");
  } else {
    root.classList.add("theme-fade");
  }
  start
    .call(document, apply)
    .finished.finally(() => root.classList.remove("theme-transition", "theme-fade"));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The real theme is already on <html> via THEME_BOOT_SCRIPT. `theme` stays
  // `null` until the stored preference has been read, so the sync effect
  // below never overwrites the boot script's value with a default.
  const [theme, setThemeState] = useState<ThemeMode | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [daypart, setDaypart] = useState<Daypart>("day");

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  // Keep theme and daypart in step with the clock. Re-checks at the next
  // boundary, and whenever the tab becomes visible again (timers are
  // throttled in background tabs, and laptops sleep).
  useEffect(() => {
    if (theme === null) return;
    const root = document.documentElement;
    let timer = 0;

    const sync = (animate: boolean) => {
      const nextTheme = resolve(theme);
      const nextPart = daypartForTime();
      const update = () => {
        setResolvedTheme(nextTheme);
        setDaypart(nextPart);
      };
      // Everything visual keys off the <html> attributes, so only those need
      // to change inside the transition; React state follows normally.
      const apply = () => {
        root.setAttribute("data-theme", nextTheme);
        root.setAttribute("data-daypart", nextPart);
      };
      if (animate && root.getAttribute("data-theme") !== nextTheme) withTransition(apply);
      else apply();
      update();

      window.clearTimeout(timer);
      timer = window.setTimeout(() => sync(true), msUntilNextBoundary());
    };

    sync(false);
    const onVisible = () => {
      if (document.visibilityState === "visible") sync(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode, origin?: RevealOrigin) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Non-persistent session is acceptable
    }
    const nextResolved = resolve(next);
    const root = document.documentElement;
    const apply = () => root.setAttribute("data-theme", nextResolved);
    if (root.getAttribute("data-theme") === nextResolved) apply();
    else withTransition(apply, origin);
    setThemeState(next);
    setResolvedTheme(nextResolved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: theme ?? "auto", resolvedTheme, daypart, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
