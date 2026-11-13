export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { z } from "zod";
import { supabaseService } from "@/utils/supabase/service";
import { sanitize, apiResponse, logError, escapeHtml, isTrustedOrigin } from "@/lib/security";
import { clientIp, isRateLimited, retryAfterHeaders } from "@/lib/rateLimit";
import { backupToGoogleForm, writeWithRetry } from "@/lib/submissions";

/**
 * Job / internship applications from the Careers page.
 *
 * Accepts multipart form data (fields + an optional PDF/DOCX résumé up to
 * 4 MB, which keeps the request under the platform's 4.5 MB body limit).
 * The application is captured in the database (shown in the admin
 * "Applications" tab) and backed up to the company's Google Form; the
 * applicant sees success if either succeeds.
 */

const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const TYPES = ["Full-time", "Internship", "Part-time", "Freelance / contract", "Other"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  phone: z.string().trim().min(6, "Please enter your phone number").max(30),
  position: z.string().trim().min(1, "Please tell us the role you're applying for").max(100),
  applicationType: z.enum(TYPES).catch("Other"),
  portfolio: z
    .string()
    .trim()
    .max(300)
    .refine((v) => !v || /^https:\/\/\S+$/i.test(v), "Portfolio / LinkedIn must be a full https:// link")
    .optional()
    .default(""),
  coverLetter: z.string().trim().max(5000).optional().default(""),
  consent: z.literal("yes", { message: "Please agree to the Privacy Policy" }),
  website: z.string().max(0).optional().default(""), // honeypot
});

function detectResume(bytes: Buffer): { ext: "pdf" | "docx"; mime: string } | null {
  if (bytes.length > 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { ext: "pdf", mime: "application/pdf" };
  }
  if (bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  }
  return null;
}

export async function POST(req: Request) {
  try {
    if (!isTrustedOrigin(req)) {
      return NextResponse.json(apiResponse(false, null, "Forbidden"), { status: 403 });
    }
    if (Number(req.headers.get("content-length") ?? 0) > MAX_RESUME_BYTES + 256 * 1024) {
      return NextResponse.json(apiResponse(false, null, "Your résumé must be 4 MB or smaller."), { status: 413 });
    }

    const limit = await isRateLimited(clientIp(req), "careers");
    if (limit.limited) {
      return NextResponse.json(apiResponse(false, null, "Too many applications from this network. Please try again later."), {
        status: 429,
        headers: retryAfterHeaders(limit.reset),
      });
    }

    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json(apiResponse(false, null, "Invalid form submission."), { status: 400 });

    const text = (key: string) => {
      const v = form.get(key);
      return typeof v === "string" ? v : undefined;
    };
    const parsed = schema.safeParse({
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      position: text("position"),
      applicationType: text("applicationType"),
      portfolio: text("portfolio"),
      coverLetter: text("coverLetter"),
      consent: text("consent"),
      website: text("website"),
    });
    if (!parsed.success) {
      return NextResponse.json(apiResponse(false, null, parsed.error.issues[0].message), { status: 400 });
    }
    const d = parsed.data;

    const app = {
      name: sanitize(d.name).slice(0, 100),
      email: d.email.toLowerCase(),
      phone: sanitize(d.phone).slice(0, 30),
      position: sanitize(d.position).slice(0, 100),
      type: d.applicationType,
      portfolio: d.portfolio,
      cover: sanitize(d.coverLetter).slice(0, 5000),
    };

    // ---- Résumé (optional, validated by content, stored privately) ----
    let resumePath: string | null = null;
    let resumeNote = "No résumé attached";
    const file = form.get("resume");
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_RESUME_BYTES) {
        return NextResponse.json(apiResponse(false, null, "Your résumé must be 4 MB or smaller."), { status: 413 });
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const kind = detectResume(bytes);
      if (!kind) {
        return NextResponse.json(apiResponse(false, null, "Please upload your résumé as a PDF or Word (.docx) file."), { status: 400 });
      }
      const path = `${randomUUID()}.${kind.ext}`;
      const uploaded = await writeWithRetry("Careers résumé upload", () =>
        supabaseService.storage.from("resumes").upload(path, bytes, { contentType: kind.mime, upsert: false })
      );
      if (uploaded) {
        resumePath = path;
        resumeNote = `Résumé uploaded (${kind.ext.toUpperCase()})`;
      } else {
        // Don't lose the application because storage failed — ask for it by email instead
        resumeNote = "Résumé upload failed — request it from the applicant";
      }
    }

    // ---- Capture: database (with fallback to the original columns) + Google Forms backup ----
    const legacyCover = `Phone: ${app.phone}\nType: ${app.type}\nPortfolio/LinkedIn: ${app.portfolio || "N/A"}\n\n${app.cover}`;
    const saveToDb = async () => {
      const full = await supabaseService.from("careers_applications").insert([
        {
          name: app.name,
          email: app.email,
          position: app.position,
          cover_letter: app.cover,
          phone: app.phone,
          application_type: app.type,
          portfolio_url: app.portfolio || null,
          resume_path: resumePath,
          status: "new",
        },
      ]);
      // Older databases don't have the newer columns yet: store in the original ones
      const code = String((full.error as { code?: string } | null)?.code ?? "");
      if (full.error && (code === "PGRST204" || code === "42703")) {
        return supabaseService.from("careers_applications").insert([
          { name: app.name, email: app.email, position: app.position, cover_letter: legacyCover, resume_url: resumePath, status: "new" },
        ]);
      }
      return full;
    };

    const [savedToDb, savedToBackup] = await Promise.all([
      writeWithRetry("Careers application", saveToDb),
      backupToGoogleForm({
        kind: "Application",
        name: app.name,
        email: app.email,
        phone: app.phone,
        summary: `${app.position} (${app.type})`,
        details: `${resumeNote} | Portfolio: ${app.portfolio || "N/A"} | ${app.cover || "No cover letter"}`,
      }),
    ]);

    if (!savedToDb && !savedToBackup) {
      return NextResponse.json(
        apiResponse(false, null, "We couldn't submit your application right now. Please try again in a minute, or email your résumé to contact@vanikara.com."),
        { status: 503 }
      );
    }
    if (!savedToDb) logError("Careers application: saved to Google Forms backup only", { email: app.email });

    // ---- Email notifications (only when SMTP is configured; never block the response) ----
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await Promise.allSettled([
        transporter.sendMail({
          from: `"VANIKARA Careers" <${process.env.SMTP_USER}>`,
          to: "support@vanikara.com",
          replyTo: app.email,
          subject: `[Application] ${app.position} — ${app.name}`,
          text: `New application\n\nName: ${app.name}\nEmail: ${app.email}\nPhone: ${app.phone}\nRole: ${app.position} (${app.type})\nPortfolio: ${app.portfolio || "N/A"}\n${resumeNote}\n\n${app.cover}\n\nView it in the admin dashboard → Applications.`,
          html: `<p><strong>New application</strong></p><p>Name: ${escapeHtml(app.name)}<br>Email: ${escapeHtml(app.email)}<br>Phone: ${escapeHtml(app.phone)}<br>Role: ${escapeHtml(app.position)} (${escapeHtml(app.type)})<br>Portfolio: ${escapeHtml(app.portfolio || "N/A")}<br>${escapeHtml(resumeNote)}</p><p style="white-space:pre-wrap">${escapeHtml(app.cover)}</p><p>View it in the admin dashboard → Applications.</p>`,
        }),
        transporter.sendMail({
          from: `"VANIKARA Careers" <${process.env.SMTP_USER}>`,
          to: app.email,
          subject: `We received your application — ${app.position}`,
          text: `Dear ${app.name},\n\nThank you for applying for ${app.position} at VANIKARA. We have received your application and will contact you if your profile matches what we are looking for.\n\nVANIKARA Intelligence Private Limited`,
        }),
      ]).then((results) => results.forEach((r) => r.status === "rejected" && logError("Careers email", r.reason)));
    }

    return NextResponse.json(apiResponse(true, { received: true }));
  } catch (err) {
    logError("Careers apply", err);
    return NextResponse.json(apiResponse(false, null, "Something went wrong. Please try again, or email contact@vanikara.com."), { status: 500 });
  }
}
