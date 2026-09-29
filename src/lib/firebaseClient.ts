"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

/**
 * Firebase web app, created once and only in the browser. The web config
 * is public by design (Firebase identifies the project with it); access is
 * controlled by Firebase's authorised domains and by the server-side token
 * verification in /api/auth/google.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export function firebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(config);
}

/** Google sign-in with a pop-up, falling back to a full-page redirect where pop-ups are blocked. */
export async function signInWithGoogle(): Promise<string | null> {
  const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, browserLocalPersistence, setPersistence } =
    await import("firebase/auth");
  const auth = getAuth(firebaseApp());
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user.getIdToken();
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return null; // the page navigates away; completeRedirectSignIn() finishes on return
    }
    throw error;
  }
}

/** Finishes a redirect-based sign-in after Google sends the visitor back. */
export async function completeRedirectSignIn(): Promise<string | null> {
  const { getAuth, getRedirectResult } = await import("firebase/auth");
  const result = await getRedirectResult(getAuth(firebaseApp())).catch(() => null);
  return result ? result.user.getIdToken() : null;
}

export async function signOutOfFirebase() {
  const { getAuth, signOut } = await import("firebase/auth");
  await signOut(getAuth(firebaseApp())).catch(() => {});
}

/** Google Analytics for Firebase — only ever started after analytics consent. */
export async function startAnalytics() {
  if (!config.measurementId) return;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) getAnalytics(firebaseApp());
}
