"use client";

import AccountShell from "@/components/account/AccountShell";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";
import { useTheme, type ThemeMode } from "@/components/layout/ThemeContext";
import Button from "@/components/ui/Button";
import { googleSignOut } from "@/components/auth/session";

export default function AccountSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AccountShell
      title="Account Settings"
      subtitle="Manage display preferences, cookie consent, and your active session."
    >
      <div className="space-y-6">
        <div className="surface p-6">
          <h2 className="text-base font-semibold text-fg">Appearance</h2>
          <p className="mt-1 text-sm text-fg-muted">Choose how Vanikara appears on this browser.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["light", "dark", "auto"] as ThemeMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                className={`rounded-compact border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  theme === mode
                    ? "border-intel bg-intel/10 text-intel"
                    : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {mode === "auto" ? "System" : mode}
              </button>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="text-base font-semibold text-fg">Cookie Preferences</h2>
          <p className="mt-1 text-sm text-fg-muted">Update your optional analytics and preference cookie consent.</p>
          <div className="mt-4">
            <CookieSettingsButton className="btn btn-outline btn-sm" />
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="text-base font-semibold text-fg">Session</h2>
          <p className="mt-1 text-sm text-fg-muted">Sign out of your Vanikara Account on this device.</p>
          <div className="mt-4">
            <Button variant="destructive" size="sm" onClick={() => googleSignOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
