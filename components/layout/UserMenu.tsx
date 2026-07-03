"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronDown, LogOut, User } from "lucide-react";

import { getProfile } from "@/lib/supabase/getProfile";
import { getRegionLabel } from "@/lib/utils/regions";

import { authService } from "@/services/auth/auth.service";

import type { UserProfile } from "@/types/user";

/**
 * Menú desplegable del usuario autenticado.
 *
 * Permite acceder al perfil y cerrar sesión.
 */
export default function UserMenu() {
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);

        const data = await getProfile();

        if (!isMounted) {
          return;
        }

        setProfile(data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    try {
      await authService.logout();

      router.replace("/login");

      router.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    }
  }

  const userEmail = profile?.email ?? "Usuario";

  const userInitial = userEmail.trim().charAt(0).toUpperCase() || "U";

  const region = profile?.region ? getRegionLabel(profile.region) : "";

  return (
    <div ref={menuRef} className="user-menu">
      <button
        type="button"
        className="user-menu-trigger"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isLoading}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <div className="user-menu-avatar">
          {isLoading ? "..." : userInitial}
        </div>

        <div className="user-menu-text">
          <p className="user-menu-email">
            {isLoading ? "Cargando..." : userEmail}
          </p>

          <p className="user-menu-role">
            {profile?.role === "admin" ? "Administrador" : "Participante"}
          </p>
        </div>

        <ChevronDown
          size={18}
          className="user-menu-chevron"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-dropdown-header">
            <p className="user-menu-dropdown-email">{userEmail}</p>

            {region && <p className="user-menu-dropdown-region">{region}</p>}
          </div>

          <Link
            href="/perfil"
            role="menuitem"
            className="user-menu-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <User size={18} aria-hidden="true" />
            Perfil
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="user-menu-dropdown-item user-menu-dropdown-button"
          >
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
