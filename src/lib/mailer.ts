import nodemailer, { type Transporter } from "nodemailer";

/**
 * Shared SMTP transport for notification emails (Zoho Mail for vanikara.com).
 *
 *   SMTP_HOST  smtppro.zoho.in   (Zoho organisation accounts, India data centre)
 *   SMTP_PORT  465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER  the mailbox that sends, e.g. support@vanikara.com
 *   SMTP_PASS  a Zoho *app-specific* password for that mailbox
 *
 * Returns null when email isn't configured, so callers can skip sending.
 */

let cached: Transporter | null | undefined;

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getMailer(): Transporter | null {
  if (cached !== undefined) return cached;
  if (!isMailConfigured()) return (cached = null);
  const port = Number(process.env.SMTP_PORT) || 465;
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 upgrades with STARTTLS
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return cached;
}

/** The authenticated mailbox — Zoho only allows sending as this address. */
export const mailFrom = (label: string) => `"${label}" <${process.env.SMTP_USER}>`;
