"use client";

import { useEffect } from "react";
import { useConsent } from "@/context/ConsentContext";
import { isFirebaseConfigured, startAnalytics } from "@/lib/firebaseClient";

/** Starts Firebase Analytics only after the visitor accepts analytics cookies. */
export default function FirebaseAnalytics() {
  const { consent } = useConsent();

  useEffect(() => {
    if (consent.analytics && isFirebaseConfigured) startAnalytics().catch(() => {});
  }, [consent.analytics]);

  return null;
}
