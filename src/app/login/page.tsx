"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Eye, EyeOff, KeyRound, Mail, MailCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuthRedirect } from "@/lib/authRedirect";
import { isAdmin } from "@/lib/isAdmin";
import Button from "@/components/ui/Button";
import { BrandSymbol } from "@/components/brand/BrandMark";

type AuthView = "options" | "email" | "password";

const inputClass =
  "h-12 w-full rounded-compact border border-line-strong bg-surface-raised px-4 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-colors focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15";

export default function LoginPage() {
  useAuthRedirect();
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<AuthView>("options");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const switchView = (next: AuthView) => {
    setView(next);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailLink = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setIsLoading(false);
    if (error) setErrorMsg(error.message);
    else setSuccessMsg("Check your inbox — we've sent you a sign-in link.");
  };

  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message || "Those credentials didn't work. Please try again.");
      setIsLoading(false);
      return;
    }
    // Destination only; access is enforced server-side on /admin
    router.push(isAdmin(data.user) ? "/admin" : "/dashboard");
  };

  return (
    <section className="container-page flex min-h-[calc(100svh-var(--header-height))] items-center justify-center py-16">
      <div className="rise-in w-full max-w-[420px]">
        <div className="text-center">
          <BrandSymbol size={44} priority className="mx-auto" alt="VANIKARA" />
          <h1 className="mt-6 text-[1.75rem] font-bold tracking-tight text-fg">Sign in to VANIKARA</h1>
          <p className="mt-2 text-[0.9375rem] text-fg-muted">For team members and registered accounts.</p>
        </div>

        <div className="glass-strong mt-8 rounded-panel p-6 sm:p-8">
          {errorMsg && (
            <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-compact border border-brand-red/25 bg-brand-red/5 p-3 text-sm text-fg">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red dark:text-ambition" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div role="status" className="mb-5 flex items-start gap-2.5 rounded-compact border border-intel/25 bg-intel/5 p-3 text-sm text-fg">
              <MailCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-intel" />
              <span>{successMsg}</span>
            </div>
          )}

          {view === "options" && (
            <div className="space-y-3">
              <Button onClick={handleGoogleLogin} disabled={isLoading} variant="secondary" size="lg" className="w-full">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
              <Button onClick={() => switchView("email")} variant="secondary" size="lg" className="w-full">
                <Mail aria-hidden="true" className="h-4 w-4" />
                Continue with email
              </Button>
              <Button onClick={() => switchView("password")} variant="ghost" size="lg" className="w-full text-fg-muted">
                <KeyRound aria-hidden="true" className="h-4 w-4" />
                Sign in with password
              </Button>
            </div>
          )}

          {view === "email" && (
            <form onSubmit={handleEmailLink} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-fg">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <Button type="submit" size="lg" disabled={isLoading || !email.trim()} className="w-full">
                {isLoading ? "Sending…" : "Send sign-in link"}
              </Button>
            </form>
          )}

          {view === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-fg">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-fg">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-fg-subtle transition-colors hover:text-fg"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" size="lg" disabled={isLoading || !email.trim() || !password.trim()} className="w-full">
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          )}

          {view !== "options" && (
            <button
              type="button"
              onClick={() => switchView("options")}
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Other sign-in options
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-[0.8125rem] text-fg-subtle">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="text-fg-muted underline-offset-2 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-fg-muted underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
