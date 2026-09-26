export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseService } from "@/utils/supabase/service";
import { sanitize, apiResponse, logError, isBot, escapeHtml } from "@/lib/security";
import { submitToGoogleForm } from "@/lib/googleForms";
import { isRateLimited } from "@/lib/rateLimit";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().max(30).optional(),
  organization: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
  bot: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = await isRateLimited(ip);
    
    if (rateLimit.limited) {
      return NextResponse.json(apiResponse(false, null, "Too many requests. Please try again later."), { status: 429 });
    }

    const body = await req.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(apiResponse(false, null, validation.error.issues[0].message), { status: 400 });
    }

    const { name, email, phone, organization, company, subject, message, bot } = validation.data;

    // 1. Spam protection (Honeypot)
    if (isBot(bot || "")) {
      return NextResponse.json(apiResponse(false, null, "Bot request rejected"), { status: 400 });
    }

    // 2. Clean and Sanitize Inputs
    const sName = sanitize(name).slice(0, 100);
    const sEmail = email.trim().toLowerCase();
    const sPhone = phone ? sanitize(phone).slice(0, 30) : "N/A";
    const orgValue = organization || company || "";
    const sOrg = orgValue ? sanitize(orgValue).slice(0, 100) : "N/A";
    const sSubject = sanitize(subject).slice(0, 200);
    const sMessage = sanitize(message).slice(0, 5000);

    // Format description detail for leads database storing
    const crmStoredMessage = `Subject: ${sSubject}\nOrganization: ${sOrg}\nPhone: ${sPhone}\n\nMessage Details:\n${sMessage}`;

    // 3. Persist to leads database table in Supabase
    const { error: dbError } = await supabaseService
      .from("leads")
      .insert([
        { 
          name: sName, 
          email: sEmail, 
          message: crmStoredMessage,
          source: "form",
          status: "new"
        }
      ]);

    if (dbError) {
      logError("Contact Form DB Persistence", dbError);
      return NextResponse.json(apiResponse(false, null, "Failed to persist inquiry details. Please contact support@vanikara.com directly."), { status: 500 });
    }

    // 4. Optional Secondary Sync to Google Form (if configured)
    if (process.env.GOOGLE_FORM_CONTACT_URL) {
      try {
        await submitToGoogleForm("contact", {
          name: sName,
          email: sEmail,
          phone: sPhone,
          company: sOrg,
          subject: sSubject,
          message: sMessage,
          privacyAgreement: "I agree to the Privacy Policy."
        });
      } catch (gfErr) {
        console.warn("Secondary Google Form sync failed:", gfErr);
      }
    }

    // 5. Send Transactional Notification Email via Nodemailer (Resilient)
    const smtpEnabled = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

    if (smtpEnabled) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const timestamp = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " (UTC)";

        await transporter.sendMail({
          from: `"VANIKARA Contact System" <${process.env.SMTP_USER}>`,
          to: "contact@vanikara.com",
          replyTo: sEmail,
          subject: `[INQUIRY] ${sSubject} — ${sName}`,
          text: `New contact submission received:\n\n` +
                `Name: ${sName}\n` +
                `Email: ${sEmail}\n` +
                `Phone: ${sPhone}\n` +
                `Organization: ${sOrg}\n` +
                `Subject: ${sSubject}\n` +
                `Message: ${sMessage}\n` +
                `Submitted At: ${timestamp}\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #0058D6; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Inquiry Received — VANIKARA</h2>
              <table style="width: 100%; font-size: 14px; color: #334155; margin-bottom: 20px; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 130px;">Name:</td><td style="padding: 8px 0;">${escapeHtml(sName)}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(sEmail)}">${escapeHtml(sEmail)}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${escapeHtml(sPhone)}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Organization:</td><td style="padding: 8px 0;">${escapeHtml(sOrg)}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Subject:</td><td style="padding: 8px 0;">${escapeHtml(sSubject)}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Timestamp:</td><td style="padding: 8px 0;">${timestamp}</td></tr>
              </table>
              <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 8px;">Message:</div>
              <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 15px; font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(sMessage)}</div>
            </div>
          `
        });
      } catch (mailErr) {
        console.warn("Mail Notification Dispatch Failed (Inquiry saved to database):", mailErr);
      }
    }

    return NextResponse.json({ success: true, message: "Your message has been securely submitted. The VANIKARA team will review it shortly." });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logError("Contact API route", err);
    return NextResponse.json(apiResponse(false, null, "Internal server error. Please try again or write directly to contact@vanikara.com."), { status: 500 });
  }
}
