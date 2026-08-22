import { StaggerGrid, StaggerItem } from '@/components/Animate';

const PROJECTS = [
  { tag: 'Marketplace', title: 'Vanik', desc: 'Second-hand marketplace with integrated binding and printing services for students.', stack: ['Next.js', 'Supabase', 'Vercel', 'Razorpay'], color: '#1E6BD6', bg: '#e8f0fe', emoji: '🛍️', metrics: [['2026', 'Started'], ['Beta', 'Phase'], ['65%', 'Progress']] },
  { tag: 'Discovery',    title: 'FriskFree', desc: 'Platform to find PGs and hostels based on university and location.', stack: ['React Native', 'Node.js', 'PostgreSQL', 'Google Maps'], color: '#FF7A00', bg: '#fff7ed', emoji: '🏠', metrics: [['2026', 'Started'], ['Backend', 'Phase'], ['35%', 'Progress']] },
  { tag: 'AI Ecosystem', title: 'CYGMA AI', desc: 'VANIKARA’s evolving AI ecosystem focused on intelligent automation.', stack: ['Python', 'LangChain', 'Next.js', 'OpenAI'], color: '#8B5CF6', bg: '#f5f3ff', emoji: '🧠', metrics: [['2026', 'Started'], ['Research', 'Phase'], ['15%', 'Progress']] },
];

export default function ProjectsGrid() {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map(({ tag, title, desc, stack, color, bg, emoji, metrics }) => (
            <StaggerItem key={title}>
              <article
                className="card-hover h-full rounded-2xl overflow-hidden border border-slate-100 bg-white"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}
              >
                {/* Card header strip */}
                <div className="p-6 flex items-start justify-between" style={{ background: bg }}>
                  <div>
                    <span
                      className="inline-block text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full text-white mb-2"
                      style={{ background: color }}
                    >{tag}</span>
                    <h2 className="font-extrabold text-slate-900 text-xl">{title}</h2>
                  </div>
                  <span className="text-4xl shrink-0 ml-2">{emoji}</span>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{desc}</p>
                  <div className="flex gap-4 mb-5">
                    {metrics.map(([val, lbl]) => (
                      <div key={String(lbl)}>
                        <div className="font-extrabold text-base" style={{ color }}>{val}</div>
                        <div className="text-[0.7rem] text-slate-400 mt-0.5">{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {stack.map(s => (
                      <span
                        key={s}
                        className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600"
                      >{s}</span>
                    ))}
                  </div>

                  <div className="pt-5 border-t border-slate-50">
                    <a href={`/contact?project=${encodeURIComponent(title)}`} 
                       className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                      Inquire About This <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
