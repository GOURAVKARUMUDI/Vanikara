"use client";

import { FadeUp } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";
import { Brain, Code2, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";
import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

const VALUES = [
  { icon: <Brain className="w-5 h-5 text-[#FF7A00]" />, title: "AI Innovation", desc: "Powering applications with state-of-the-art conversational agents, dynamic query routing, and real-time intelligence layers." },
  { icon: <Code2 className="w-5 h-5 text-[#1E6BD6]" />, title: "Engineering Excellence", desc: "Crafting robust, type-safe architectures with clean codebases, low latency, and highly optimized server environments." },
  { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, title: "Security Protocols", desc: "Enterprise-grade authorization and strict data isolation via row-level security and secure session management." },
  { icon: <Zap className="w-5 h-5 text-amber-500" />, title: "Automation Suite", desc: "Streamlining operations, scheduling background workflows, and automating campus services seamlessly." },
  { icon: <Layers className="w-5 h-5 text-indigo-500" />, title: "Scalability", desc: "Highly available infrastructure built to scale to thousands of active concurrent nodes without performance degradation." },
  { icon: <Sparkles className="w-5 h-5 text-[#FFC400]" />, title: "User Experience", desc: "Gorgeous glassmorphic designs, responsive interfaces, micro-animations, and fluid user workflows." },
];

export default function WhyChooseUs() {
  return (
    <SectionContainer id="why-choose-us">
      <ContentContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <FadeUp>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
                WHY CHOOSE US
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2">
                Uncompromising Standards in Design and Speed
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                At VANIKARA, we design products with meticulous attention to detail, matching the smooth visual feedback and usability of world-class web products.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Whether you are a student utilizing our marketplace, a partner collaborating on new modules, or an investor tracking our roadmap, you can count on reliable, verified execution.
              </p>
            </FadeUp>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((val, i) => (
              <FadeUp key={val.title} delay={i * 0.08}>
                <Card hover className="h-full">
                  <CardBody className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-500/5 flex items-center justify-center">
                      {val.icon}
                    </div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                      {val.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {val.desc}
                    </p>
                  </CardBody>
                </Card>
              </FadeUp>
            ))}
          </div>

        </div>
      </ContentContainer>
    </SectionContainer>
  );
}
