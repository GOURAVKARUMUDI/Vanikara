"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ChevronDown, Eye, EyeOff, Lock, LogOut, ShieldCheck, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { BrandSymbol } from "@/components/brand/BrandMark";
import { announceAuthChange, finishPendingGoogleSignIn, googleSignIn, googleSignOut, useSession } from "@/components/auth/session";
import { isFirebaseConfigured } from "@/lib/firebaseClient";

const inputClass =
  "h-12 w-full rounded-compact border border-line-strong bg-surface-raised/80 pl-11 pr-4 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15";

/** Only same-site paths inside the admin area are accepted as a return target. */
function safeNext(value: string | null) {
  return value && value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/**
 * Sign in.
 *  - Everyone: "Continue with Google" creates or opens their VANIKARA
 *    account. The website is the same whether or not they are signed in.
 *  - Team: the fixed admin accounts sign in with username and password to
 *    reach the admin console. There is no admin registration.
 */
export default function LoginPage() {
  const router = useRouter();
  const session = useSession();
  const [showAdmin, setShowAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired")) setNotice("Your admin session ended. Please sign in again.");
    if (params.get("expired") || params.get("next") || params.get("admin")) setShowAdmin(true);

    // Finish a Google sign-in that used the redirect flow (pop-up blocked)
    finishPendingGoogleSignIn().then((err) => err && setErrorMsg(err));
  }, []);

  useEffect(() => {
    if (showAdmin) usernameRef.current?.focus();
  }, [showAdmin]);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    const err = await googleSignIn();
    setGoogleLoading(false);
    if (err) setErrorMsg(err);
  };

  const handleAdminSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) return;
    setAdminLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) {
        setErrorMsg(body?.error || "Sign-in failed. Please try again.");
        setPassword("");
        setAdminLoading(false);
        return;
      }
      announceAuthChange();
      router.replace(safeNext(new URLSearchParams(window.location.search).get("next")));
      router.refresh();
    } catch {
      setErrorMsg("Could not reach the server. Check your connection and try again.");
      setAdminLoading(false);
    }
  };

  const user = session.user;

  return (
    <section className="container-page flex min-h-[calc(100svh-var(--header-height))] items-center justify-center py-12 sm:py-16">
      <div className="rise-in w-full max-w-[420px]">
        <div className="text-center">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <div aria-hidden="true" className="stage-halo stage-halo--blur" />
            <div aria-hidden="true" className="stage-halo" />
            <BrandSymbol size={40} priority className="float-y relative" alt="VANIKARA" />
          </div>
          <h1 className="mt-5 text-[1.75rem] font-bold tracking-tight text-fg">
            {user ? "You're signed in" : "Sign in to VANIKARA"}
          </h1>
          <p className="mt-2 text-[0.9375rem] text-fg-muted">
            {user ? "Your account is active on this device." : "Use your Google account to create or open your account."}
          </p>
        </div>

        <div className="liquid-glass glass-strong mt-8 rounded-panel p-6 sm:p-8">
          {notice && !errorMsg && (
            <div role="status" className="mb-5 flex items-start gap-2.5 rounded-compact border border-intel/25 bg-intel/5 p-3 text-sm text-fg">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-intel" />
              <span>{notice}</span>
            </div>
          )}
          {errorMsg && (
            <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-compact border border-brand-red/25 bg-brand-red/5 p-3 text-sm text-fg">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red dark:text-ambition" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ---------- Everyone: Google ---------- */}
          {user ? (
            <div className="flex items-center gap-3 rounded-card border border-line bg-surface-sunken/50 p-3">
              {user.picture ? (
                <Image src={user.picture} alt="" width={40} height={40} className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" unoptimized />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-action text-sm font-bold uppercase text-white">{user.name[0]}</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
                <p className="truncate text-xs text-fg-muted">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => googleSignOut()}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
              >
                <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <Button
              onClick={handleGoogle}
              disabled={googleLoading || !isFirebaseConfigured}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              <GoogleMark />
              {googleLoading ? "Opening Google…" : "Continue with Google"}
            </Button>
          )}

          {!user && (
            <p className="mt-4 text-center text-xs leading-relaxed text-fg-subtle">
              Signing in doesn&apos;t change what you can see — the website is the same for everyone.
            </p>
          )}

          {user && (
            <Button href="/" size="lg" arrow className="mt-4 w-full">
              Continue to the website
            </Button>
          )}

          {/* ---------- Team: fixed admin accounts ---------- */}
          <div className="mt-6 border-t border-line pt-5">
            <button
              type="button"
              aria-expanded={showAdmin}
              aria-controls="admin-signin"
              onClick={() => setShowAdmin((v) => !v)}
              className="flex w-full items-center justify-between rounded-compact text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Team member? Admin sign in
              </span>
              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${showAdmin ? "rotate-180" : ""}`} />
            </button>

            {showAdmin && (
              <form id="admin-signin" onSubmit={handleAdminSubmit} className="rise-in mt-5 space-y-4" noValidate>
                <div>
                  <label htmlFor="login-username" className="mb-2 block text-sm font-semibold text-fg">
                    Username
                  </label>
                  <div className="relative">
                    <User aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
                    <input
                      ref={usernameRef}
                      id="login-username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-fg">
                    Password
                  </label>
                  <div className="relative">
                    <Lock aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
                    <input
                      id="login-password"
                      name="password"
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
                <Button type="submit" size="lg" disabled={adminLoading || !username.trim() || !password} className="w-full">
                  {adminLoading ? "Signing in…" : "Sign in to admin"}
                </Button>
                <p className="text-center text-xs text-fg-subtle">Admin accounts are issued by VANIKARA. There is no admin registration.</p>
              </form>
            )}
          </div>
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

        <Link
          href="/"
          className="group mx-auto mt-4 flex w-fit items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to the website
        </Link>
      </div>
    </section>
  );
}
