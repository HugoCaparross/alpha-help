"use client";

import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function Topbar() {
  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-end px-6">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm"
      >
        <LogOut size={18} />

        Cerrar sesión
      </button>
    </header>
  );
}