import { submitToGoogleForm } from "@/lib/googleForms";
import { logError } from "@/lib/security";

/**
 * Reliable capture for public form submissions (contact, job applications).
 *
 * Every submission goes down two independent paths at the same time:
 *   1. the database (Supabase) — what the admin dashboard shows — retried
 *      on transient failures;
 *   2. a backup copy to the company's Google Form (free, hosted by Google),
 *      which lands in its linked Google Sheet.
 * A submission counts as received if either path succeeds, so a database
 * outage never loses an enquiry or an application.
 */

type DbResult = { error: unknown } | void;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Runs a database write, retrying network / server errors with backoff. */
export async function writeWithRetry(label: string, write: () => PromiseLike<DbResult>, attempts = 3): Promise<boolean> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const result = await write();
      const error = result && "error" in result ? result.error : null;
      if (!error) return true;
      // Validation-type errors won't fix themselves on retry
      const code = String((error as { code?: string }).code ?? "");
      if (/^(22|23|42)/.test(code) || code.startsWith("PGRST2")) {
        logError(`${label}: database rejected the write`, error);
        return false;
      }
      throw error;
    } catch (error) {
      if (i === attempts) {
        logError(`${label}: database write failed after ${attempts} attempts`, error);
        return false;
      }
      await sleep(300 * 3 ** (i - 1)); // 300ms, 900ms
    }
  }
  return false;
}

/** Google Forms only accepts plain short-answer text; keep the backup compact. */
function clip(text: string, max = 1500) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/**
 * Backup copy of a submission to the public "Contact Us" Google Form.
 * That form maps name, email, phone and subject, so the rest of the
 * submission (type, message, application details) is packed into subject.
 */
export async function backupToGoogleForm(entry: {
  kind: "Contact" | "Application";
  name: string;
  email: string;
  phone?: string;
  summary: string;
  details: string;
}): Promise<boolean> {
  try {
    return await submitToGoogleForm("contact", {
      name: entry.name,
      email: entry.email,
      phone: entry.phone || "N/A",
      subject: clip(`[${entry.kind}] ${entry.summary} — ${entry.details}`),
      privacyAgreement: "I agree to the Privacy Policy.",
    });
  } catch (error) {
    logError("Google Forms backup failed", error);
    return false;
  }
}
