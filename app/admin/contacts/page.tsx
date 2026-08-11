"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Save, CheckCircle } from "lucide-react";

export default function AdminContactDetailsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    instagram_url: "",
  });

  // Fetch current details from Supabase row 1 on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setForm({
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          contact_address: data.contact_address || "",
          instagram_url: data.instagram_url || "",
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  // Save the changes back to row 1
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const { error } = await supabase
      .from("site_settings")
      .update({
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        contact_address: form.contact_address,
        instagram_url: form.instagram_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      alert("Error saving settings data: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg text-brand-text">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-8 pt-20 text-brand-text">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Contact Settings</h1>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-muted">
          Update the global contact information displayed across your store website
        </p>
      </div>

      <form onSubmit={handleSave} className="card space-y-6 p-8">
        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 p-4 text-xs font-bold uppercase tracking-wide text-success">
            <CheckCircle size={16} /> Changes saved successfully!
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-brand-muted">Support Email Address</label>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            className="w-full rounded-2xl border border-brand-border/40 bg-brand-bg/70 p-4 text-sm font-medium outline-none transition-colors focus:border-brand-border-strong"
            placeholder="e.g. support@amob.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-brand-muted">Business Phone Number</label>
          <input
            type="text"
            value={form.contact_phone}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            className="w-full rounded-2xl border border-brand-border/40 bg-brand-bg/70 p-4 text-sm font-medium outline-none transition-colors focus:border-brand-border-strong"
            placeholder="e.g. +234 810 000 0000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-brand-muted">Physical Address / Headquarters</label>
          <input
            type="text"
            value={form.contact_address}
            onChange={(e) => setForm({ ...form, contact_address: e.target.value })}
            className="w-full rounded-2xl border border-brand-border/40 bg-brand-bg/70 p-4 text-sm font-medium outline-none transition-colors focus:border-brand-border-strong"
            placeholder="e.g. Victoria Island, Lagos"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-brand-muted">Instagram Profile URL</label>
          <input
            type="url"
            value={form.instagram_url}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
            className="w-full rounded-2xl border border-brand-border/40 bg-brand-bg/70 p-4 text-sm font-medium outline-none transition-colors focus:border-brand-border-strong"
            placeholder="e.g. https://instagram.com/amob"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-xs font-black uppercase tracking-widest text-brand-text transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} /> Update Contact Details
            </>
          )}
        </button>
      </form>
    </div>
  );
}