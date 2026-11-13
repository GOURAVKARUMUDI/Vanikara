"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, FileText, Upload, X } from "lucide-react";
import Button from "@/components/ui/Button";

const TYPES = ["Full-time", "Internship", "Part-time", "Freelance / contract", "Other"] as const;
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const fieldClass =
  "w-full rounded-compact border border-line-strong bg-surface-raised px-4 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-200 focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15";

const EMPTY = { name: "", email: "", phone: "", position: "", portfolio: "", coverLetter: "", website: "" };

/**
 * Careers application form. Sends multipart form data to /api/careers/apply,
 * where it is saved for the admin "Applications" tab (with a backup copy to
 * the company's Google Form).
 */
export default function ApplicationForm({ contactEmail }: { contactEmail: string }) {
  const [form, setForm] = useState(EMPTY);
  const [type, setType] = useState<(typeof TYPES)[number]>("Internship");
  const [resume, setResume] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickFile = (file: File | undefined) => {
    setError(null);
    if (!file) return setResume(null);
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError("Please choose a PDF or Word (.docx) file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Your résumé must be 4 MB or smaller.");
      return;
    }
    setResume(file);
  };

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.website) return; // honeypot
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.position.trim()) {
      setError("Please fill in your name, email, phone and the role you're applying for.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.portfolio.trim() && !/^https:\/\/\S+$/i.test(form.portfolio.trim())) {
      setError("Portfolio / LinkedIn must be a full link starting with https://");
      return;
    }
    if (!consent) {
      setError("Please agree to the Privacy Policy so we can process your application.");
      return;
    }

    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v.trim()));
    body.append("applicationType", type);
    body.append("consent", "yes");
    if (resume) body.append("resume", resume);

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "We couldn't submit your application.");
      setStatus("success");
    } catch (err) {
      setError(`${err instanceof Error ? err.message : "We couldn't submit your application."} You can also email ${contactEmail}.`);
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="surface rise-in rounded-panel p-8 text-center sm:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-intel" strokeWidth={1.5} />
        <h3 className="text-title mt-5 text-fg">Thank you — your application is with us.</h3>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
          We&apos;ll review it and contact you at {form.email} if your profile is a match.
        </p>
        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={() => {
              setStatus("idle");
              setForm(EMPTY);
              setResume(null);
              setConsent(false);
            }}
          >
            Submit another application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="surface space-y-6 rounded-panel p-6 sm:p-8" aria-describedby={error ? "apply-error" : undefined}>
      <fieldset>
        <legend className="text-sm font-semibold text-fg">Type of role</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="applicationType" value={t} checked={type === t} onChange={() => setType(t)} className="peer sr-only" />
              <span className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg peer-checked:border-transparent peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)] dark:peer-checked:bg-white dark:peer-checked:text-navy">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <div id="apply-error" role="alert" className="flex items-start gap-2.5 rounded-compact border border-brand-red/25 bg-brand-red/5 p-3.5 text-sm text-fg">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red dark:text-ambition" />
          <span>{error}</span>
        </div>
      )}

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="apply-website">Leave this field empty</label>
        <input id="apply-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="apply-name" className="mb-2 block text-sm font-semibold text-fg">Full name</label>
          <input id="apply-name" required autoComplete="name" value={form.name} onChange={update("name")} className={`${fieldClass} h-12`} />
        </div>
        <div>
          <label htmlFor="apply-email" className="mb-2 block text-sm font-semibold text-fg">Email</label>
          <input id="apply-email" type="email" required autoComplete="email" value={form.email} onChange={update("email")} className={`${fieldClass} h-12`} />
        </div>
        <div>
          <label htmlFor="apply-phone" className="mb-2 block text-sm font-semibold text-fg">Phone</label>
          <input id="apply-phone" type="tel" required autoComplete="tel" value={form.phone} onChange={update("phone")} className={`${fieldClass} h-12`} />
        </div>
        <div>
          <label htmlFor="apply-position" className="mb-2 block text-sm font-semibold text-fg">Role you&apos;re applying for</label>
          <input id="apply-position" required placeholder="e.g. Frontend developer intern" value={form.position} onChange={update("position")} className={`${fieldClass} h-12`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="apply-portfolio" className="mb-2 block text-sm font-semibold text-fg">
            Portfolio or LinkedIn <span className="font-normal text-fg-subtle">(optional)</span>
          </label>
          <input id="apply-portfolio" type="url" placeholder="https://" value={form.portfolio} onChange={update("portfolio")} className={`${fieldClass} h-12`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="apply-cover" className="mb-2 block text-sm font-semibold text-fg">
            Why VANIKARA? <span className="font-normal text-fg-subtle">(optional)</span>
          </label>
          <textarea id="apply-cover" rows={5} maxLength={5000} value={form.coverLetter} onChange={update("coverLetter")} className={`${fieldClass} py-3`} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-fg">
          Résumé <span className="font-normal text-fg-subtle">(PDF or Word, up to 4 MB — optional)</span>
        </p>
        <input ref={fileRef} id="apply-resume" type="file" accept={ACCEPT} className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
        {resume ? (
          <div className="flex items-center gap-3 rounded-compact border border-line-strong bg-surface-raised px-4 py-3">
            <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-intel" />
            <span className="min-w-0 flex-1 truncate text-sm text-fg">{resume.name}</span>
            <span className="text-xs text-fg-subtle">{(resume.size / 1024 / 1024).toFixed(1)} MB</span>
            <button
              type="button"
              onClick={() => {
                setResume(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              aria-label="Remove file"
              className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface-sunken hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="apply-resume"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-compact border border-dashed border-line-strong px-4 py-6 text-sm font-semibold text-fg-muted transition-colors hover:border-intel hover:text-intel"
          >
            <Upload aria-hidden="true" className="h-4 w-4" />
            Choose a file
          </label>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--action-bg)]" />
        <span>
          I agree that VANIKARA may process my application data as described in the{" "}
          <Link href="/legal/privacy" className="font-semibold text-intel">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
