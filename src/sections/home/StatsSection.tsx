"use client";

import React, { useEffect, useState, useRef } from "react";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Animate";
import Card, { CardBody } from "@/components/ui/Card";

interface CounterProps {
  end: number;
  suffix?: string;
}

function Counter({ end, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500; // ms
          const stepTime = Math.abs(Math.floor(duration / end));
          
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            }
          }, Math.max(stepTime, 15));
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <span ref={ref} className="font-display font-black text-4xl sm:text-5xl text-[var(--accent-color)]">
      {count}
      {suffix}
    </span>
  );
}

import { SectionContainer, ContentContainer } from "@/components/ui/Containers";

export default function StatsSection() {
  return (
    <SectionContainer id="statistics">
      <ContentContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">
              KEY METRICS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-2">
              VANIKARA in Numbers
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-4">
              Our growth, operations, and development stats since our company foundation.
            </p>
          </FadeUp>
        </div>

        <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <Card hover className="h-full text-center">
              <CardBody className="space-y-2">
                <Counter end={2} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Products Building
                </h3>
                <p className="text-[10px] text-slate-400">Vanik & FriskFree</p>
              </CardBody>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card hover className="h-full text-center">
              <CardBody className="space-y-2">
                <Counter end={3} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Founders
                </h3>
                <p className="text-[10px] text-slate-400">Charan, Gourav, Reddy</p>
              </CardBody>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card hover className="h-full text-center">
              <CardBody className="space-y-2">
                <Counter end={2026} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Founded Year
                </h3>
                <p className="text-[10px] text-slate-400">Established March 9</p>
              </CardBody>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card hover className="h-full text-center">
              <CardBody className="space-y-2">
                <Counter end={6} suffix="+" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Team Members
                </h3>
                <p className="text-[10px] text-slate-400">Expanding engineers & reps</p>
              </CardBody>
            </Card>
          </StaggerItem>
        </StaggerGrid>
      </ContentContainer>
    </SectionContainer>
  );
}
