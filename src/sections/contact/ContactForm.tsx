"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { logger } from "@/utils/logger";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    bot: ""
  });
  
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errors, setErrors] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.bot) return; // Silent reject for bots

    // Basic Validation
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setErrors("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrors("Please enter a valid email address.");
      return;
    }

    if (form.name.length > 100) {
      setErrors("Name cannot exceed 100 characters.");
      return;
    }

    if (form.subject.length > 200) {
      setErrors("Subject cannot exceed 200 characters.");
      return;
    }

    if (form.message.length > 5000) {
      setErrors("Message cannot exceed 5000 characters.");
      return;
    }

    logger.form("Contact", "submit", form);
    setStatus("sending");
    setErrors(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (_jsonErr) {
          // Ignore json parse error here as we'll check response.ok next
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Server Error (${response.status}). Please try again later.`);
      }

      logger.form("Contact", "success");
      setStatus("success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      logger.error("Failed to submit contact form", err);
      // Clean up raw JSON parser error tokens for user display
      const friendlyMsg = err.message.includes("is not valid JSON")
        ? "Server returned an invalid response. Please try again later."
        : err.message;
      setErrors(friendlyMsg || "Something went wrong. Please check fields and try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-8 sm:p-10 shadow-xl">
      {/* Spotlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)]/10 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32" />

      {status === "success" ? (
        <div className="relative z-10 text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-500/15 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-2xl text-[var(--text-primary)]">
            Message Dispatched!
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
            Thank you! Your inquiry has been saved successfully and sent to the VANIKARA administration. We will review it and reply within 24 hours.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={() => {
                setStatus("idle");
                setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "", bot: "" });
              }}
              className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)] hover:underline cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="relative z-10 space-y-6">
          <div>
            <h2 className="font-display font-black text-2xl text-[var(--text-primary)] uppercase tracking-wider">
              Send a Message
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              We respond to inquiries Monday through Friday.
            </p>
          </div>

          {errors && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-500 rounded-xl text-xs font-bold text-center">
              {errors}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <input
                id="contact-name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="peer w-full px-4 pt-6 pb-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder-transparent"
                placeholder="Full Name"
              />
              <label
                htmlFor="contact-name"
                className="absolute left-4 top-4.5 text-xs text-slate-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--accent-color)] peer-focus:font-bold [:not(:placeholder-shown)]:top-1.5 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:text-[var(--accent-color)]"
              >
                Full Name *
              </label>
            </div>

            {/* Email Address */}
            <div className="relative">
              <input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="peer w-full px-4 pt-6 pb-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder-transparent"
                placeholder="Email Address"
              />
              <label
                htmlFor="contact-email"
                className="absolute left-4 top-4.5 text-xs text-slate-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--accent-color)] peer-focus:font-bold [:not(:placeholder-shown)]:top-1.5 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:text-[var(--accent-color)]"
              >
                Email Address *
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number (Optional) */}
              <div className="relative">
                <input
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="peer w-full px-4 pt-6 pb-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder-transparent"
                  placeholder="Phone Number (Optional)"
                />
                <label
                  htmlFor="contact-phone"
                  className="absolute left-4 top-4.5 text-xs text-slate-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--accent-color)] peer-focus:font-bold [:not(:placeholder-shown)]:top-1.5 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:text-[var(--accent-color)]"
                >
                  Phone Number (Optional)
                </label>
              </div>

              {/* Company / Organization (Optional) */}
              <div className="relative">
                <input
                  id="contact-company"
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="peer w-full px-4 pt-6 pb-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder-transparent"
                  placeholder="Company / Organization"
                />
                <label
                  htmlFor="contact-company"
                  className="absolute left-4 top-4.5 text-xs text-slate-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--accent-color)] peer-focus:font-bold [:not(:placeholder-shown)]:top-1.5 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:text-[var(--accent-color)]"
                >
                  Company (Optional)
                </label>
              </div>
            </div>

            {/* Subject */}
            <div className="relative">
              <input
                id="contact-subject"
                type="text"
                required
                maxLength={200}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="peer w-full px-4 pt-6 pb-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder-transparent"
                placeholder="Subject"
              />
              <label
                htmlFor="contact-subject"
                className="absolute left-4 top-4.5 text-xs text-slate-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--accent-color)] peer-focus:font-bold [:not(:placeholder-shown)]:top-1.5 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:text-[var(--accent-color)]"
              >
                Subject *
              </label>
            </div>

            {/* Bot honeypot */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.bot}
                onChange={(e) => setForm({ ...form, bot: e.target.value })}
              />
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="contact-message"
                required
                maxLength={5000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="peer w-full px-4 pt-6 pb-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder-transparent resize-none h-32"
                placeholder="Message Details"
              />
              <label
                htmlFor="contact-message"
                className="absolute left-4 top-4.5 text-xs text-slate-500 transition-all pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--accent-color)] peer-focus:font-bold [:not(:placeholder-shown)]:top-1.5 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:text-[var(--accent-color)]"
              >
                Message Details *
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === "sending"}
            variant="primary"
            size="lg"
            className="w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {status === "sending" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Form
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
