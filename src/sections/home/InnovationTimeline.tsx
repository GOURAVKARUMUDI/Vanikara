"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { FadeUp } from "@/components/Animate";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileTimeline from "@/components/mobile/MobileTimeline";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

interface Milestone {
  phase: string;
  title: string;
  desc: string;
  date: string;
  details: string;
}

const MILESTONES: Milestone[] = [
  { 
    phase: "Phase 1", 
    title: "The Idea", 
    desc: "Three friends identify student campus inefficiencies and agree to launch a dedicated product hub.", 
    date: "Feb 2026",
    details: "During standard university coursework, our founders noticed that campus listings for second-hand textbooks and flatmate PG accommodations were disorganized and broker-controlled. They decided that a unified digital platform could cut out middleman fees and provide verified student logistics pipelines."
  },
  { 
    phase: "Phase 2", 
    title: "Planning & Validation", 
    desc: "Interviewing 100+ university students to narrow down pg finder (FriskFree) and textbook printing (Vanik) logistics.", 
    date: "Feb 2026",
    details: "We conducted structured focus interviews at campus hostels and academic departments. 82% of students reported delays in locating budget housing options and paying excessive fees. This validated our thesis that a direct geolocational finder and assignment print vendor network were highly demanded student utilities."
  },
  { 
    phase: "Phase 3", 
    title: "Company Incorporation", 
    desc: "VANIKARA Intelligence Private Limited is officially incorporated under the Companies Act, 2013.", 
    date: "April 17, 2026",
    details: "To formalize operations and protect IP cores, the company was officially registered as a private limited corporation in Andhra Pradesh, India. This legal framework allowed us to secure direct payment gateway APIs and build enterprise-grade database security compliance."
  },
  { 
    phase: "Phase 4", 
    title: "First Product Launch", 
    desc: "Beta release of Vanik campus marketplace supporting print and binding workflows.", 
    date: "April 2026",
    details: "Vanik's beta release allowed students to upload assignment PDFs directly to local partner shops, generating instant price calculations based on page count and binding options. This digitized the local printing ecosystem and reduced offline queue wait times by over 50%."
  },
  { 
    phase: "Phase 5", 
    title: "Current Growth", 
    desc: "Expanding operational PG discovery channels and scaling student accounts in public.", 
    date: "Present",
    details: "We are actively matching local hostel owners directly with students through geolocational listings. The administration dashboard was updated to filter inbound leads, track careers applications, and monitor live system diagnostic telemetry logs."
  },
  { 
    phase: "Phase 6", 
    title: "Future AI Vision", 
    desc: "Integrating CYGMA AI automation engines for voice-driven recommendation interfaces.", 
    date: "Future",
    details: "CYGMA AI will be integrated to execute semantic roommates searches and contract audits. Natural speech-to-text queries will allow students to locate housing, verify room amenities, and schedule rent invoices using conversational voice commands."
  },
];

export default function InnovationTimeline() {
  const containerRef = useRef<HTMLElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  // Track scroll inside container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SectionContainer id="innovation-timeline" ref={containerRef} className="overflow-hidden">
      <ContentContainer className="max-w-4xl">
        
        <div className="text-center mb-20">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
              INNOVATION TIMELINE
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              Our Journey of Milestones
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-4">
              Watch how our startup evolved from a shared dorm room conversation into a structured product ecosystem. Click any card to expand.
            </p>
          </FadeUp>
        </div>

        {isMobile ? (
          <MobileTimeline milestones={MILESTONES} />
        ) : (
          <div className="relative">
            {/* Vertical line background */}
            <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-200/20" />
            
            {/* Animated fill line */}
            <motion.div 
              className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-[#1E6BD6] via-[#FF7A00] to-[#FFC400] origin-top h-full"
              style={{ scaleY: scrollYProgress }}
            />

            <div className="space-y-12">
              {MILESTONES.map((item, index) => {
                const isEven = index % 2 === 0;
                const isExpanded = expandedIndex === index;

                return (
                  <div key={item.title} className="flex flex-col sm:flex-row relative">
                    
                    {/* Timeline Circle Node */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-[var(--bg-gradient)] border-2 border-[var(--accent-color)] z-10 shadow-md transition-colors" />

                     {/* Left Side Content (Desktop) */}
                    <div className="pl-10 sm:pl-0 sm:w-1/2 flex sm:justify-end sm:order-1">
                      {!isEven && (
                        <div className="hidden sm:block text-right pr-12 pt-1.5 select-none">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">{item.date}</span>
                        </div>
                      )}
                      {isEven && (
                        <FadeUp delay={0.05} className="w-full sm:max-w-md sm:pr-12 text-left sm:text-right">
                          <div 
                            onClick={() => toggleExpand(index)}
                            className={`p-6 rounded-3xl bg-[var(--glass-bg)] border transition-all duration-300 shadow-sm cursor-pointer select-none hover:scale-[1.01] ${
                              isExpanded ? "border-[var(--accent-color)]/40 shadow-md" : "border-[var(--glass-border)] hover:border-[var(--accent-color)]/20"
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                              {item.phase} <span className="sm:hidden">• {item.date}</span>
                            </span>
                            <h3 className="font-display font-black text-lg text-[var(--text-primary)] mt-1 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                              {item.desc}
                            </p>

                            {/* Expanded Details section */}
                            <motion.div
                              initial={false}
                              animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden text-left"
                            >
                              <div className="mt-3.5 text-[11px] text-[var(--text-secondary)] border-t border-[var(--glass-border)] pt-3.5 leading-relaxed font-semibold">
                                {item.details}
                              </div>
                            </motion.div>

                            <div className="flex justify-between items-center mt-4 text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]/50 border-t border-[var(--glass-border)]/50 pt-2.5">
                              <span>{isExpanded ? "Click to collapse" : "Click to view details"}</span>
                              <span className="font-bold text-sm leading-none">{isExpanded ? "−" : "+"}</span>
                            </div>
                          </div>
                        </FadeUp>
                      )}
                    </div>

                     {/* Right Side Content (Desktop) */}
                    <div className="pl-10 sm:pl-0 sm:w-1/2 flex sm:justify-start sm:order-2">
                      {isEven && (
                        <div className="hidden sm:block text-left pl-12 pt-1.5 select-none">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">{item.date}</span>
                        </div>
                      )}
                      {!isEven && (
                        <FadeUp delay={0.05} className="w-full sm:max-w-md sm:pl-12 text-left">
                          <div 
                            onClick={() => toggleExpand(index)}
                            className={`p-6 rounded-3xl bg-[var(--glass-bg)] border transition-all duration-300 shadow-sm cursor-pointer select-none hover:scale-[1.01] ${
                              isExpanded ? "border-[var(--accent-color)]/40 shadow-md" : "border-[var(--glass-border)] hover:border-[var(--accent-color)]/20"
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                              {item.phase} <span className="sm:hidden">• {item.date}</span>
                            </span>
                            <h3 className="font-display font-black text-lg text-[var(--text-primary)] mt-1 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                              {item.desc}
                            </p>

                            {/* Expanded Details section */}
                            <motion.div
                              initial={false}
                              animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden text-left"
                            >
                              <div className="mt-3.5 text-[11px] text-[var(--text-secondary)] border-t border-[var(--glass-border)] pt-3.5 leading-relaxed font-semibold">
                                {item.details}
                              </div>
                            </motion.div>

                            <div className="flex justify-between items-center mt-4 text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]/50 border-t border-[var(--glass-border)]/50 pt-2.5">
                              <span>{isExpanded ? "Click to collapse" : "Click to view details"}</span>
                              <span className="font-bold text-sm leading-none">{isExpanded ? "−" : "+"}</span>
                            </div>
                          </div>
                        </FadeUp>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ContentContainer>
    </SectionContainer>
  );
}
