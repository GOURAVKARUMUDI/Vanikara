export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseService } from "@/utils/supabase/service";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { sanitize, isValidEmail, apiResponse, logError } from "@/lib/security";
import { submitToGoogleForm } from "@/lib/googleForms";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, position, portfolio, coverLetter, resumeBase64, resumeFileName } = body;
    // 1. Validation
    if (!name || !email || !phone || !position || !resumeBase64 || !resumeFileName) {
      return NextResponse.json(apiResponse(false, null, "Missing required fields"), { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(apiResponse(false, null, "Invalid email format"), { status: 400 });
    }

    // Ensure size does not exceed 5MB
    const approxSizeInBytes = (resumeBase64.length * 3) / 4;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (approxSizeInBytes > MAX_SIZE) {
      return NextResponse.json(apiResponse(false, null, "Resume file size exceeds the 5MB limit"), { status: 413 });
    }

    // 2. Sanitization
    const sName = sanitize(name).slice(0, 100);
    const sEmail = email.trim().toLowerCase();
    const sPhone = sanitize(phone).slice(0, 30);
    const sPosition = sanitize(position).slice(0, 100);
    const sPortfolio = portfolio ? sanitize(portfolio).slice(0, 200) : "N/A";
    const sCover = sanitize(coverLetter || "").slice(0, 5000);

    // 3. Process Resume Attachment & Upload to Supabase Storage bucket 'resumes'
    let resumeUrl = "";
    try {
      // Strip metadata MIME headers (e.g., "data:application/pdf;base64,")
      const matches = resumeBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let base64CleanData = resumeBase64;
      if (matches && matches.length === 3) {
        base64CleanData = matches[2];
      }

      const fileBuffer = Buffer.from(base64CleanData, "base64");

      // Validate Magic Bytes for PDF and DOCX/DOC
      // PDF: Starts with %PDF (25 50 44 46)
      // ZIP/DOCX: Starts with PK (50 4B 03 04)
      const isPDF = fileBuffer.length > 4 && fileBuffer[0] === 0x25 && fileBuffer[1] === 0x50 && fileBuffer[2] === 0x44 && fileBuffer[3] === 0x46;
      const isDOCX = fileBuffer.length > 4 && fileBuffer[0] === 0x50 && fileBuffer[1] === 0x4b && fileBuffer[2] === 0x03 && fileBuffer[3] === 0x04;

      if (!isPDF && !isDOCX) {
        return NextResponse.json(apiResponse(false, null, "Invalid file format. Only PDF and DOCX documents are allowed."), { status: 400 });
      }

      const uniqueFileName = `${Date.now()}_${resumeFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

      const { data: uploadData, error: uploadError } = await supabaseService.storage
        .from("resumes")
        .upload(uniqueFileName, fileBuffer, {
          contentType: isPDF ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          upsert: false
        });

      if (uploadError) {
        logError("Careers Storage Upload Failed", uploadError.message);
        return NextResponse.json(apiResponse(false, null, "Failed to upload resume to secure storage"), { status: 500 });
      }

      const { data: urlData } = supabaseService.storage.from("resumes").getPublicUrl(uniqueFileName);
      if (!urlData || !urlData.publicUrl) {
        return NextResponse.json(apiResponse(false, null, "Failed to retrieve public link for uploaded resume"), { status: 500 });
      }
      resumeUrl = urlData.publicUrl;
    } catch (fileErr) {
      logError("Resume File Process", fileErr);
      return NextResponse.json(apiResponse(false, null, "Error processing resume document"), { status: 500 });
    }    // Format compound cover letter with portfolio/phone to fit CRM schema fields
    const compoundCover = `Phone: ${sPhone}\nPortfolio/LinkedIn: ${sPortfolio}\n\nCover Letter / Statement:\n${sCover}`;

    // 4. Persist Candidate Record to Careers Database
    const { data: dbData, error: dbError } = await supabaseService
      .from("careers_applications")
      .insert([
        {
          name: sName,
          email: sEmail,
          position: sPosition,
          cover_letter: compoundCover,
          resume_url: resumeUrl,
          status: "new"
        }
      ])
      .select()
      .single();

    if (dbError) {
      logError("Careers Database Persistence Failure", dbError.message);
      return NextResponse.json(apiResponse(false, null, "Failed to register application in database"), { status: 500 });
    }

    // 5. Sync to Google Form (Secondary Operational Flow)
    const isInternship = sPosition.toLowerCase().includes("intern") || sPosition.toLowerCase().includes("coordinator");
    const formType = isInternship ? "internship" : "careers";

    const googleFormSuccess = isInternship
      ? await submitToGoogleForm("internship", {
          name: sName,
          email: sEmail,
          phone: sPhone,
          whyJoin: `Position: ${sPosition}\nPortfolio: ${sPortfolio}\n\nCover Letter:\n${sCover}`,
          resumeSubmitted: resumeUrl,
          declaration: "I confirm all information is accurate."
        })
      : await submitToGoogleForm("careers", {
          name: sName,
          email: sEmail,
          phone: sPhone,
          position: sPosition,
          resumeUrl: resumeUrl,
          coverLetter: `Portfolio: ${sPortfolio}\n\nCover Letter:\n${sCover}`,
          declaration: "I confirm all information is accurate."
        });

    const formUrlEnvName = isInternship ? "GOOGLE_FORM_INTERNSHIP_URL" : "GOOGLE_FORM_CAREERS_URL";
    if (!googleFormSuccess && (process.env[formUrlEnvName] || process.env.NODE_ENV === "production")) {
      return NextResponse.json(
        apiResponse(false, null, "Google Forms operational sync failed. Please try again in a few moments."),
        { status: 502 }
      );
    }



    const smtpEnabled = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

    // 5. Send Transactional Confirmation Emails via SMTP Nodemailer
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

        // A. Alert Company Admissions
        try {
          await transporter.sendMail({
            from: `"VANIKARA Careers Portal" <${process.env.SMTP_USER}>`,
            to: "vanikara26@gmail.com",
            subject: `[APPLICANT] ${sPosition} - ${sName}`,
            text: `New job application received:\n\n` +
                  `Candidate Name: ${sName}\n` +
                  `Position: ${sPosition}\n` +
                  `Email Address: ${sEmail}\n` +
                  `Phone Number: ${sPhone}\n` +
                  `Portfolio/LinkedIn: ${sPortfolio}\n` +
                  `Resume URL: ${resumeUrl}\n\n` +
                  `Statement / Cover Letter:\n${sCover}\n\n` +
                  `Submitted At: ${timestamp}\n`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #1e6bd6; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Internship Application</h2>
                <table style="width: 100%; font-size: 14px; color: #334155; margin-bottom: 20px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 150px;">Position:</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #1e6bd6;">${sPosition}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Candidate Name:</td>
                    <td style="padding: 8px 0;">${sName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${sEmail}" style="color: #1e6bd6; text-decoration: none;">${sEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
                    <td style="padding: 8px 0;">${sPhone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Portfolio:</td>
                    <td style="padding: 8px 0;"><a href="${sPortfolio}" style="color: #1e6bd6; text-decoration: none;">${sPortfolio}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Resume Link:</td>
                    <td style="padding: 8px 0;"><a href="${resumeUrl}" style="color: #16a34a; font-weight: bold; text-decoration: none;">View Candidate Resume</a></td>
                  </tr>
                </table>
                <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 8px;">Cover Letter:</div>
                <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 15px; font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${sCover}</div>
              </div>
            `
          });
        } catch (mailErr) {
          logError("Careers Company Mail Dispatch", mailErr);
        }

        // B. Send Confirmation to Candidate
        try {
          await transporter.sendMail({
            from: `"VANIKARA Admissions Office" <${process.env.SMTP_USER}>`,
            to: sEmail,
            subject: `Application Confirmation - ${sPosition}`,
            text: `Dear ${sName},\n\n` +
                  `Thank you for applying for the ${sPosition} position at VANIKARA Intelligence Private Limited.\n\n` +
                  `We have received your resume and application. Our admissions team is currently reviewing student applications, and we will contact you directly to discuss potential interview steps.\n\n` +
                  `Best regards,\n` +
                  `VANIKARA Intelligence Private Limited\n` +
                  `Admissions & Recruitment Hub\n`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #f8fafc; color: #334155;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 1px;">VANIKARA INTELLIGENCE</h1>
                  <p style="font-size: 9px; font-weight: bold; color: #1e6bd6; text-transform: uppercase; margin: 5px 0 0 0; letter-spacing: 2px;">Recruitment System</p>
                </div>
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                  <p style="font-size: 14px; line-height: 1.6; margin-top: 0;">Dear <strong>${sName}</strong>,</p>
                  <p style="font-size: 14px; line-height: 1.6;">Thank you for submitting your internship application for the <strong>${sPosition}</strong> position at VANIKARA.</p>
                  <p style="font-size: 14px; line-height: 1.6;">Our founders and technical team are auditing applications. If your profile is a match for our current development storyboards, we will reach out to schedule an interview.</p>
                  <p style="font-size: 14px; line-height: 1.6; margin-bottom: 0;">We appreciate your interest in building beautiful technology with us.</p>
                </div>
                <p style="font-size: 11px; text-align: center; color: #64748b; margin-top: 25px; line-height: 1.5;">
                  VANIKARA Intelligence Private Limited<br>
                  Incorporated under Companies Act 2013, AP India
                </p>
              </div>
            `
          });
        } catch (mailErr) {
          logError("Careers Candidate Mail Dispatch", mailErr);
        }
      } catch (transporterErr) {
        logError("Careers Mail Transporter Initialization Failed", transporterErr);
      }
    }

    return NextResponse.json(apiResponse(true, { message: "Application persisted and emails dispatched", data: dbData }));

  } catch (err: any) {
    logError("Careers Apply API POST handler", err);
    return NextResponse.json(apiResponse(false, null, "Internal server error"), { status: 500 });
  }
}
