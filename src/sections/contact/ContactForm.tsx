"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY_IDENTITY } from "@/data/company";

const CATEGORIES = [
  { id: "General", placeholder: "What would you like to discuss?" },
  { id: "Partnership", placeholder: "Tell us about your restaurant or partnership idea." },
  { id: "Product", placeholder: "Questions or thoughts about our products." },
  { id: "Support", placeholder: "How can we help?" },
  { id: "Media", placeholder: "Your publication, topic and timeline." },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

const fieldClass =
  "w-full rounded-compact border border-line-strong bg-surface-raised px-4 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-200 focus:border-intel focus:outline-none focus:ring-4 focus:ring-intel/15";

const EMPTY = { name: "", email: "", subject: "", message: "", bot: "" };

export default function ContactForm() {
  const [category, setCategory] = useState<Category>("General");
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const active = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];

  const update = (key: keyof typeof EMPTY) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.bot) return; // honeypot

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setErrorMessage("Please fill in your name, email, subject and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          // The API stores subject and message; keep the chosen category visible to the team.
          subject: `[${category}] ${form.subject.trim()}`.slice(0, 200),
          message: form.message.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn't send your message.");
      setStatus("success");
    } catch (err) {
      setErrorMessage(
        `${err instanceof Error ? err.message : "We couldn't send your message."} You can also email ${COMPANY_IDENTITY.officialEmail}.`
      );
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="surface rise-in rounded-panel p-8 text-center sm:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-intel" strokeWidth={1.5} />
        <h2 className="text-title mt-5 text-fg">Thank you — your message is with us.</h2>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
          A member of the team will reply to {form.email || "your email"}.
        </p>
        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={() => {
              setStatus("idle");
              setForm(EMPTY);
            }}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="surface rise-in space-y-6 rounded-panel p-6 sm:p-8"
      style={{ ["--rise-delay" as string]: "200ms" }}
      aria-describedby={errorMessage ? "contact-error" : undefined}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-fg">What is this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={category === c.id}
                onChange={() => setCategory(c.id)}
                className="peer sr-only"
              />
              <span className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg peer-checked:border-transparent peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)] dark:peer-checked:bg-white dark:peer-checked:text-navy">
                {c.id}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {errorMessage && (
        <div id="contact-error" role="alert" className="flex items-start gap-2.5 rounded-compact border border-brand-red/25 bg-brand-red/5 p-3.5 text-sm text-fg">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red dark:text-ambition" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={form.bot} onChange={update("bot")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-fg">
            Name
          </label>
          <input id="contact-name" type="text" autoComplete="name" required maxLength={100} value={form.name} onChange={update("name")} className={`${fieldClass} h-12`} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-fg">
            Email
          </label>
          <input id="contact-email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} className={`${fieldClass} h-12`} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-fg">
          Subject
        </label>
        <input id="contact-subject" type="text" required maxLength={150} value={form.subject} onChange={update("subject")} className={`${fieldClass} h-12`} />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          maxLength={5000}
          value={form.message}
          onChange={update("message")}
          placeholder={active.placeholder}
          className={`${fieldClass} resize-y py-3 leading-relaxed`}
        />
        <p className="mt-2 text-right text-xs tabular-nums text-fg-subtle">{form.message.length} / 5000</p>
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-fg-subtle">
          We use your details only to reply. See our{" "}
          <Link href="/legal/privacy" className="text-fg-muted underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" arrow disabled={status === "sending"} className="shrink-0">
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
