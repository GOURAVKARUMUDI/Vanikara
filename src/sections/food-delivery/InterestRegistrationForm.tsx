"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

const CATEGORIES = [
  { id: "restaurant", label: "Restaurant", hint: "Share your restaurant name, cuisine, and area in Guntur." },
  { id: "delivery_partner", label: "Delivery Partner", hint: "Share your city, vehicle type, and preferred availability." },
  { id: "customer", label: "Customer", hint: "Tell us what you look for in a local food delivery service." },
  { id: "business_partner", label: "Business Partner", hint: "Describe your organization and partnership interest." },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const EMPTY = { name: "", email: "", phone: "", organization: "", city: "Guntur", notes: "", bot: "" };

export default function InterestRegistrationForm() {
  const [category, setCategory] = useState<CategoryId>("restaurant");
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];

  const update = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.bot) return;

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please provide your name and email address.");
      return;
    }
    if (!consent) {
      setError("Please confirm your consent to our Privacy Policy.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "food-delivery",
          category,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          organization: form.organization.trim() || undefined,
          city: form.city.trim() || "Guntur",
          notes: form.notes.trim() || undefined,
          consent: true,
          bot: form.bot,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error?.message || json?.error || "Could not submit your registration. Please try again.");
        setStatus("idle");
        return;
      }
      setReference(json.data?.reference ?? null);
      setStatus("success");
      setForm(EMPTY);
      setConsent(false);
    } catch {
      setError("Network error while submitting. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="surface p-8" role="status" aria-live="polite">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-status-success" />
          <div>
            <h3 className="text-lg font-semibold text-fg">Interest registration recorded</h3>
            <p className="mt-2 text-sm text-fg-muted">
              Thank you for registering early interest in the Vanikara Food Delivery Platform. Our team will reach out ahead of onboarding in Guntur.
            </p>
            {reference && (
              <p className="mt-3 font-mono text-xs text-fg">
                Reference ID: <span className="font-semibold text-intel">{reference}</span>
              </p>
            )}
            <div className="mt-6">
              <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                Submit another registration
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface p-6 sm:p-8" aria-labelledby="register-interest-heading" noValidate>
      <fieldset>
        <legend className="font-mono text-xs font-medium uppercase tracking-wider text-fg-subtle">
          Registration Category
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center justify-center rounded-compact border px-3 py-2.5 text-center text-sm font-medium transition-colors ${
                  active
                    ? "border-intel bg-intel/10 text-intel"
                    : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={item.id}
                  checked={active}
                  onChange={() => setCategory(item.id)}
                  className="sr-only"
                />
                {item.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-name" className="block text-sm font-medium text-fg">
            Full name <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="reg-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className="v2-input mt-1.5"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-fg">
            Email address <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            value={form.email}
            onChange={update("email")}
            className="v2-input mt-1.5"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="reg-phone" className="block text-sm font-medium text-fg">
            Phone number
          </label>
          <input
            id="reg-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            className="v2-input mt-1.5"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label htmlFor="reg-org" className="block text-sm font-medium text-fg">
            {category === "restaurant" ? "Restaurant name" : "Organization (optional)"}
          </label>
          <input
            id="reg-org"
            name="organization"
            type="text"
            autoComplete="organization"
            value={form.organization}
            onChange={update("organization")}
            className="v2-input mt-1.5"
            placeholder={category === "restaurant" ? "e.g., Spice Kitchen, Koritepadu" : "Company or organization"}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="reg-notes" className="block text-sm font-medium text-fg">
          Additional details
        </label>
        <p id="reg-notes-hint" className="mt-0.5 text-xs text-fg-subtle">
          {activeCategory.hint}
        </p>
        <textarea
          id="reg-notes"
          name="notes"
          rows={3}
          aria-describedby="reg-notes-hint"
          value={form.notes}
          onChange={update("notes")}
          className="v2-input mt-1.5 min-h-[96px]"
          placeholder="Optional notes..."
        />
      </div>

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="reg-bot">Leave empty</label>
        <input id="reg-bot" name="bot" tabIndex={-1} value={form.bot} onChange={update("bot")} />
      </div>

      <div className="mt-5 flex items-start gap-2.5">
        <input
          id="reg-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--action-bg)]"
          required
        />
        <label htmlFor="reg-consent" className="text-xs leading-relaxed text-fg-muted">
          I agree to Vanikara storing my contact details to notify me regarding early participation and onboarding in accordance with the{" "}
          <Link href="/legal/privacy" className="text-intel underline">
            Privacy Policy
          </Link>
          . This is an early interest registration only; no commercial commitment or live ordering is implied.
        </label>
      </div>

      {error && (
        <div role="alert" className="mt-4 flex items-center gap-2 rounded-compact border border-status-error/30 bg-status-error/10 px-3.5 py-2.5 text-sm text-status-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" loading={status === "submitting"}>
          Register Interest
        </Button>
      </div>
    </form>
  );
}
