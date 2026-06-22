export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseService } from "@/utils/supabase/service";
import { sanitize, isValidEmail, apiResponse, logError, logInfo, isBot } from "@/lib/security";
import { submitToGoogleForm } from "@/lib/googleForms";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message, bot } = body;

    // 1. Spam protection (Honeypot)
    if (isBot(bot || "")) {
      return NextResponse.json(apiResponse(false, null, "Bot request rejected"), { status: 400 });
    }

    // 2. Server-side required validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(apiResponse(false, null, "Missing required fields"), { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(apiResponse(false, null, "Invalid email format"), { status: 400 });
    }

    // 3. Clean and Sanitize Inputs
    const sName = sanitize(name).slice(0, 100);
    const sEmail = email.trim().toLowerCase();
    const sPhone = phone ? sanitize(phone).slice(0, 30) : "N/A";
    const sCompany = company ? sanitize(company).slice(0, 100) : "N/A";
    const sSubject = sanitize(subject).slice(0, 200);
    const sMessage = sanitize(message).slice(0, 5000);

    // Format full description detail for crm database storing
    const crmStoredMessage = `Subject: ${sSubject}\nCompany: ${sCompany}\nPhone: ${sPhone}\n\nMessage Details:\n${sMessage}`;

    // 4. Persist to leads CRM database table
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
      return NextResponse.json(apiResponse(false, null, "Failed to persist inquiry details"), { status: 500 });
    }

    // 5. Sync to Google Form (Secondary Operational Flow)
    const googleFormSuccess = await submitToGoogleForm("contact", {
      name: sName,
      email: sEmail,
      phone: sPhone,
      company: sCompany,
      subject: sSubject,
      message: sMessage,
      privacyAgreement: "I agree to the Privacy Policy."
    });

    if (!googleFormSuccess && (process.env.GOOGLE_FORM_CONTACT_URL || process.env.NODE_ENV === "production")) {
      return NextResponse.json(
        apiResponse(false, null, "Google Forms operational sync failed. Please try again in a few moments."),
        { status: 502 }
      );
    }

    // 6. Send Transactional Notification Email via Nodemailer (Non-blocking/Resilient)
    const smtpEnabled = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

    if (!smtpEnabled) {
      console.warn("SMTP is disabled. Skipping email notification.");
    } else {
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
          to: "vanikara26@gmail.com",
          subject: `[INQUIRY] ${sSubject} - ${sName}`,
          text: `New contact submission received:\n\n` +
                `Sender Name: ${sName}\n` +
                `Sender Email: ${sEmail}\n` +
                `Phone: ${sPhone}\n` +
                `Company: ${sCompany}\n` +
                `Subject: ${sSubject}\n` +
                `Message: ${sMessage}\n` +
                `Submitted At: ${timestamp}\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #1e6bd6; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Inquiry Received</h2>
              <table style="width: 100%; font-size: 14px; color: #334155; margin-bottom: 20px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px 0;">${sName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${sEmail}" style="color: #1e6bd6; text-decoration: none;">${sEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0;">${sPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Company:</td>
                  <td style="padding: 8px 0;">${sCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0;">${sSubject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Timestamp:</td>
                  <td style="padding: 8px 0;">${timestamp}</td>
                </tr>
              </table>
              <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 8px;">Message:</div>
              <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 15px; font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${sMessage}</div>
            </div>
          `
        });
      } catch (mailErr: any) {
        console.error("Mail Dispatch Failed:", mailErr);
        // We don't throw here to ensure the user gets a success response even if the notification fails
      }
    }

    return NextResponse.json({ success: true, message: "Inquiry logged and processing started" });

  } catch (err: any) {
    logError("Contact API route", err);
    return NextResponse.json(apiResponse(false, null, "Internal server error"), { status: 500 });
  }
}

