"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Plus, Edit2, Trash2, Check, RefreshCw } from "lucide-react";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ProductsManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: "", name: "", category: "", description: "", availability: "concept" });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (p: any) => {
    setForm(p);
    setIsEditing(true);
  };

  const handleClear = () => {
    setForm({ id: "", name: "", category: "", description: "", availability: "concept" });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        handleClear();
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* List Products */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-display font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--accent-color)]" />
            Ecosystem Products (CMS)
          </h2>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-0.5">
            Add or modify core company products and catalog structures.
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 flex justify-center items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-color)]" /> Fetching products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl">
              No products configured. Use the form to configure the first catalog item.
            </div>
          ) : (
            products.map((p) => (
              <Card key={p.id} hover>
                <CardBody className="p-6 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-[var(--accent-color)] tracking-wider">
                      {p.category}
                    </span>
                    <h4 className="font-display font-black text-sm text-[var(--text-primary)] uppercase">
                      {p.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {p.description}
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-[10px] font-bold text-slate-400">
                      <span>Availability Status: <strong className="text-[var(--text-primary)] font-extrabold">{p.availability?.toUpperCase()}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-slate-500/5 hover:bg-slate-500/10 border border-[var(--glass-border)] rounded-xl text-slate-500 hover:text-[var(--text-primary)] transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Editor Form */}
      <div className="lg:col-span-5">
        <Card hover className="sticky top-28">
          <CardBody className="p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[var(--accent-color)]" />
              {isEditing ? "Modify Product details" : "Create New Product Card"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cygma Engine"
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Category</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Intelligent Automation"
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed product capabilities and specs..."
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-medium placeholder:text-slate-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-secondary)]">Availability Milestone</label>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-semibold select-none cursor-pointer"
                >
                  <option value="concept">Concept Research</option>
                  <option value="development">Development Phase</option>
                  <option value="beta">Beta Testing</option>
                  <option value="live">Live Production</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1 font-bold text-xs uppercase tracking-wide gap-1.5">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? "Saving..." : isEditing ? "Save Edits" : "Publish Product"}
                </Button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-5 py-3 border border-[var(--glass-border)] rounded-full text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:bg-slate-500/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
