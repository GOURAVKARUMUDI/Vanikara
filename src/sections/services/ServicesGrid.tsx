import { StaggerGrid, StaggerItem } from '@/components/Animate';
import Card, { CardBody } from '@/components/ui/Card';

const SERVICES = [
  { icon: '🛍️', title: 'Student Marketplaces',  desc: 'Creating interconnected ecosystems for campuses where students can trade and access services seamlessly.', features: ['Second-Hand Goods', 'Integrated Services', 'Campus Delivery', 'Secure Transactions'] },
  { icon: '🔍', title: 'Discovery Systems', desc: 'Building platforms that help students navigate their surroundings, from finding accommodations to exploring local resources.', features: ['Smart Search', 'Location-Based', 'Verified Listings', 'Personalised Feeds'] },
  { icon: '🧠', title: 'AI Ecosystems',        desc: 'Evolving intelligent systems designed to automate workflows and create future digital experiences.', features: ['Custom LLMs', 'Workflow Automation', 'Predictive Insights', 'Natural Language Interfaces'] },
  { icon: '🚀', title: 'Startup Innovation',         desc: 'Rapidly prototyping and deploying new ideas to solve everyday problems effectively.', features: ['Agile Development', 'User-Centric Design', 'Continuous Delivery', 'Scalable Architecture'] },
  { icon: '⚡', title: 'Intelligent Automation',          desc: 'Replacing manual processes with smart, automated pipelines that increase efficiency and reduce errors.', features: ['Process Optimisation', 'Data Integration', 'Real-Time Sync', 'Task Scheduling'] },
  { icon: '🎨', title: 'Modern UX Design',            desc: 'Crafting intuitive, engaging, and highly performant interfaces that users genuinely enjoy interacting with.', features: ['Responsive Layouts', 'Micro-Animations', 'Accessibility', 'Dark/Light Modes'] },
];

export default function ServicesGrid() {
  return (
    <section id="services-grid" className="py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon, title, desc, features }) => (
            <StaggerItem key={title}>
              <Card className="h-full">
                <CardBody>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 bg-slate-500/5 border border-[var(--glass-border)]">{icon}</div>
                  <h2 className="font-bold text-[var(--text-primary)] text-lg mb-2.5">{title}</h2>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">{desc}</p>
                  <ul className="space-y-1.5 list-none p-0 flex-1">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--accent-color)] font-bold shrink-0">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
                    <a href={`/contact?service=${encodeURIComponent(title)}`} 
                       className="text-xs font-bold text-[var(--accent-color)] hover:opacity-85 flex items-center gap-1 group">
                      Get a Quote <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                  </div>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
