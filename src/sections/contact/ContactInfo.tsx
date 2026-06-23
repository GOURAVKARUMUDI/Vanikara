"use client";

import React from "react";
import Card, { CardBody } from "@/components/ui/Card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/contact/ContactMap"), {
  ssr: false,
  loading: () => (
    <Card hover>
      <CardBody className="p-3">
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#070b16] border border-white/5 flex items-center justify-center animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest">
          Syncing map coordinates...
        </div>
      </CardBody>
    </Card>
  )
});

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      
      {/* Office Details Card */}
      <Card hover>
        <CardBody className="space-y-6">
          <h3 className="font-display font-black text-sm uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-3">
            Registered Company Details
          </h3>

          <div className="space-y-4">
            {/* Legal Entity Name */}
            <div className="text-xs">
              <span className="block font-bold text-[var(--text-primary)] uppercase tracking-wider text-[10px] mb-1">Company Name</span>
              <span className="text-[var(--text-primary)] font-extrabold text-sm">VANIKARA Intelligence Private Limited</span>
            </div>

            {/* Headquarters / Office Address */}
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-lg bg-slate-500/5 text-[var(--accent-color)] flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="text-xs">
                <span className="block font-bold text-[var(--text-primary)]">Registered Office</span>
                <span className="text-[var(--text-secondary)]">Andhra Pradesh, India</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-lg bg-slate-500/5 text-[var(--accent-color)] flex items-center justify-center shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="text-xs">
                <span className="block font-bold text-[var(--text-primary)]">Email Address</span>
                <a href="mailto:vanikara26@gmail.com" className="text-[var(--accent-color)] hover:underline">
                  vanikara26@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-lg bg-slate-500/5 text-[var(--accent-color)] flex items-center justify-center shrink-0">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div className="text-xs">
                <span className="block font-bold text-[var(--text-primary)]">Phone Contact</span>
                <a href="tel:+919494326826" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  +91 94943 26826
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-lg bg-slate-500/5 text-[var(--accent-color)] flex items-center justify-center shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div className="text-xs">
                <span className="block font-bold text-[var(--text-primary)]">Business Hours</span>
                <span className="text-[var(--text-secondary)]">Mon – Fri: 9:00 AM – 6:00 PM (IST)</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Interactive Map */}
      <ContactMap />

    </div>
  );
}
