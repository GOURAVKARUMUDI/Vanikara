"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

const ENQUIRY_TYPES = [
  "Early Access",
  "Product Information",
  "Enterprise Partnership",
  "General Business Enquiry",
] as const;

const COMPANY_SIZES = ["", "1–50 employees", "51–250 employees", "251–1,000 employees", "1,000+ employees"];
const RESUME_VOLUMES = ["", "Under 100 / month", "100–500 / month", "500–2,000 / month", "2,000+ / month"];

const EMPTY = {
  name: "",
  organization: "",
  email: "",
  designation: "",
  companySize: "",
  monthlyResumeVolume: "",
  enquiryType: "Early Access" as (typeof ENQUIRY_TYPES)[number],
  notes: "",
  bot: "",
};

export default function CygmaRiEnquiryForm() {
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setError(null);
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.bot) return;

    if (!form.name.trim() || !form.organization.trim() || !form.email.trim() || !form.designation.trim()) {
      setError("Please complete your full name, company name, work email, and designation.");
      return;
    }
    if (!consent) {
      setError("Please acknowledge our Privacy Policy before submitting.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "cygma-ri",
          category: "cygma_ri_enterprise",
          name: form.name.trim(),
          organization: form.organization.trim(),
          email: form.email.trim(),
          designation: form.designation.trim(),
          companySize: form.companySize || undefined,
          monthlyResumeVolume: form.monthlyResumeVolume || undefined,
          enquiryType: form.enquiryType,
          notes: form.notes.trim() || undefined,
          consent: true,
          bot: form.bot,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error?.message || "Unable to submit your enquiry. Please try again.");
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
            <h3 className="text-lg font-semibold text-fg">Enterprise enquiry recorded</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Thank you for your interest in CYGMA-RI (Resume Intelligence). Our enterprise team has logged your request in Vanikara Console and will respond when early access milestones open.
            </p>
            {reference && (
              <p className="mt-3 font-mono text-xs text-fg">
                Enquiry Reference: <span className="font-semibold text-intel">{reference}</span>
              </p>
            )}
            <div className="mt-6">
              <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                Submit another enquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface p-6 sm:p-8 space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cri-name" className="block text-sm font-medium text-fg">
            Full name <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="cri-name"
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
          <label htmlFor="cri-company" className="block text-sm font-medium text-fg">
            Company name <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="cri-company"
            name="organization"
            type="text"
            required
            autoComplete="organization"
            value={form.organization}
            onChange={update("organization")}
            className="v2-input mt-1.5"
            placeholder="Organization name"
          />
        </div>
        <div>
          <label htmlFor="cri-email" className="block text-sm font-medium text-fg">
            Work email <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="cri-email"
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
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label htmlFor="cri-designation" className="block text-sm font-medium text-fg">
            Designation <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="cri-designation"
            name="designation"
            type="text"
            required
            autoComplete="organization-title"
            value={form.designation}
            onChange={update("designation")}
            className="v2-input mt-1.5"
            placeholder="e.g., Head of Talent Acquisition"
          />
        </div>
        <div>
          <label htmlFor="cri-type" className="block text-sm font-medium text-fg">
            Enquiry type
          </label>
          <select id="cri-type" name="enquiryType" value={form.enquiryType} onChange={update("enquiryType")} className="v2-input mt-1.5">
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cri-size" className="block text-sm font-medium text-fg">
            Company size (optional)
          </label>
          <select id="cri-size" name="companySize" value={form.companySize} onChange={update("companySize")} className="v2-input mt-1.5">
            {COMPANY_SIZES.map((s) => (
              <option key={s || "unset"} value={s}>
                {s || "Select company size"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cri-volume" className="block text-sm font-medium text-fg">
          Approximate monthly resume volume (optional)
        </label>
        <select id="cri-volume" name="monthlyResumeVolume" value={form.monthlyResumeVolume} onChange={update("monthlyResumeVolume")} className="v2-input mt-1.5">
          {RESUME_VOLUMES.map((v) => (
            <option key={v || "unset"} value={v}>
              {v || "Select approximate monthly volume"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cri-notes" className="block text-sm font-medium text-fg">
          Recruitment requirements &amp; message
        </label>
        <textarea
          id="cri-notes"
          name="notes"
          rows={4}
          value={form.notes}
          onChange={update("notes")}
          className="v2-input mt-1.5 min-h-[110px]"
          placeholder="Tell us about your hiring workflows, verification bottlenecks, or questions about CYGMA-RI..."
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cri-bot">Leave blank</label>
        <input id="cri-bot" name="bot" tabIndex={-1} value={form.bot} onChange={update("bot")} />
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id="cri-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--action-bg)]"
          required
        />
        <label htmlFor="cri-consent" className="text-xs leading-relaxed text-fg-muted">
          I acknowledge that Vanikara Intelligence Private Limited will process this B2B enquiry in accordance with the{" "}
          <Link href="/legal/privacy" className="text-intel underline">
            Privacy Policy
          </Link>
          . Please do not upload candidate résumés through this corporate enquiry form.
        </label>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-compact border border-status-error/30 bg-status-error/10 px-3.5 py-2.5 text-sm text-status-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" loading={status === "submitting"}>
        Submit CYGMA-RI Enquiry
      </Button>
    </form>
  );
}
