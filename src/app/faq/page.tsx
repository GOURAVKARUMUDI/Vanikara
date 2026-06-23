"use client";

import React, { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ChevronDown, ChevronUp, MessageSquare, HelpCircle, ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/Animate";

interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "CYGMA AI" | "Services" | "Security";
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const faqs: FAQItem[] = [
    {
      category: "General",
      question: "What is VANIKARA Intelligence Private Limited?",
      answer: "VANIKARA is an Indian technology company crafting high-performance digital ecosystems. We build unified student workspaces, custom print-binding logistics, vector search modules, and secure cloud platforms designed for scalability."
    },
    {
      category: "CYGMA AI",
      question: "How does the CYGMA AI Workspace process document context?",
      answer: "When you upload files (such as PDFs, DOCX, or CSVs) to your context sidebar, CYGMA extracts and segments the text. It computes localized vector embeddings and indexes them using a temporary Retrieval-Augmented Generation (RAG) algorithm to ground answers. Guest uploads are processed in transient memory and deleted instantly, while authenticated workspace context persists securely on our DB nodes."
    },
    {
      category: "Services",
      question: "How does the thesis printing and binding workflow operate?",
      answer: "Students and researchers can customize their thesis layouts, pick binding formats (hardcover, softcover, coordinates colors), upload their documents, and complete payments via Stripe. Our logistics module tracks progress from printing to last-mile dispatch, coordinating updates on your Client Portal dashboard."
    },
    {
      category: "Security",
      question: "How is my data protected on the platform?",
      answer: "We enforce strict row-level security (RLS) policies inside our database clusters. All data payloads in transit use TLS 1.3 encryption, and sensitive keys use cryptographically secure hashes. We do not inspect user context or train models on user conversation nodes."
    },
    {
      category: "CYGMA AI",
      question: "Is there a usage limit for the AI model router?",
      answer: "Yes. Guest users are allocated a cap of 50 requests per 24-hour cycle. Authenticated workspaces have customized query budgets depending on their current package. You can monitor your token usage dynamically from the telemetry panel in the Graphics & Performance modal."
    },
    {
      category: "Services",
      question: "What is the standard refund policy for orders?",
      answer: "Inquiries regarding printing cancellations or binding updates can be logged via support channels. Refunds for processing errors are dispatched within 5-7 business days to the initial payment source, subject to terms defined in our Refund Policy page."
    }
  ];

  const categories = ["All", "General", "CYGMA AI", "Services", "Security"];

  const filteredFaqs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Support Node"
        title={<>Frequently Asked <span className="gradient-text">Questions</span></>}
        subtitle="Learn about the VANIKARA student ecosystem, CYGMA AI grounding indexes, and print-binding logistics parameters."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-10">
        
        {/* Category selector */}
        <div className="flex flex-wrap gap-2 justify-center select-none bg-[var(--glass-bg)] border border-[var(--glass-border)] p-1.5 rounded-2xl w-fit mx-auto backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[var(--accent-color)] text-white shadow-md"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <FadeUp key={idx} delay={idx * 0.05}>
                <Card className="overflow-hidden">
                  <button
                    onClick={() => toggleOpen(idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer outline-none select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-[var(--accent-color)] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-display uppercase tracking-wide">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-[var(--glass-border)] animate-in fade-in duration-300">
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                        {faq.answer}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase text-[var(--accent-color)] tracking-wider">
                        <span>Category: {faq.category}</span>
                      </div>
                    </div>
                  )}
                </Card>
              </FadeUp>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-xs text-[var(--text-secondary)] font-semibold text-center sm:text-left">
            Still have questions? Our support desk coordinates direct replies 24/7.
          </div>
          <div className="flex gap-3">
            <Button href="/contact" variant="primary" className="gap-1 text-xs uppercase font-bold tracking-wider">
              Log Ticket <MessageSquare className="w-4 h-4" />
            </Button>
            <Button href="/ai" variant="ghost" className="gap-1 text-xs uppercase font-bold tracking-wider">
              Ask Cygma <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
