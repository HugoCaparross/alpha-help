"use client";

import { useEffect, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();

      setProfile(data);
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100 transition"
      >
        <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
          {profile?.email?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-900 max-w-[180px] truncate">
            {profile?.email || "Usuario"}
          </p>

          <p className="text-xs text-slate-500">
            {profile?.role === "admin" ? "Administrador" : "Usuario"}
          </p>
        </div>

        <ChevronDown size={18} className="text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900 truncate">
              {profile?.email || "Usuario"}
            </p>

            <p className="text-xs text-slate-500">{profile?.region || ""}</p>
          </div>

          <a
            href="/perfil"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition"
          >
            <User size={18} />
            Perfil
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
