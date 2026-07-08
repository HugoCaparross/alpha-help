"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { getProfile } from "@/lib/supabase/getProfile";

import { authService } from "@/services/auth/auth.service";

import type { UserProfile } from "@/types/user";

export default function RightPanel() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const data = await getProfile();

        if (!mounted) {
          return;
        }

        setProfile(data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await authService.logout();

      router.replace("/");

      router.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    } finally {
      setIsLoggingOut(false);
    }
  }

  const userInitial = profile?.email?.trim().charAt(0).toUpperCase() ?? "U";

  return (
    <aside className="right-panel">
      <div className="right-panel-content">
        {/* PERFIL */}
        <div className="right-panel-card">
          <div className="right-panel-flex-row">
            <div className="right-panel-avatar">{userInitial}</div>

            <div>
              <p className="right-panel-name">Participante</p>

              <p className="right-panel-secondary-text">
                {profile?.email ?? ""}
              </p>

              {profile?.participantCode && (
                <p className="right-panel-secondary-text">
                  Código: {profile.participantCode}
                </p>
              )}
            </div>
          </div>

          <div className="right-panel-link-wrapper">
            <Link href="/perfil" className="right-panel-link">
              Ver mi perfil
            </Link>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="right-panel-card">
          <h4 className="right-panel-subtitle">Información</h4>

          <p className="right-panel-info-text">
            Recuerda que todas tus respuestas son completamente confidenciales y
            únicamente serán utilizadas con fines de investigación.
          </p>
        </div>

        {/* CUENTA */}
        <div className="right-panel-actions">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="right-panel-logout"
          >
            <LogOut size={18} />

            {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </aside>
  );
}
