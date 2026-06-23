"use client";

import { FadeUp } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import { Eye, ShieldAlert, Rocket } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

export default function OurVision() {
  return (
    <SectionContainer id="our-vision">
      <ContentContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
              OUR VISION
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              Transforming Student Lifestyles Through Intelligence
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-4">
              We imagine a future where campus operations, peer-to-peer sharing, and local student logistics are unified under a single responsive framework.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeUp delay={0.1}>
            <Card hover className="h-full">
              <CardBody className="space-y-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-[#1E6BD6] flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Ecosystem Focus
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Building isolated apps isn&apos;t enough. We are creating an interconnected ecosystem where assets in one platform (like Vanik (PG)) seamlessly unlock benefits in another (like FriskFree).
                </p>
              </CardBody>
            </Card>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Card hover className="h-full">
              <CardBody className="space-y-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 text-[#FF7A00] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Campus Trust
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  We verify listings, provide encrypted communications, and use secure integration hooks to ensure that student environments remain completely safe and fraud-free.
                </p>
              </CardBody>
            </Card>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Card hover className="h-full">
              <CardBody className="space-y-4 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-[#FFC400] flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Future Intelligence
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  With CYGMA AI, we will automate recommendation models, optimize PG housing search matrices, and help users query the system using natural speech prompts.
                </p>
              </CardBody>
            </Card>
          </FadeUp>
        </div>
      </ContentContainer>
    </SectionContainer>
  );
}
