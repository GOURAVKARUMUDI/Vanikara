"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  LogOut, 
  Compass, 
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  Lock,
  RefreshCw,
  Check,
  Bell,
  Info,
  Key
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import { useTheme } from "@/components/layout/ThemeContext";
import DashboardScene from "@/components/dashboard/DashboardScene";

export default function DashboardClient({ initialUser, initialProfile, initialSub }: any) {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(initialUser);
  const [sub, setSub] = useState(initialSub);
  const [profile, setProfile] = useState(initialProfile || { name: "", email: "" });
  const [conversations, setConversations] = useState<any[]>([]);
  const [upgrading, setUpgrading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Theme states
  const { theme, resolvedTheme, atmosphere, setTheme } = useTheme();

  // Notifications Mock/DB
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: "System Initialized", message: "Welcome to the VANIKARA Digital Portal. Cygma AI sandbox node is now active.", type: "info", time: "Just now" },
    { id: 2, title: "Registry Timestamp Sync", message: "Successfully synced profile database records to primary pgvector cluster.", type: "success", time: "1 hour ago" },
    { id: 3, title: "Starter Plan Active", message: "Starter account trial initialized. You have 16 days of full access remaining.", type: "warning", time: "1 day ago" }
  ]);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "chats" && user) {
      // Fetch saved conversations
      supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }: any) => {
          setConversations(data || []);
        });
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const { error } = await supabase
        .from("users")
        .update({ name: profile.name })
        .eq("id", user.id);
      if (error) throw error;
      setProfileMsg("Profile updated successfully!");
    } catch (err: any) {
      setProfileMsg(`Failed to save: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setSavingPassword(true);
    setPasswordMsg("");
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg("Password changed successfully!");
      setNewPassword("");
    } catch (err: any) {
      setPasswordMsg(`Failed to update: ${err.message}`);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const res = await fetch("/api/payment/dummy", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSub(json.data);
        alert("Payment successful! You are now a PRO member (Demo).");
      }
    } catch (err) {
      console.error("Upgrade failed:", err);
    } finally {
      setUpgrading(false);
    }
  };

  const trialDays = (() => {
    if (!sub?.trial_end) return 0;
    const diff = new Date(sub.trial_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const isExpired = sub?.plan === "free" && trialDays <= 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "profile", label: "Profile Details", icon: User },
    { id: "chats", label: "Saved AI Chats", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account Info", icon: Info },
    { id: "security", label: "Security & Lock", icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-transparent pt-12">
      <DashboardScene />
      <main className="pt-16 pb-20 px-6 max-w-7xl mx-auto space-y-10">
        
        {/* Header Summary */}
        <div className="relative border-b border-[var(--glass-border)] pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                sub?.plan === "pro" 
                  ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/20" 
                  : "bg-blue-600/10 text-blue-400 border-blue-600/20"
              }`}>
                {sub?.plan?.toUpperCase() || "FREE"} BACKPLANE PLAN
              </span>
              {sub?.plan === "free" && (
                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                  isExpired ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                }`}>
                  {isExpired ? "TRIAL EXPIRED" : `${trialDays} DAYS LEFT`}
                </span>
              )}
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-[var(--text-primary)]">
              Welcome back, <span className="gradient-text">{profile.name || user.email?.split("@")[0]}</span>
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 font-bold uppercase tracking-wide">
              Access your personalized workspace and secure logs.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/15 text-red-400 rounded-xl border border-red-500/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start md:self-auto flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Navigation */}
          <div className="lg:col-span-3">
            <Card hover className="overflow-hidden sticky top-28">
              <CardBody className="p-4 space-y-1.5 flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-[var(--accent-color)] text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-500/5"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-9">
            
            {/* 1. Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Card hover>
                    <CardBody className="p-6 space-y-3">
                      <div className="p-2.5 bg-green-500/10 text-green-500 w-fit rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
                      <span className="text-[9px] font-black uppercase text-[var(--text-secondary)] tracking-widest block">Tenant Status</span>
                      <h4 className="font-display font-black text-base text-[var(--text-primary)]">Verified Account</h4>
                    </CardBody>
                  </Card>
                  <Card hover>
                    <CardBody className="p-6 space-y-3">
                      <div className="p-2.5 bg-blue-500/10 text-blue-500 w-fit rounded-xl"><Layers className="w-5 h-5" /></div>
                      <span className="text-[9px] font-black uppercase text-[var(--text-secondary)] tracking-widest block">Active Plan</span>
                      <h4 className="font-display font-black text-base text-[var(--text-primary)]">
                        {sub?.plan === "pro" ? "Premium (Pro)" : "Starter (Free)"}
                      </h4>
                    </CardBody>
                  </Card>
                  <Card hover>
                    <CardBody className="p-6 space-y-3">
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-500 w-fit rounded-xl"><Zap className="w-5 h-5" /></div>
                      <span className="text-[9px] font-black uppercase text-[var(--text-secondary)] tracking-widest block">Sandbox Limit</span>
                      <h4 className="font-display font-black text-base text-[var(--text-primary)]">
                        {sub?.plan === "pro" ? "Unlimited access" : "50 calls / day"}
                      </h4>
                    </CardBody>
                  </Card>
                </div>

                {/* Sub upgrade alert */}
                {sub?.plan === "free" && (
                  <div className="p-8 border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)]/5 blur-[80px] rounded-full pointer-events-none -mr-32 -mt-32" />
                    <div className="space-y-2 relative z-10">
                      <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">Upgrade to Pro Backplane</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
                        Preserve full file uploading capacities, request vector index caching, and access premium gpt-4o models.
                      </p>
                    </div>
                    <button
                      onClick={handleUpgrade}
                      disabled={upgrading}
                      className="px-6 py-3 bg-[var(--accent-color)] hover:bg-opacity-95 text-white rounded-full text-xs font-black uppercase tracking-wider cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 shadow-md relative z-10"
                    >
                      {upgrading ? "Upgrading..." : "Upgrade (Demo)"}
                    </button>
                  </div>
                )}

                {/* Tools shortcuts */}
                <div className="space-y-4">
                  <h3 className="font-display font-black text-xs text-[var(--text-primary)] uppercase tracking-widest">Workspace Shortcuts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => router.push("/ai")}
                      className="p-5 text-left rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <h4 className="font-display font-bold text-xs text-[var(--text-primary)] uppercase group-hover:text-[var(--accent-color)] transition-colors">Launch CYGMA AI Node</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Explore files grounded conversation systems.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--accent-color)] group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      onClick={() => router.push("/upload")}
                      className="p-5 text-left rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <h4 className="font-display font-bold text-xs text-[var(--text-primary)] uppercase group-hover:text-[var(--accent-color)] transition-colors">Upload to Vault</h4>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Securely index custom requirements and files.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--accent-color)] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Edit Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-300 max-w-xl">
                <div className="border-b border-[var(--glass-border)] pb-3">
                  <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">Developer Profile Parameters</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">Configure your portal display identifier details.</p>
                </div>

                {profileMsg && (
                  <div className="p-4 bg-slate-500/5 border border-[var(--glass-border)] text-[var(--accent-color)] text-xs font-bold rounded-xl text-center">
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Email Address (Read-only)</label>
                    <input
                      type="text"
                      disabled
                      value={user.email || ""}
                      className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] opacity-60 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Display Name</label>
                    <input
                      type="text"
                      value={profile.name || ""}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:border-[var(--accent-color)] transition-all font-semibold"
                    />
                  </div>

                  <Button type="submit" disabled={savingProfile} className="font-bold text-xs uppercase tracking-wide gap-1.5">
                    {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    {savingProfile ? "Saving..." : "Save Profile Details"}
                  </Button>
                </form>
              </div>
            )}

            {/* 3. Saved Chats Tab */}
            {activeTab === "chats" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[var(--glass-border)] pb-3">
                  <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">Saved AI Conversations</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">Access previous CYGMA chat histories grounding records.</p>
                </div>

                {conversations.length === 0 ? (
                  <div className="p-12 text-center text-xs text-[var(--text-secondary)] bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl backdrop-blur-md">
                    No saved chats found. Open the AI workspace and submit queries to save histories.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => router.push(`/ai?conv=${conv.id}`)}
                        className="p-5 text-left rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all flex flex-col justify-between h-28 group cursor-pointer"
                      >
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-xs text-[var(--text-primary)] uppercase group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">
                            {conv.title}
                          </h4>
                          <p className="text-[9px] text-[var(--text-secondary)] uppercase font-semibold">
                            Model: {conv.selected_model || "gpt-4o"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center w-full text-[9px] font-bold text-slate-400 mt-2">
                          <span>{new Date(conv.created_at).toLocaleDateString()}</span>
                          <span className="group-hover:text-[var(--accent-color)] transition-colors flex items-center gap-0.5">Resume Node <ArrowRight className="w-3 h-3" /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in duration-300 max-w-xl">
                <div className="border-b border-[var(--glass-border)] pb-3">
                  <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">Dashboard Settings</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">Customize your workspace appearance and interface theme.</p>
                </div>

                <Card>
                  <CardBody className="p-6 space-y-4">
                    <h4 className="font-display font-bold text-xs text-[var(--text-primary)] uppercase">Select Theme Atmosphere</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold">
                      Current resolution: <strong className="text-[var(--text-primary)] uppercase">{resolvedTheme} ({atmosphere})</strong>
                    </p>
                    <div className="flex gap-2 p-1.5 bg-slate-500/5 rounded-2xl border border-[var(--glass-border)] w-fit">
                      {(["light", "dark", "auto"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setTheme(m)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            theme === m
                              ? "bg-[var(--accent-color)] text-white shadow"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* 5. Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[var(--glass-border)] pb-3">
                  <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">System Notifications</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">View real-time workspace alerts and event logs.</p>
                </div>

                <div className="space-y-3">
                  {notifications.map((n) => (
                    <Card key={n.id}>
                      <CardBody className="p-5 flex items-start gap-4">
                        <div className={`p-2 rounded-xl text-white mt-0.5 shrink-0 ${
                          n.type === "success" ? "bg-green-500/20 text-green-500 border border-green-500/10" :
                          n.type === "warning" ? "bg-orange-500/20 text-orange-500 border border-orange-500/10" :
                          "bg-blue-500/20 text-blue-500 border border-blue-500/10"
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-bold text-xs text-[var(--text-primary)] uppercase">{n.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">{n.message}</p>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Account Info Tab */}
            {activeTab === "account" && (
              <div className="space-y-6 animate-in fade-in duration-300 max-w-xl">
                <div className="border-b border-[var(--glass-border)] pb-3">
                  <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">Account Metadata Information</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">Auditing profile credentials and role logs.</p>
                </div>

                <Card>
                  <CardBody className="p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[var(--glass-border)] pb-2 mb-2 select-none">
                      <Key className="w-4.5 h-4.5 text-[var(--accent-color)]" />
                      <span className="font-display font-bold text-xs text-[var(--text-primary)] uppercase">Node Credentials</span>
                    </div>

                    <div className="space-y-3.5 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">User Identifier (UID)</span>
                        <span className="font-mono text-[var(--text-primary)] text-[10px]">{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Email Registry</span>
                        <span className="text-[var(--text-primary)] font-bold">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Assigned Authorization Role</span>
                        <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/10 rounded-full text-[8px] font-black uppercase tracking-wider">User</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Creation Timestamp</span>
                        <span className="text-[var(--text-primary)] font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Last Login Session</span>
                        <span className="text-[var(--text-primary)] font-bold">{new Date(user.last_sign_in_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* 7. Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300 max-w-xl">
                <div className="border-b border-[var(--glass-border)] pb-3">
                  <h3 className="font-display font-black text-lg text-[var(--text-primary)] uppercase">Security & Portal Access</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">Reset password controls and update session encryption parameters.</p>
                </div>

                {passwordMsg && (
                  <div className="p-4 bg-slate-500/5 border border-[var(--glass-border)] text-[var(--accent-color)] text-xs font-bold rounded-xl text-center">
                    {passwordMsg}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:border-[var(--accent-color)] transition-all font-semibold"
                    />
                  </div>

                  <Button type="submit" disabled={savingPassword || !newPassword} className="font-bold text-xs uppercase tracking-wide gap-1.5">
                    {savingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    {savingPassword ? "Updating..." : "Change Portal Password"}
                  </Button>
                </form>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
