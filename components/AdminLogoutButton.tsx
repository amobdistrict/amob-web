"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.replace("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold uppercase italic tracking-wider text-brand-muted transition hover:bg-brand-surface-secondary/70 mt-1"
    >
      <LogOut size={18} /> Logout
    </button>
  );
}