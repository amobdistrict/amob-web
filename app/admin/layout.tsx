"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Truck,
  Layers,
  Menu,
  X,
  FileText,
  Mail,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-brand-muted">
        Core
      </p>

      <Link
        href="/admin/dashboard"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link
        href="/admin"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <Layers size={18} />
        Site Content
      </Link>

      <Link
        href="/admin/inventory"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <Package size={18} />
        Inventory Hub
      </Link>

      <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-8 mb-4 text-brand-muted">
        Operations
      </p>

      <Link
        href="/admin/orders"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <ShoppingCart size={18} />
        Orders
      </Link>

      <Link
        href="/admin/shipping"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <Truck size={18} />
        Shipping
      </Link>

      <Link
        href="/admin/customers"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <Users size={18} />
        Customers
      </Link>

      <Link
        href="/admin/contacts"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <Mail size={18} />
        Contacts
      </Link>

      <Link
        href="/admin/policies"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <FileText size={18} />
        Policies
      </Link>

      <hr className="border-brand-border/40 my-6" />

      <Link
        href="/admin/settings"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-brand-surface-secondary/70 font-bold uppercase text-xs transition-all"
      >
        <Settings size={18} />
        Settings
      </Link>

      <AdminLogoutButton />
    </>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <aside className="hidden lg:flex w-72 bg-brand-bg text-brand-text p-8 sticky top-0 h-screen flex-col justify-between border-r border-brand-border/40">
        <div>
          <h2 className="text-3xl font-black italic mb-12 text-brand-text">
            AMOB
            <br />
            ADMIN
          </h2>
          <nav className="space-y-1">{links}</nav>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-surface border-b border-brand-border/40 text-brand-text flex items-center justify-between px-4 z-50">
        <h2 className="font-black text-lg italic">AMOB ADMIN</h2>
        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-72 h-screen bg-brand-surface text-brand-text p-8 z-50 overflow-y-auto border-r border-brand-border/40">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-black text-2xl italic">
                AMOB
                <br />
                ADMIN
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="space-y-1">{links}</nav>
          </aside>
        </>
      )}

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="min-h-screen bg-brand-bg text-brand-text">{children}</div>
      </main>
    </div>
  );
}