"use client";

import React, { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";
import { Briefcase, Heart, BookOpen, Star, CheckCircle, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import { PageContainer, SectionContainer, ContentContainer, FormContainer } from "@/components/ui/Containers";

const CareersScene = dynamic(() => import("@/components/careers/CareersScene"), { ssr: false });

const BENEFITS = [
  { icon: <Heart className="w-5 h-5 text-rose-500" />, title: "Flexible Culture", desc: "Work around your classes. We align milestones to your exam schedules." },
  { icon: <BookOpen className="w-5 h-5 text-blue-500" />, title: "Continuous Learning", desc: "Access premium books, tools, development subscriptions, and peer reviews." },
  { icon: <Star className="w-5 h-5 text-amber-500" />, title: "Real Impact", desc: "No coffee-runs. The code you write goes live to real campus users immediately." }
];

const POSITIONS = [
  { title: "React Frontend Developer Intern", type: "Part-time / Remote", term: "3 Months", desc: "Build responsive Liquid Glass pages and customize dashboard graphs in public." },
  { title: "Node.js Fullstack Intern", type: "Part-time / Remote", term: "3 Months", desc: "Optimize vector database routes, manage Supabase RLS logs, and integrate payment webhooks." },
  { title: "Campus Rep Coordinator", type: "Part-time / On-campus", term: "Flexible", desc: "Gather validation logs from student housing, onboard local print shops, and represent VANIKARA." }
];

export default function CareersPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "React Frontend Developer Intern",
    portfolio: "",
    coverLetter: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errors, setErrors] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !file) {
      setErrors("Full Name, Email Address, and Resume file are required.");
      return;
    }

    const allowedExtensions = /(\.pdf|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setErrors("Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors("Resume size cannot exceed 5MB.");
      return;
    }

    setErrors(null);
    setStatus("sending");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          
          const payload = {
            ...form,
            resumeBase64: base64Data,
            resumeFileName: file.name
          };

          const response = await fetch("/api/careers/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          
          let resData: any = null;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              resData = await response.json();
            } catch (jsonErr) {
              // Ignore json parse error here as we'll check response.ok next
            }
          }

          if (!response.ok) {
            throw new Error(resData?.error || `Server Error (${response.status}). Please try again later.`);
          }
          
          setStatus("success");
          setForm({
            name: "",
            email: "",
            phone: "",
            position: "React Frontend Developer Intern",
            portfolio: "",
            coverLetter: ""
          });
          setFile(null);
        } catch (postErr: any) {
          const friendlyMsg = postErr.message.includes("is not valid JSON")
            ? "Server returned an invalid response. Please try again later."
            : postErr.message;
          setErrors(friendlyMsg || "Failed to dispatch packet.");
          setStatus("idle");
        }
      };

      reader.onerror = () => {
        setErrors("Failed to read file.");
        setStatus("idle");
      };
    } catch (err: any) {
      const friendlyMsg = err.message.includes("is not valid JSON")
        ? "Server returned an invalid response. Please try again later."
        : err.message;
      setErrors(friendlyMsg || "Something went wrong. Please check fields and try again.");
      setStatus("idle");
    }
  };

  return (
    <PageContainer className="pb-24">
      <CareersScene />
      <PageHero
        tag="Join the Team"
        title={
          <>
            Engineering our <span className="gradient-text">Future</span>
          </>
        }
        subtitle="Help us build tomorrow through intelligence. We are seeking early student builders to grow our campus platforms."
      />

      {/* Culture Section */}
      <SectionContainer>
        <ContentContainer>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <FadeUp>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
                OUR CULTURE
              </span>
              <h2 className="font-display font-black text-2xl text-[var(--text-primary)] mt-1">
                Ecosystem Growth Benefits
              </h2>
            </FadeUp>
          </div>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((ben) => (
              <StaggerItem key={ben.title}>
                <Card hover className="h-full text-center flex flex-col items-center">
                  <CardBody className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-500/5 flex items-center justify-center">
                      {ben.icon}
                    </div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                      {ben.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {ben.desc}
                    </p>
                  </CardBody>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </ContentContainer>
      </SectionContainer>

      {/* Internship Positions */}
      <SectionContainer>
        <ContentContainer>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <FadeUp>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
                OPEN INTERNSHIPS
              </span>
              <h2 className="font-display font-black text-2xl text-[var(--text-primary)] mt-1">
                Collaborate on Active storyboards
              </h2>
            </FadeUp>
          </div>

          <StaggerGrid className="space-y-6 max-w-4xl mx-auto">
            {POSITIONS.map((pos) => (
              <StaggerItem key={pos.title}>
                <Card hover>
                  <CardBody className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                          {pos.title}
                        </h3>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-500/10 text-[var(--text-secondary)] border border-[var(--glass-border)]">
                          {pos.type}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                        {pos.desc}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-4">
                      <span className="text-xs font-bold text-[var(--accent-color)]">{pos.term}</span>
                      <button
                        onClick={() => {
                          setForm((prev) => ({ ...prev, position: pos.title }));
                          document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-4 py-2 bg-slate-500/5 hover:bg-[var(--accent-color)] hover:text-white rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--glass-border)] transition-all cursor-pointer active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  </CardBody>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </ContentContainer>
      </SectionContainer>

      {/* Application Form */}
      <SectionContainer id="apply-form">
        <FormContainer>
          <FadeUp>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-8 sm:p-12 shadow-xl">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)]/10 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32" />

              {status === "success" ? (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 bg-green-500/15 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-black text-xl text-[var(--text-primary)]">
                    Application Submitted!
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
                    Thanks for applying. We have saved your candidate profile, uploaded your resume, and dispatched alerts to the founding team. We will review your application shortly.
                  </p>
                  <Button onClick={() => setStatus("idle")} variant="ghost" size="sm" className="mt-4">
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-[var(--glass-border)] pb-4">
                    <h2 className="font-display font-black text-xl text-[var(--text-primary)] uppercase tracking-wider">
                      Internship Application
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Fill out the form below. Our founding team responds to applications weekly.
                    </p>
                  </div>

                  {errors && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-bold text-center animate-shake">
                      {errors}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder:text-[var(--text-secondary)]/40 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder:text-[var(--text-secondary)]/40 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder:text-[var(--text-secondary)]/40 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Target Position *
                        </label>
                        <select
                          value={form.position}
                          onChange={(e) => setForm({ ...form, position: e.target.value })}
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 font-semibold cursor-pointer select-none"
                        >
                          {POSITIONS.map((pos) => (
                            <option key={pos.title} value={pos.title} className="bg-slate-900 text-white font-medium">
                              {pos.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                          Portfolio / LinkedIn (Optional)
                        </label>
                        <input
                          type="url"
                          value={form.portfolio}
                          onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder:text-[var(--text-secondary)]/40 font-medium"
                        />
                      </div>
                    </div>

                    {/* Resume Upload File Field */}
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Resume Upload (PDF / DOCX) *
                      </label>
                      <div className="relative border-2 border-dashed border-[var(--glass-border)] rounded-xl p-4 bg-[var(--glass-bg)] hover:bg-slate-500/5 transition-all text-center flex flex-col items-center justify-center cursor-pointer select-none">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs text-[var(--text-primary)] font-bold">
                          {file ? file.name : "Select PDF or DOCX file (Max 5MB)"}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          Click to browse device documents
                        </span>
                        <input
                          type="file"
                          required
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                        Cover Letter / Bio Summary
                      </label>
                      <textarea
                        value={form.coverLetter}
                        onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                        placeholder="Tell us why you are interested in building with VANIKARA..."
                        className="w-full h-32 p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 placeholder:text-[var(--text-secondary)]/40 resize-none font-medium"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    variant="primary"
                    size="lg"
                    className="w-full py-4 uppercase tracking-widest text-xs font-black"
                  >
                    {status === "sending" ? "Encrypting Application Packet..." : "Submit Application Form"}
                  </Button>
                </form>
              )}

            </div>
          </FadeUp>
        </FormContainer>
      </SectionContainer>

    </PageContainer>
  );
}
