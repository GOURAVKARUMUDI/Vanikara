"use client";

import { useCallback, useEffect, useState } from "react";
import { completeRedirectSignIn, signInWithGoogle, signOutOfFirebase } from "@/lib/firebaseClient";

export interface SessionState {
  loaded: boolean;
  /** Signed in with a fixed admin account. */
  isAdmin: boolean;
  adminUsername: string | null;
  /** Signed in with Google. */
  user: { name: string; email: string; picture: string | null } | null;
}

const AUTH_EVENT = "vk-auth-change";

export function announceAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/** Current session, re-read whenever sign-in or sign-out happens anywhere on the page. */
export function useSession(refreshKey?: unknown): SessionState {
  const [state, setState] = useState<SessionState>({ loaded: false, isAdmin: false, adminUsername: null, user: null });

  const load = useCallback(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        setState({
          loaded: true,
          isAdmin: Boolean(data?.authenticated),
          adminUsername: data?.username ?? null,
          user: data?.user ?? null,
        })
      )
      .catch(() => setState((s) => ({ ...s, loaded: true })));
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(AUTH_EVENT, load);
    return () => window.removeEventListener(AUTH_EVENT, load);
  }, [load, refreshKey]);

  return state;
}

async function exchange(idToken: string) {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    await signOutOfFirebase();
    throw new Error(body?.error || "Sign-in failed. Please try again.");
  }
  announceAuthChange();
}

const FRIENDLY_ERRORS: Record<string, string> = {
  "auth/popup-closed-by-user": "",
  "auth/cancelled-popup-request": "",
  "auth/unauthorized-domain": "Google sign-in isn't enabled for this domain yet.",
  "auth/operation-not-allowed": "Google sign-in isn't enabled for this site yet.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

/** Runs the Google sign-in. Resolves to an error message ("" = user cancelled), or null on success. */
export async function googleSignIn(): Promise<string | null> {
  try {
    const idToken = await signInWithGoogle();
    if (!idToken) return null; // redirect flow: the page is navigating to Google
    await exchange(idToken);
    return null;
  } catch (error) {
    const code = (error as { code?: string }).code ?? "";
    // Exact Firebase code for whoever is debugging setup (e.g. auth/unauthorized-domain)
    if (code) console.warn(`[VANIKARA] Google sign-in failed: ${code}`);
    if (code in FRIENDLY_ERRORS) return FRIENDLY_ERRORS[code];
    return error instanceof Error && !code ? error.message : "Google sign-in failed. Please try again.";
  }
}

/** Completes a redirect sign-in, if one is pending. Returns an error message or null. */
export async function finishPendingGoogleSignIn(): Promise<string | null> {
  const idToken = await completeRedirectSignIn();
  if (!idToken) return null;
  try {
    await exchange(idToken);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Google sign-in failed.";
  }
}

export async function googleSignOut() {
  await Promise.allSettled([fetch("/api/auth/user-logout", { method: "POST" }), signOutOfFirebase()]);
  announceAuthChange();
}
