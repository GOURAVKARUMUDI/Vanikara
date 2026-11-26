"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import type { SiteContent } from "@/content/defaults";

const CATEGORIES = [
  { id: "General Enquiry", placeholder: "How can our team help you?" },
  { id: "Business Partnership", placeholder: "Share details about your organization and proposed collaboration." },
  { id: "Restaurant Registration", placeholder: "Share your restaurant name, location in Guntur, and expectations." },
  { id: "Delivery Partner Registration", placeholder: "Share your city, vehicle type, and availability." },
  { id: "Product Enquiry", placeholder: "Questions about our Food Delivery Platform or CYGMA initiative." },
  { id: "Careers Enquiry", placeholder: "Questions regarding open roles, internships, or recruitment." },
  { id: "Technical Support", placeholder: "Describe the technical issue or assistance required." },
  { id: "Privacy Request", placeholder: "Data access, correction, deletion, or consent withdrawal enquiry." },
  { id: "Other", placeholder: "Tell us what you would like to discuss." },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

const TOPIC_MAP: Record<string, Category> = {
  general: "General Enquiry",
  partnership: "Business Partnership",
  restaurant: "Restaurant Registration",
  partner: "Delivery Partner Registration",
  product: "Product Enquiry",
  careers: "Careers Enquiry",
  support: "Technical Support",
  privacy: "Privacy Request",
};

const EMPTY = { name: "", email: "", phone: "", organization: "", subject: "", message: "", bot: "" };

export default function ContactForm({
  identity: COMPANY_IDENTITY,
  initialCategory,
}: Pick<SiteContent, "identity"> & { initialCategory?: string }) {
  const mappedInitial = initialCategory
    ? TOPIC_MAP[initialCategory.toLowerCase()] ??
      CATEGORIES.find((c) => c.id.toLowerCase() === initialCategory.toLowerCase())?.id ??
      "General Enquiry"
    : "General Enquiry";

  const [category, setCategory] = useState<Category>(mappedInitial);
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const active = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];

  const update = (key: keyof typeof EMPTY) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrorMessage(null);
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.bot) return;

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setErrorMessage("Please complete your name, email, subject, and message.");
      return;
    }
    if (!consent) {
      setErrorMessage("Please confirm that you have read our Privacy Policy.");
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          organization: form.organization.trim() || undefined,
          subject: `[${category}] ${form.subject.trim()}`,
          message: form.message.trim(),
          bot: form.bot,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setErrorMessage(json?.error?.message || json?.error || "We could not send your message. Please try again.");
        setStatus("idle");
        return;
      }
      setReference(json.data?.reference ?? null);
      setStatus("success");
      setForm(EMPTY);
      setConsent(false);
    } catch {
      setErrorMessage(`Network error. You can also write directly to ${COMPANY_IDENTITY.officialEmail}.`);
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="surface p-8" role="status" aria-live="polite">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-status-success" />
          <div>
            <h2 className="text-xl font-semibold text-fg">Enquiry received</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Thank you for contacting {COMPANY_IDENTITY.brandName}. Your enquiry has been recorded and routed to the appropriate team.
            </p>
            {reference && (
              <p className="mt-3 font-mono text-xs text-fg">
                Reference Number: <span className="font-semibold text-intel">{reference}</span>
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                Send another enquiry
              </Button>
              <Button href="/account/enquiries" variant="ghost" size="sm">
                Track enquiries in Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface p-6 sm:p-8" noValidate>
      <div className="space-y-5">
        <div>
          <label htmlFor="contact-category" className="block text-sm font-medium text-fg">
            Enquiry category
          </label>
          <select
            id="contact-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="v2-input mt-1.5"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-fg">
              Full name <span aria-hidden="true" className="text-status-error">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={update("name")}
              className="v2-input mt-1.5"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-fg">
              Email address <span aria-hidden="true" className="text-status-error">*</span>
            </label>
            <input
              id="contact-email"
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
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-fg">
              Phone (optional)
            </label>
            <input
              id="contact-phone"
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
            <label htmlFor="contact-org" className="block text-sm font-medium text-fg">
              Organization (optional)
            </label>
            <input
              id="contact-org"
              name="organization"
              type="text"
              autoComplete="organization"
              value={form.organization}
              onChange={update("organization")}
              className="v2-input mt-1.5"
              placeholder="Company or restaurant name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-fg">
            Subject <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            value={form.subject}
            onChange={update("subject")}
            className="v2-input mt-1.5"
            placeholder="Brief summary of your enquiry"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-fg">
            Message <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={update("message")}
            className="v2-input mt-1.5 min-h-[130px]"
            placeholder={active.placeholder}
          />
        </div>

        {/* Honeypot */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-bot">Leave blank</label>
          <input id="contact-bot" name="bot" tabIndex={-1} value={form.bot} onChange={update("bot")} />
        </div>

        <div className="flex items-start gap-2.5">
          <input
            id="contact-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--action-bg)]"
            required
          />
          <label htmlFor="contact-consent" className="text-xs leading-relaxed text-fg-muted">
            I acknowledge that Vanikara will process this enquiry in accordance with the{" "}
            <Link href="/legal/privacy" className="text-intel underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {errorMessage && (
          <div role="alert" className="flex items-center gap-2 rounded-compact border border-status-error/30 bg-status-error/10 px-3.5 py-2.5 text-sm text-status-error">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button type="submit" size="lg" loading={status === "sending"}>
          Submit Enquiry
        </Button>
      </div>
    </form>
  );
}
