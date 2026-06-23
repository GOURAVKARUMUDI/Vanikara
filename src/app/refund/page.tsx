"use client";

import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { Receipt, RefreshCw, Mail, HelpCircle } from "lucide-react";
import { FadeUp } from "@/components/Animate";

export default function RefundPage() {
  return (
    <div className="pb-24 bg-transparent">
      <PageHero
        tag="Legal Policies"
        title={<>Refund <span className="gradient-text">Policy</span></>}
        subtitle="Review the standard refund timelines, eligibility rules, and exception logs for transactions processed on VANIKARA."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
        <FadeUp>
          <div className="p-6 rounded-2xl text-xs sm:text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent-color)] font-semibold backdrop-blur-md shadow-sm">
            ℹ️ This policy covers refund eligibility for student custom thesis printing, digital subscriptions, and billing transactions coordinated through our authorized gateway portals.
          </div>
        </FadeUp>

        <div className="space-y-10">
          
          {/* Section 1 */}
          <FadeUp>
            <div className="space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[var(--accent-color)]" />
                1. Custom Thesis Printing & Binding Services
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
                <p>
                  Because custom textbook printing, document laminating, and thesis binding services are manufactured to unique user-submitted PDF files, **refunds are not issued once printing operations have commenced** at local partner print nodes.
                </p>
                <p>
                  If a printed order contains severe manufacturing defect parameters (e.g. mismatched pages order, incorrect binding styles) that deviate from submitted order specifications, you may request a free reprint or full credit refund by reporting the issue within **48 hours** of delivery.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Section 2 */}
          <FadeUp>
            <div className="space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[var(--accent-color)]" />
                2. Digital Workspaces & Subscriptions
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
                <p>
                  For paid CYGMA AI subscriptions or partner listing plans, billing refunds may be requested within **7 days** of transaction dates, provided token consumption totals are under **10%** of monthly quotas.
                </p>
                <p>
                  To request a subscription cancellation, access your user profile dashboard settings or dispatch a cancellation request to our billing support staff.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Section 3 */}
          <FadeUp>
            <div className="space-y-3">
              <h2 className="font-display font-black text-lg text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[var(--accent-color)]" />
                3. Refund Processing Timelines
              </h2>
              <div className="border-l-2 border-[var(--accent-color)] pl-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 font-medium">
                <p>
                  Approved refunds are processed to original payment methods (credit cards, UPI IDs, bank accounts) within **5 to 7 business days** of confirmation. Exact availability parameters depend on payment gateways and intermediate bank routers.
                </p>
              </div>
            </div>
          </FadeUp>

        </div>

        {/* Bottom CTA */}
        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-wrap gap-3">
          <Button href="/contact?subject=Refund Inquiry" variant="primary" className="gap-1.5 font-bold text-xs uppercase tracking-wide">
            <Mail className="w-4 h-4" /> Submit Billing Ticket
          </Button>
          <Button href="/terms" variant="ghost" className="font-bold text-xs uppercase tracking-wide">
            Terms of Service
          </Button>
        </div>

      </div>
    </div>
  );
}
