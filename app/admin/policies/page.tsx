"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2, GripVertical, Save, X } from "lucide-react";

type Policy = {
  id: string;
  title: string;
  content: string;
  order_index: number;
  is_active: boolean;
};

const empty = (): Omit<Policy, "id"> => ({
  title: "",
  content: "",
  order_index: 0,
  is_active: true,
});

export default function PoliciesAdmin() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(empty());

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("policies")
      .select("*")
      .order("order_index", { ascending: true });
    setPolicies(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!draft.title.trim() || !draft.content.trim()) return alert("Title and content are required.");
    setSaving("new");
    const { error } = await supabase.from("policies").insert([{ ...draft, order_index: policies.length }]);
    if (error) alert("Failed to save policy.");
    else { setCreating(false); setDraft(empty()); fetch(); }
    setSaving(null);
  };

  const update = async (p: Policy) => {
    setSaving(p.id);
    const { error } = await supabase.from("policies").update({
      title: p.title, content: p.content, is_active: p.is_active,
    }).eq("id", p.id);
    if (error) alert("Failed to update.");
    else { setEditing(null); fetch(); }
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this policy?")) return;
    await supabase.from("policies").delete().eq("id", id);
    fetch();
  };

  const toggleActive = async (p: Policy) => {
    await supabase.from("policies").update({ is_active: !p.is_active }).eq("id", p.id);
    fetch();
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-brand-muted" size={28} />
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl p-8 pt-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase italic">Policies</h1>
          <p className="mt-1 text-sm font-bold uppercase text-brand-muted">
            Shown in the checkout policy tab
          </p>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-xs font-black uppercase text-brand-text"
        >
          <Save size={14} /> Add Policy
        </button>
      </div>

      {creating && (
        <div className="card mb-6 space-y-4 p-6">
          <h2 className="text-sm font-black uppercase">New Policy</h2>
          <input
            placeholder="Policy Title (e.g. Return Policy)"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full rounded-xl border border-brand-border/40 bg-brand-bg/70 p-3 text-sm font-bold outline-none focus:border-brand-border-strong"
          />
          <textarea
            placeholder="Policy content..."
            value={draft.content}
            rows={6}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            className="w-full resize-none rounded-xl border border-brand-border/40 bg-brand-bg/70 p-3 text-sm outline-none focus:border-brand-border-strong"
          />
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving === "new"}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-black uppercase text-brand-text disabled:opacity-50"
            >
              {saving === "new" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save
            </button>
            <button
              onClick={() => { setCreating(false); setDraft(empty()); }}
              className="flex items-center gap-2 rounded-xl border border-brand-border/40 px-5 py-2.5 text-xs font-black uppercase text-brand-text"
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {policies.length === 0 && !creating && (
          <div className="rounded-2xl border border-dashed border-brand-border/40 py-16 text-center text-sm font-bold uppercase text-brand-muted">
            No policies yet. Add your first one.
          </div>
        )}

        {policies.map((p) => (
          <div key={p.id} className="card p-6">
            {editing?.id === p.id ? (
              <div className="space-y-4">
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full rounded-xl border border-brand-border/40 bg-brand-bg/70 p-3 text-sm font-bold outline-none focus:border-brand-border-strong"
                />
                <textarea
                  value={editing.content}
                  rows={6}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full resize-none rounded-xl border border-brand-border/40 bg-brand-bg/70 p-3 text-sm outline-none focus:border-brand-border-strong"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => update(editing)}
                    disabled={saving === p.id}
                    className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-black uppercase text-brand-text disabled:opacity-50"
                  >
                    {saving === p.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex items-center gap-2 rounded-xl border border-brand-border/40 px-5 py-2.5 text-xs font-black uppercase text-brand-text"
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-sm font-black uppercase">{p.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                        p.is_active
                          ? 'bg-success/15 text-success'
                          : 'bg-brand-surface-secondary/40 text-brand-muted'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-brand-muted">{p.content}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleActive(p)}
                    className="rounded-lg border border-brand-border/40 px-3 py-1.5 text-[10px] font-black uppercase text-brand-text hover:bg-brand-surface-secondary/40"
                  >
                    {p.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => { setEditing(p); setCreating(false); }}
                    className="rounded-lg border border-brand-border/40 px-3 py-1.5 text-[10px] font-black uppercase text-brand-text hover:bg-brand-surface-secondary/40"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-lg p-1.5 text-critical hover:bg-critical-light"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}