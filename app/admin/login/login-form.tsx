"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace(from);
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm card p-8 shadow-soft">
        <h1 className="text-4xl font-black tracking-tighter italic text-brand-text mb-2">
          AMOB
        </h1>
        <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mb-8">
          Admin Access
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-bg/70 text-brand-text pl-10 pr-4 py-4 rounded-2xl outline-none border border-brand-border/60 focus:border-brand-border-strong transition placeholder:text-brand-muted font-bold"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-critical text-xs font-bold uppercase tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full btn btn-primary active:scale-95 disabled:opacity-40"
          >
            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
