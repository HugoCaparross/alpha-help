"use client";

import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function Topbar() {

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8">

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition"
      >
        <LogOut size={18} />

        Cerrar sesión
      </button>

    </header>
  );
}