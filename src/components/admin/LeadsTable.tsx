"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { createClient } from "@/utils/supabase/client";

export default function LeadsTable() {
  const { data: leadsRes, mutate: mutateLeads, isLoading: leadsLoading } = useSWR("/api/leads", fetcher);
  const { data: clientsRes, isLoading: clientsLoading } = useSWR("/api/clients", fetcher);

  const leads = leadsRes?.data || [];
  const clients = clientsRes?.data || [];
  const loading = leadsLoading || clientsLoading;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime:leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        mutateLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutateLeads]);

  const updateStatus = async (id: string, status: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutateLeads({ ...leadsRes, data: leads.map((l: any) => l.id === id ? { ...l, status } : l) }, false);
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      mutateLeads();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading leads...</div>;

  return (
    <div className="bg-surface-raised border border-line rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-line flex justify-between items-center">
        <h2 className="text-xl font-bold text-fg">Incoming Leads</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-sunken text-fg-subtle text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(Array.isArray(leads) ? leads : []).map((lead) => {
              const isClientValue = (Array.isArray(clients) ? clients : []).some(c => c.email === lead.email);
              return (
              <tr key={lead.id} className="text-fg-muted hover:bg-surface-sunken transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-fg">{lead.name}</div>
                  <div className="text-[10px] text-fg-subtle font-medium">{lead.email}</div>
                </td>
                <td className="px-6 py-4 uppercase text-[10px] font-bold text-fg-subtle tracking-tight">{lead.source}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    isClientValue ? 'bg-brand-blue text-intel border border-brand-blue' :
                    lead.status === 'new' ? 'bg-brand-blue text-intel border border-brand-blue' :
                    lead.status === 'contacted' ? 'bg-brand-orange text-ambition border border-brand-orange' :
                    lead.status === 'converted' ? 'bg-green-50 text-green-600 border border-green-100' :
                    'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {isClientValue ? 'client' : lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {!isClientValue && lead.status !== 'converted' && (
                      <button 
                        onClick={() => updateStatus(lead.id, 'converted')}
                        className="px-3 py-1 bg-brand-blue text-white text-[10px] rounded-lg shadow-sm shadow-brand-blue/20 hover:bg-brand-blue transition-all font-black uppercase tracking-widest"
                      >
                        Convert
                      </button>
                    )}
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="text-[10px] font-black uppercase tracking-widest bg-surface-sunken border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in progress">In Progress</option>
                      <option value="converted">Converted</option>
                    </select>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
