"use client";

import { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
          U
        </div>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

          <a
            href="/perfil"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
          >
            <User size={18} />
            Perfil
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>

        </div>
      )}
    </div>
  );
}