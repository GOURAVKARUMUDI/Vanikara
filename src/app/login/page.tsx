"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuthRedirect } from "@/lib/authRedirect";
import { isAdmin } from "@/lib/isAdmin";
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle, Compass, LogIn, ArrowLeft, ArrowRight, ShieldCheck, MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import AuthSidebar from "@/components/auth/AuthSidebar";

import LoginScene from "@/components/auth/LoginScene";
import { useCygmaWorld } from "@/context/CygmaWorldContext";
import { PageContainer } from "@/components/ui/Containers";

type AuthView = "options" | "email" | "admin";

export default function LoginPage() {
  useAuthRedirect();
  const router = useRouter();
  const supabase = createClient();

  const [formView, setFormView] = useState<AuthView>("options");
  const { isSuccess, setIsSuccess, setView } = useCygmaWorld();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 3D Card Tilt State & Handlers
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Limit rotation to max 4 degrees
    const rotateX = -(y / (rect.height / 2)) * 4;
    const rotateY = (x / (rect.width / 2)) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Trigger Google Sign-in flow
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };


  // Passwordless Email OTP / Magic Link flow
  const handleEmailMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      setSuccessMsg("Magic Link dispatched! Check your inbox.");
      setIsLoading(false);
    }
  };

  // Administrator credentials validation
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "Invalid administrative credentials.");
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setView("success");
      setTimeout(() => {
        if (isAdmin(email)) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }, 1800);
    }
  };

  // Bypass authentication directly for public Guest preview mode
  const handleGuestPreview = () => {
    setIsSuccess(true);
    setView("success");
    setTimeout(() => {
      router.push("/ai");
    }, 1800);
  };

  return (
    <PageContainer className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4 py-8">
      
      {/* Coordinates 3D Canvas Login states */}
      <LoginScene />

      {/* Atmospheric layout overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none z-10" />

      {/* Main glass frame box */}
      <div className="relative max-w-5xl w-full flex items-center justify-center gap-8 z-20">
        
        {/* Floating Authentication Card */}
        <AnimatePresence mode="wait">
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, y: -15, filter: "blur(12px)" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md shrink-0"
            >
              {/* Breathing / Floating Wrapper */}
              <motion.div
                animate={{ y: [4, -8, 4] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="w-full"
              >
                {/* 3D Tilt Card Wrapper */}
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: "preserve-3d" as const,
                    transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  className="w-full p-10 bg-white/10 dark:bg-slate-950/45 border border-white/20 dark:border-white/5 rounded-[2.2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_24px_64px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-[40px] relative overflow-hidden"
                  role="main"
                  aria-label="Cygma Authentication Workspace"
                >
              {/* Top Specular Line Reflection */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/5 blur-[60px] rounded-full pointer-events-none -mr-16 -mt-16" />

              {/* Logo Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-11 h-11 rounded-xl bg-white/10 shadow-sm border border-white/10 flex items-center justify-center mb-3">
                  <Image src="/logo.png" alt="Vanikara Logo" className="w-7 h-auto" width={28} height={28} priority />
                </div>
                <span className="font-display font-black text-xxs tracking-widest text-[var(--accent-color)] uppercase">
                  VANIKARA INTELLIGENCE
                </span>
              </div>

              {/* Interactive forms views */}
              {formView === "options" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight mb-1 font-display uppercase">
                      Welcome to Cygma
                    </h1>
                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold">
                      Enter the intelligence layer.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-[10px] text-red-400 font-bold leading-normal animate-pulse">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Method 1: Google OAuth */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full py-3 px-5 rounded-full border border-[var(--glass-border)] hover:border-[var(--accent-color)] bg-[var(--glass-bg)] text-[var(--text-primary)] hover:bg-white/10 backdrop-blur-md shadow-sm font-semibold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all select-none duration-300 hover:scale-[1.01] active:scale-98"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    {/* Method 2: Microsoft — Employee accounts only */}
                    <div className="w-full py-3 px-5 rounded-full border border-dashed border-[var(--glass-border)] bg-[var(--glass-bg)]/10 text-[var(--text-secondary)] font-semibold text-xs tracking-wider flex items-center justify-center gap-2.5 select-none opacity-60 cursor-default" title="Restricted to VANIKARA employee accounts">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                        <path fill="#f3f2f1" d="M0 0h23v23H0z" />
                        <path fill="#f25022" d="M1 1h10v10H1z" />
                        <path fill="#7fba00" d="M12 1h10v10H12z" />
                        <path fill="#00a4ef" d="M1 12h10v10H1z" />
                        <path fill="#ffb900" d="M12 12h10v10H12z" />
                      </svg>
                      Microsoft — Employee Accounts Only
                    </div>

                    {/* Method 3: Passwordless Email OTP */}
                    <button
                      onClick={() => setFormView("email")}
                      disabled={isLoading}
                      className="w-full py-3 px-5 rounded-full border border-[var(--glass-border)] hover:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)] hover:bg-slate-500/5 font-semibold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all select-none duration-300 active:scale-98"
                    >
                      <Mail className="w-4 h-4 text-[var(--accent-color)]" />
                      Continue with Email
                    </button>
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-[var(--glass-border)]" />
                    <span className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">OR</span>
                    <div className="flex-1 h-px bg-[var(--glass-border)]" />
                  </div>

                  <div className="flex gap-3">
                    {/* Method 4: Administrator access credentials */}
                    <button
                      onClick={() => setFormView("admin")}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--glass-border)] hover:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)] hover:bg-slate-500/5 font-bold text-[9px] tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Admin Login
                    </button>

                    {/* Method 5: Guest Preview bypass */}
                    <button
                      onClick={handleGuestPreview}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--glass-border)] hover:border-[var(--accent-color)] bg-transparent text-[var(--text-primary)] hover:bg-slate-500/5 font-bold text-[9px] tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <Compass className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      Guest Preview
                    </button>
                  </div>
                </div>
              )}

              {/* Passwordless Email View */}
              {formView === "email" && (
                <div className="space-y-6">
                  <div>
                    <button
                      onClick={() => {
                        setFormView("options");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[9px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1 mb-4 select-none cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to options
                    </button>
                    <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight font-display uppercase">
                      Email Link Access
                    </h1>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-0.5">
                      We will dispatch a secure validation link.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-[10px] text-red-400 font-bold leading-normal">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-[10px] text-emerald-400 font-bold leading-normal">
                      <MailCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleEmailMagicLink} className="space-y-4">
                    <div className="relative">
                      <label htmlFor="email" className="sr-only">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full pl-10 pr-4 py-3 bg-slate-500/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/5 rounded-2xl text-[var(--text-primary)] text-xs placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-color)] focus:bg-slate-500/10 dark:focus:bg-white/10 focus:shadow-[0_0_20px_rgba(30,107,214,0.15)] transition-all duration-300 font-medium"
                      />
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email.trim()}
                      className="w-full py-3.5 uppercase tracking-widest text-[9px] font-bold"
                    >
                      {isLoading ? "Dispatching..." : "Send Magic Link"}
                      {!isLoading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                    </Button>
                  </form>
                </div>
              )}

              {/* Administrator Password Access View */}
              {formView === "admin" && (
                <div className="space-y-6">
                  <div>
                    <button
                      onClick={() => {
                        setFormView("options");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[9px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1 mb-4 select-none cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to options
                    </button>
                    <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight font-display uppercase">
                      Admin Credentials
                    </h1>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-0.5">
                      Authentication access for developer nodes.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-[10px] text-red-400 font-bold leading-normal">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    {/* Email Input */}
                    <div className="relative">
                      <label htmlFor="email" className="sr-only">Admin Email</label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Admin Email"
                        className="w-full pl-10 pr-4 py-3 bg-slate-500/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/5 rounded-2xl text-[var(--text-primary)] text-xs placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-color)] focus:bg-slate-500/10 dark:focus:bg-white/10 focus:shadow-[0_0_20px_rgba(30,107,214,0.15)] transition-all duration-300 font-medium"
                      />
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <label htmlFor="password" className="sr-only">Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password Node Credentials"
                        className="w-full pl-10 pr-10 py-3 bg-slate-500/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/5 rounded-2xl text-[var(--text-primary)] text-xs placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-color)] focus:bg-slate-500/10 dark:focus:bg-white/10 focus:shadow-[0_0_20px_rgba(30,107,214,0.15)] transition-all duration-300 font-medium"
                      />
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-secondary)]" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email.trim() || !password.trim()}
                      className="w-full py-3.5 uppercase tracking-widest text-[9px] font-bold"
                    >
                      {isLoading ? "Authenticating..." : "Validate Node"}
                      {!isLoading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                    </Button>
                  </form>
                </div>
              )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cinematic Success Screen */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-4 max-w-sm absolute z-30 pointer-events-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)]/10 border border-[var(--glass-border)] flex items-center justify-center mx-auto text-xl text-[var(--accent-color)] animate-pulse">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-widest font-display uppercase animate-pulse">
                CYGMA AUTHENTICATED
              </h2>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                Entering ecosystem grid...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Announcement Panel */}
        <AnimatePresence>
          {!isSuccess && <AuthSidebar />}
        </AnimatePresence>

      </div>
    </PageContainer>
  );
}
