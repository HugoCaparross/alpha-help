"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronDown, LogOut, User } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";
import type { UserProfile } from "@/types/user";

export default function UserMenu() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const data = await getProfile();

        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Error loading profile";

          setError(message);
        }

        console.error("Failed to load profile:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();

      router.replace("/login");
    } catch (err) {
      console.error("Failed to logout:", err);

      setError("Error closing session");
    }
  }

  if (error) {
    return (
      <div className="user-menu-error">
        <div className="user-menu-avatar user-menu-avatar--error">!</div>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menú de usuario"
        aria-expanded={open}
        aria-haspopup="menu"
        className="user-menu-trigger"
        disabled={isLoading}
      >
        <div className="user-menu-avatar">
          {isLoading ? "..." : profile?.email?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="user-menu-text">
          <p className="user-menu-email">
            {isLoading ? "Cargando..." : profile?.email || "Usuario"}
          </p>

          <p className="user-menu-role">
            {profile?.role === "admin" ? "Administrador" : "Usuario"}
          </p>
        </div>

        <ChevronDown size={18} className="user-menu-chevron" />
      </button>

      {open && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-dropdown-header">
            <p className="user-menu-dropdown-email">
              {profile?.email || "Usuario"}
            </p>

            <p className="user-menu-dropdown-region">{profile?.region || ""}</p>
          </div>

          <Link
            href="/perfil"
            className="user-menu-dropdown-item"
            role="menuitem"
          >
            <User size={18} />
            Perfil
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="user-menu-dropdown-item user-menu-dropdown-button"
            role="menuitem"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
