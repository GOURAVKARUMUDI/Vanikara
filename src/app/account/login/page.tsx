"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ShieldCheck } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import Button from "@/components/ui/Button";
import { signInWithGoogle } from "@/lib/firebaseClient";
import { announceAuthChange } from "@/components/auth/session";

function AccountLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const safeNext = nextPath && nextPath.startsWith("/account") ? nextPath : "/account";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const idToken = await signInWithGoogle();
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error || "Could not verify your Google sign-in. Please try again.");
        setLoading(false);
        return;
      }
      announceAuthChange();
      router.replace(safeNext);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-in was cancelled or failed.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-14rem)] items-center justify-center py-16">
      <div className="surface w-full max-w-md p-8">
        <BrandMark size={24} />
        <h1 className="text-title mt-6 text-fg">Sign in to your Vanikara Account</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Track your career applications, view submitted enquiries, and manage your privacy preferences securely.
        </p>

        {error && (
          <div role="alert" className="mt-5 flex items-center gap-2 rounded-compact border border-status-error/30 bg-status-error/10 px-3.5 py-2.5 text-sm text-status-error">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6">
          <Button type="button" size="lg" className="w-full" loading={loading} onClick={handleGoogleLogin}>
            Continue with Google
          </Button>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-compact bg-surface-secondary p-3.5 text-xs text-fg-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
          <p>
            Public accounts are strictly isolated from internal administrative systems and only display records matching your verified email address.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-fg-subtle">
          By signing in, you agree to our{" "}
          <Link href="/legal/terms" className="text-intel underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-intel underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-sm text-fg-muted">Loading...</div>}>
      <AccountLoginContent />
    </Suspense>
  );
}
