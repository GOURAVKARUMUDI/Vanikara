"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { createClient } from "@/utils/supabase/client";

export default function ClientsTable() {
  const { data: clientsRes, mutate: mutateClients, isLoading: clientsLoading } = useSWR("/api/clients", fetcher);
  const { data: packagesRes, isLoading: packagesLoading } = useSWR("/api/packages", fetcher);

  const clients = clientsRes?.data || [];
  const packages = packagesRes?.data || [];
  const loading = clientsLoading || packagesLoading;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime:clients")
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, () => {
        mutateClients();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutateClients]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateClient = async (id: string, updates: any) => {
    try {
      // If package changed, update amount automatically
      if (updates.package_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pkg = (Array.isArray(packages) ? packages : []).find((p: any) => p.id === updates.package_id);
        if (pkg) updates.amount = pkg.price;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutateClients({ ...clientsRes, data: clients.map((c: any) => c.id === id ? { ...c, ...updates } : c) }, false);

      await fetch("/api/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates })
      });
      mutateClients();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to update client:", err);
    }
  };

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading clients...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Client Portfolio</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Billing</th>
              <th className="px-6 py-4">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(Array.isArray(clients) ? clients : []).map((client) => (
              <tr key={client.id} className="text-slate-600 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                   <div className="font-bold text-slate-900">{client.name}</div>
                   <div className="text-[10px] text-slate-400 font-medium">{client.email}</div>
                </td>
                <td className="px-6 py-4">
                    <select
                      value={client.project_status}
                      onChange={(e) => updateClient(client.id, { project_status: e.target.value })}
                      className="text-[10px] font-black uppercase tracking-widest bg-slate-100 border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer"
                    >
                      <option value="idea">Idea</option>
                      <option value="building">Building</option>
                      <option value="testing">Testing</option>
                      <option value="launched">Launched</option>
                    </select>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={client.package_id || ""} 
                    onChange={(e) => updateClient(client.id, { package_id: e.target.value })}
                    className="bg-white border border-slate-200 text-[10px] rounded-lg px-2 py-1 outline-none focus:border-blue-600 font-black uppercase tracking-tight shadow-sm cursor-pointer"
                  >
                    <option value="">Select Package</option>
                    {(Array.isArray(packages) ? packages : []).map(pkg => (
                      <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                   <div className="text-sm font-black text-slate-900">₹{Number(client.amount).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                    client.payment_status === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {client.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
