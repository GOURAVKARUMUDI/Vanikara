"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowUpRight
} from "lucide-react";
import dynamic from "next/dynamic";

const CRMCharts = dynamic(() => import("./CRMCharts"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-xs text-slate-400 bg-slate-500/5 border border-[var(--glass-border)] rounded-[2rem] min-h-[300px] flex items-center justify-center font-medium animate-pulse">
      Syncing ecosystem metrics...
    </div>
  )
});

export default function CRMOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        setStats(json.data || null);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-zinc-500">Calculating stats...</div>;

  const cards = [
    { title: "Total Revenue", value: `₹0`, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Total Leads", value: stats?.totalLeads || 0, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Active Projects", value: "2", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Team Size", value: "6+", icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card) => (
        <div key={card.title} className="p-6 bg-white border border-slate-200 rounded-3xl relative overflow-hidden group hover:border-blue-200 transition-all shadow-sm">
          <div className={`p-3 ${card.bg} ${card.color} w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
            <card.icon className="w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-medium">{card.title}</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-3xl -mr-12 -mt-12"></div>
        </div>
      ))}

      <div className="md:col-span-2 lg:col-span-4 mt-8 bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight italic">Startup Progress</h3>
        <ul className="space-y-2 text-slate-600 font-medium">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            2 products in development (Vanik, FriskFree)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Team size: 6+ builders
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Early-stage startup (Founded Mar 9, 2026)
          </li>
        </ul>
      </div>

      <div className="md:col-span-2 lg:col-span-4 mt-8">
        <CRMCharts 
          leadsData={stats?.leadsOverTime || []} 
          revenueData={stats?.revenueByMonth || []} 
          conversionData={stats?.conversionData || []} 
        />
      </div>
    </div>
  );
}
