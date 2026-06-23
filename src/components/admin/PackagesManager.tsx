"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function PackagesManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/packages");
      const json = await res.json();
      setPackages(json.data || []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePackage = async (id: string, updates: any) => {
    try {
      await fetch("/api/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates })
      });
      fetchPackages();
    } catch (err) {
      console.error("Failed to update package:", err);
    }
  };

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading packages...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {(Array.isArray(packages) ? packages : []).map((pkg) => (
        <div key={pkg.id} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:border-blue-200 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all duration-700"></div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 capitalize">{pkg.name}</h3>
            <span className="text-[10px] text-slate-400 font-mono italic">ID: {pkg.id.slice(0,8)}</span>
          </div>

          <div className="mb-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Monthly Pricing</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">₹</span>
              <input 
                type="number" 
                value={pkg.price}
                onChange={(e) => updatePackage(pkg.id, { price: Number(e.target.value) })}
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xl font-black text-slate-900 w-full focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Feature Set</label>
            <div className="space-y-3">
              {(Array.isArray(pkg.features) ? pkg.features : []).map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100 group/item">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-sm shadow-blue-600/50"></div>
                  <input 
                    type="text" 
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(pkg.features || [])];
                      newFeatures[idx] = e.target.value;
                      updatePackage(pkg.id, { features: newFeatures });
                    }}
                    className="bg-transparent text-xs font-medium text-slate-600 w-full focus:outline-none focus:text-slate-900 transition-colors"
                  />
                  <button onClick={() => {
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     const newFeatures = (pkg.features || []).filter((_: any, i: number) => i !== idx);
                     updatePackage(pkg.id, { features: newFeatures });
                  }} className="text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover/item:opacity-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              const newFeatures = [...(pkg.features || []), "New Feature"];
              updatePackage(pkg.id, { features: newFeatures });
            }}
            className="w-full mt-8 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm shadow-slate-900/10 hover:shadow-blue-600/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>
      ))}
    </div>
  );
}
