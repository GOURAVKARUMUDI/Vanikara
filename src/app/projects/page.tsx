"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { FadeUp } from "@/components/Animate";
import { Utensils, Heart, Brain, ArrowRight, CheckCircle, Hourglass } from "lucide-react";

interface Project {
  title: string;
  tag: string;
  tagline: string;
  icon: React.ReactNode;
  problem: string;
  solution: string;
  features: string[];
  status: string;
  statusIcon: React.ReactNode;
  progress: number;
  targetMarket: string;
  exploreHref: string;
  color: string;
}

const PROJECTS: Project[] = [
  {
    title: "FoodDine Pro",
    tag: "Subscription-Based Food Delivery",
    tagline: "Zero commission. Fixed subscription. Maximum growth for restaurants.",
    icon: <Utensils className="w-6 h-6" />,
    problem: "Traditional food delivery platforms charge 25-30% commission per order, eating into restaurant profits. This makes scaling difficult and pricing inconsistent.",
    solution: "A subscription-based model where restaurants pay a fixed monthly fee instead of per-order commissions. Restaurants get better profit margins, predictable costs, and full control over pricing.",
    features: [
      "Variable tiered subscriptions based on restaurant income",
      "Restaurant dashboard with real-time analytics",
      "Order management & delivery tracking",
      "Customer reviews & ratings system",
      "Payment integration (Razorpay, Stripe)",
      "Multi-city expansion support"
    ],
    status: "Development Phase",
    statusIcon: <Hourglass className="w-4 h-4 text-orange-500" />,
    progress: 40,
    targetMarket: "Guntur, Vijayawada, Andhra Pradesh (Initial Launch)",
    exploreHref: "/contact?project=FoodDine",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "EduShield Insurance",
    tag: "Student Insurance Platform",
    tagline: "Affordable insurance products designed specifically for students.",
    icon: <Heart className="w-6 h-6" />,
    problem: "Students lack affordable, tailored insurance products. Traditional insurance policies are complex and don't address student-specific needs like accident coverage, health emergencies, or device protection.",
    solution: "A digital platform offering curated insurance products in collaboration with educational institutions. Students get affordable premiums, instant claims processing, and institutional partnerships for special discounts.",
    features: [
      "Health insurance for students",
      "Accidental death & disability coverage",
      "Personal device protection",
      "Institutional partnership programs",
      "Digital claim submission & tracking",
      "Quote generation in minutes"
    ],
    status: "Partnership Phase",
    statusIcon: <Hourglass className="w-4 h-4 text-purple-500" />,
    progress: 25,
    targetMarket: "Educational Institutions (Colleges & Universities)",
    exploreHref: "/contact?project=EduShield",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "DataLabel Hub",
    tag: "Data Annotation Platform",
    tagline: "High-quality data labeling powered by BARG collaboration.",
    icon: <Brain className="w-6 h-6" />,
    problem: "AI/ML projects require massive amounts of accurately labeled data. Finding reliable annotators and maintaining quality is time-consuming and expensive.",
    solution: "A collaborative platform with BARG INFO SOLUTIONS providing skilled data annotators, quality assurance, and project management tools. Companies get quality-assured labeled datasets on schedule.",
    features: [
      "Image, text, & video annotation",
      "Real-time quality metrics & scoring",
      "Annotator management dashboard",
      "Task distribution & tracking",
      "API for direct integration",
      "50-50 revenue sharing model"
    ],
    status: "Active Operations",
    statusIcon: <CheckCircle className="w-4 h-4 text-green-500" />,
    progress: 60,
    targetMarket: "AI/ML Companies, Tech Startups, Enterprises",
    exploreHref: "/contact?project=DataLabel",
    color: "from-blue-500 to-cyan-500"
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <PageHero
        tag="Business Segments"
        title={
          <>
            Our Active <span className="gradient-text">Projects</span>
          </>
        }
        subtitle="VANIKARA Intelligence operates three distinct business segments, each designed to solve real-world problems for specific markets."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-24">
        {PROJECTS.map((project, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={project.title}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Content - Left/Right alternating */}
              <div
                className={`space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                <FadeUp>
                  {/* Icon & Tag */}
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-10`}>
                      <div className={`text-transparent bg-gradient-to-br ${project.color} bg-clip-text`}>
                        {project.icon}
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)]">
                      {project.tag}
                    </span>
                  </div>

                  <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-sm font-semibold text-[var(--text-primary)] opacity-80">
                    {project.tagline}
                  </p>

                  <div className="space-y-4 pt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    <p>
                      <strong>Problem:</strong> {project.problem}
                    </p>
                    <p>
                      <strong>Solution:</strong> {project.solution}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-4">
                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Key Features:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                          <span className={`text-transparent bg-gradient-to-r ${project.color} bg-clip-text font-bold`}>✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status & Target Market */}
                  <div className="space-y-3 pt-4 border-t border-[var(--glass-border)] pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Status:</span>
                      <div className="flex items-center gap-1.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3 py-1 rounded-full">
                        {project.statusIcon}
                        <span className="text-xs font-bold text-[var(--text-primary)]">{project.status}</span>
                      </div>
                      <span className={`text-transparent bg-gradient-to-r ${project.color} bg-clip-text font-bold text-xs`}>
                        {project.progress}% Complete
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      <strong>Target Market:</strong> {project.targetMarket}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button href={project.exploreHref} variant="primary" size="md" magnetic className="inline-flex items-center gap-1.5">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </FadeUp>
              </div>

              {/* Visual Card */}
              <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <FadeUp>
                  <div className={`relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-gradient-to-br ${project.color} bg-opacity-5 p-8 h-80 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500`}>
                    {/* Decorative gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-5`} />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-20 border border-[var(--glass-border)] flex items-center justify-center mb-4`}>
                        <div className={`text-transparent bg-gradient-to-br ${project.color} bg-clip-text text-2xl`}>
                          {project.icon}
                        </div>
                      </div>
                      <h3 className={`font-display font-black text-2xl text-transparent bg-gradient-to-r ${project.color} bg-clip-text mb-2`}>
                        {project.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Bottom badge */}
                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                      <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Learn More →</span>
                      <div className={`text-transparent bg-gradient-to-r ${project.color} bg-clip-text font-bold`}>
                        {project.progress}%
                      </div>
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 mt-32">
        <FadeUp>
          <div className="text-center space-y-6 py-16 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-8">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)]">
              Ready to Get Started?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
              Whether you're a restaurant looking for better margins, a student seeking affordable insurance, or a company needing quality data annotation, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button href="/contact" variant="primary" size="md" magnetic>
                Get In Touch
              </Button>
              <Button href="/about" variant="secondary" size="md" magnetic>
                About VANIKARA
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
