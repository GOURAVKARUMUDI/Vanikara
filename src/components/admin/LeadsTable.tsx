"use client";

import { useEffect, useState } from "react";
import { MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LeadsTable() {
  const [leads, setLeads] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lRes, cRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/clients")
      ]);
      const [lJson, cJson] = await Promise.all([lRes.json(), cRes.json()]);
      setLeads(lJson.data || []);
      setClients(cJson.data || []);
    } catch (err: any) {
      console.error("Failed to fetch leads:", err);
      setLeads([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const supabase = createClient();
    const channel = supabase
      .channel("realtime:leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      fetchData();
    } catch (err: any) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading leads...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Incoming Leads</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
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
              <tr key={lead.id} className="text-slate-600 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{lead.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{lead.email}</div>
                </td>
                <td className="px-6 py-4 uppercase text-[10px] font-bold text-slate-400 tracking-tight">{lead.source}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    isClientValue ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                    lead.status === 'new' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    lead.status === 'contacted' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
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
                        className="px-3 py-1 bg-blue-600 text-white text-[10px] rounded-lg shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-all font-black uppercase tracking-widest"
                      >
                        Convert
                      </button>
                    )}
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="text-[10px] font-black uppercase tracking-widest bg-slate-100 border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer"
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
