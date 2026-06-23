"use client";
import Image from "next/image";

import ProjectsScene from "@/components/projects/ProjectsScene";
import { motion } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { FadeUp } from "@/components/Animate";
import { Hammer, CheckCircle, Hourglass, ArrowRight } from "lucide-react";

interface Project {
  title: string;
  tag: string;
  tagline: string;
  mockupUrl: string;
  problem: string;
  solution: string;
  stack: string[];
  status: string;
  statusIcon: React.ReactNode;
  progress: number;
  futurePlans: string;
  exploreHref: string;
}

const PROJECTS: Project[] = [
  {
    title: "Vanik",
    tag: "Campus Marketplace",
    tagline: "Simplifying book distribution and printing logistics for students.",
    mockupUrl: "/images/vanik_mockup.png",
    problem: "Students frequently spend excessive amounts of money on textbooks that they only use for a single semester. Simultaneously, organizing custom printing and thesis binding is slow, expensive, and scattered across multiple physical shops.",
    solution: "A unified marketplace where students can buy and sell second-hand textbooks directly. The platform features integrated local printing partners, letting users submit PDF assignments for binding and pickup with a single tap.",
    stack: ["Next.js", "Supabase RLS", "PostgreSQL", "Razorpay APIs", "TailwindCSS"],
    status: "Beta Testing Phase",
    statusIcon: <CheckCircle className="w-4 h-4 text-green-500" />,
    progress: 65,
    futurePlans: "Automate binding queues, optimize PDF analysis to calculate exact printing prices, and introduce a zero-waste textbook recycle program.",
    exploreHref: "/contact?project=Vanik"
  },
  {
    title: "FriskFree",
    tag: "PG & Hostel Finder",
    tagline: "Find safe, university-aligned PGs and hostels in minutes.",
    mockupUrl: "/images/friskfree_mockup.png",
    problem: "Students moving to new cities struggle to locate reliable, secure, and affordable accommodation. Offline brokers charge high fees, and online listings are often outdated, inaccurate, or missing critical campus distance parameters.",
    solution: "A location-aware PG finder that maps verified hostels directly around major universities. Students filter by amenities, gender, budget, and real walking distance. It bypasses brokers to connect students directly with host operators.",
    stack: ["React Native", "Node.js (Express)", "PostgreSQL", "Google Maps SDK", "AWS S3"],
    status: "Backend Architecture Phase",
    statusIcon: <Hammer className="w-4 h-4 text-orange-500" />,
    progress: 35,
    futurePlans: "Introduce 3D room tour walkthroughs, integrated student group rental matching, and automated rent payment logs.",
    exploreHref: "/contact?project=FriskFree"
  },
  {
    title: "CYGMA AI",
    tag: "Ecosystem Brain",
    tagline: "Powering smart discovery and automation protocols across student tools.",
    mockupUrl: "", // Render code/graphics mockup locally
    problem: "Campus marketplace matching and roommate searches are usually mechanical. Standard keyword search leaves students scrolling through hundreds of irrelevant results without capturing actual contextual intent.",
    solution: "An intelligent, unified AI routing engine. CYGMA processes natural language prompts (e.g., 'Find a quiet double room within 10 minutes walking of engineering block for under 8k') and automatically checks listings and maps.",
    stack: ["Python", "LangChain", "OpenAI GPT-4o", "Next.js APIs", "Vector Databases"],
    status: "Research & Prototype Phase",
    statusIcon: <Hourglass className="w-4 h-4 text-purple-500" />,
    progress: 15,
    futurePlans: "Deploy contextual roommate compatibility queries, auto-recommend book swaps, and automate administrative CRM lead updates.",
    exploreHref: "/ai"
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <ProjectsScene />
      <PageHero
        tag="Clinical & Commercial Launches"
        title={
          <>
            Our Product <span className="gradient-text">Storyboards</span>
          </>
        }
        subtitle="Every product we build at VANIKARA undergoes extensive validation and is designed like a flagship product launch."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-32">
        {PROJECTS.map((project, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={project.title}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              
              {/* Product Layout (Alternates left/right on desktop) */}
              <div 
                className={`lg:col-span-6 space-y-6 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <FadeUp>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)] bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3 py-1 rounded-full">
                    {project.tag}
                  </span>
                  
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-3">
                    {project.title}
                  </h2>
                  <p className="text-sm font-semibold text-[var(--text-primary)] opacity-80">
                    {project.tagline}
                  </p>

                  <div className="space-y-4 pt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    <p>
                      <strong>The Problem:</strong> {project.problem}
                    </p>
                    <p>
                      <strong>The Solution:</strong> {project.solution}
                    </p>
                    <p>
                      <strong>Future Roadmap:</strong> {project.futurePlans}
                    </p>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-500/5 border border-[var(--glass-border)] text-[var(--text-secondary)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-1.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--text-primary)]">
                      {project.statusIcon}
                      <span>{project.status}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-[var(--text-secondary)]">Progress:</span>
                      <span className="text-[var(--accent-color)]">{project.progress}%</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button href={project.exploreHref} variant="primary" size="md" magnetic className="inline-flex items-center gap-1.5">
                      Explore {project.title}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </FadeUp>
              </div>

              {/* Mockup Display Container */}
              <div 
                className={`lg:col-span-6 flex justify-center ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <FadeUp className="w-full">
                  {project.mockupUrl ? (
                    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 shadow-xl hover:scale-[1.02] transition-transform duration-500">
                      <Image
                        src={project.mockupUrl}
                        alt={`${project.title} App Mockup`}
                        className="w-full h-auto rounded-[1.6rem] object-cover"
                        width={640}
                        height={400}
                      />
                    </div>
                  ) : (
                    /* Render local interactive code mock for CYGMA AI */
                    <div className="w-full aspect-video rounded-[2rem] border border-[var(--glass-border)] bg-[#070b16] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                      
                      {/* Terminal header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          cygma-node-01.sh
                        </span>
                      </div>

                      {/* Terminal body */}
                      <div className="font-mono text-[10px] sm:text-xs text-indigo-400 space-y-2 py-4 relative z-10 flex-grow">
                        <p className="text-slate-500">&gt; npm run dev --experimental-cygma</p>
                        <p className="text-green-400">✔ Loaded Vector Database embeddings [14,560 vectors]</p>
                        <p className="text-green-400">✔ System router initialized on port :8080</p>
                        <p className="text-blue-400">&gt; Query: PG near University with laundry &lt; 9k</p>
                        <p className="text-yellow-400">&gt; Matches found: [GTB Hostel 8.5k, Stanza Maplewood 9.4k]</p>
                        <motion.span 
                          animate={{ opacity: [1, 0, 1] }} 
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="inline-block w-2 h-4 bg-indigo-400 ml-1"
                        />
                      </div>

                      {/* Footer logs */}
                      <div className="border-t border-white/5 pt-2 flex items-center justify-between relative z-10 text-[9px] font-mono text-slate-600">
                        <span>Status: Operational</span>
                        <span>Latency: 45ms</span>
                      </div>
                    </div>
                  )}
                </FadeUp>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
