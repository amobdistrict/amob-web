'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Edit3, Trash2, Loader2 } from 'lucide-react';

export default function InventoryDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const { data } = await supabase.from('products').select('*, product_skus(quantity)');
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all variations?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else setProducts(products.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <div className="card p-8 text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-accent" size={28} />
          <p className="font-black uppercase tracking-[0.3em] text-brand-muted">Loading AMOB Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text p-6 sm:p-8 pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">AMOB Admin</p>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter sm:text-5xl">Vault Inventory</h1>
          </div>
          <Link href="/admin/products/new" className="btn btn-primary w-full sm:w-auto">
            + Add New Piece
          </Link>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-brand-border/40 bg-brand-surface-secondary/40">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">Piece</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">Base Price</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">Stock Status</th>
                <th className="p-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const total = p.product_skus?.reduce((acc: number, s: any) => acc + s.quantity, 0) || 0;
                return (
                  <tr key={p.id} className="border-b border-brand-border/20 transition-colors hover:bg-brand-surface-secondary/20">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {p.images?.[0] && <img src={p.images[0]} className="h-12 w-12 rounded-xl border border-brand-border/40 object-cover" />}
                        <span className="text-lg font-black uppercase italic">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-brand-muted">₦{p.base_price.toLocaleString()}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${total > 5 ? 'bg-success' : total > 0 ? 'bg-warning' : 'bg-critical'}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text">{total} Units</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/products/${p.id}`} className="rounded-full border border-brand-border/40 bg-brand-bg/60 p-3 text-brand-text transition-all hover:bg-brand-surface-secondary/70">
                          <Edit3 size={16} />
                        </Link>
                        <button onClick={() => deleteProduct(p.id, p.name)} className="rounded-full border border-brand-border/40 bg-brand-bg/60 p-3 text-critical transition-all hover:bg-critical-light">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}