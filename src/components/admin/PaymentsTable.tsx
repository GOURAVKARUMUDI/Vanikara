"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { createClient } from "@/utils/supabase/client";

export default function PaymentsTable() {
  const { data: paymentsRes, mutate: mutatePayments, isLoading: loading } = useSWR("/api/admin/payments", fetcher);
  
  const payments = paymentsRes?.data || [];

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime:payments")
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => {
        mutatePayments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutatePayments]);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading payments...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Financial Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(Array.isArray(payments) ? payments : []).map((payment) => (
              <tr key={payment.id} className="text-slate-600 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium">
                  <div className="text-slate-900 font-bold">{payment.clients?.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{payment.clients?.email}</div>
                </td>
                <td className="px-6 py-4 font-black text-slate-900 tracking-tight">₹{Number(payment.amount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    payment.status === 'success' ? 'bg-green-50 text-green-600 border-green-100' :
                    payment.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{payment.method}</td>
                <td className="px-6 py-4 text-[10px] font-medium text-slate-400 italic">{new Date(payment.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
