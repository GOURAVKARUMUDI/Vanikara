"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
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
    <div className="p-8 text-center text-xs text-fg-subtle bg-surface-sunken border border-[var(--glass-border)] rounded-[2rem] min-h-[300px] flex items-center justify-center font-medium animate-pulse">
      Syncing ecosystem metrics...
    </div>
  )
});

export default function CRMOverview() {
  const { data: response, error, isLoading } = useSWR("/api/admin/stats", fetcher);
  const stats = response?.data || null;

  if (isLoading) return <div className="p-8 text-zinc-500">Calculating stats...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load stats.</div>;

  const cards = [
    { title: "Total Revenue", value: `₹0`, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Total Leads", value: stats?.totalLeads || 0, icon: Target, color: "text-intel", bg: "bg-brand-blue/10" },
    { title: "Active Projects", value: stats?.totalProjects || 0, icon: Users, color: "text-intel", bg: "bg-brand-blue/10" },
    { title: "Team Size", value: stats?.totalUsers || 0, icon: TrendingUp, color: "text-ambition", bg: "bg-brand-orange/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card) => (
        <div key={card.title} className="p-6 bg-surface-raised border border-line rounded-3xl relative overflow-hidden group hover:border-brand-blue transition-all shadow-sm">
          <div className={`p-3 ${card.bg} ${card.color} w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
            <card.icon className="w-6 h-6" />
          </div>
          <p className="text-fg-subtle text-sm font-medium">{card.title}</p>
          <div className="flex items-end justify-between mt-1">
            <h3 className="text-3xl font-black text-fg tracking-tight">{card.value}</h3>
            <ArrowUpRight className="w-4 h-4 text-fg-muted" />
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 blur-3xl -mr-12 -mt-12"></div>
        </div>
      ))}

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
