"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import PerfilView from "@/components/profile/PerfilView";

import { getProfile } from "@/lib/supabase/getProfile";
import type { UserProfile } from "@/types/user";

import "@/components/styles/perfil.css";

const PAGE_TITLE = "Mi perfil";

const MESSAGES = {
  loading: "Cargando perfil...",
  empty: "No se ha podido recuperar la información de tu perfil.",
  unknownError: "Ha ocurrido un error al cargar el perfil.",
} as const;

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProfile();

        if (!isMounted) return;
        setProfile(data);
      } catch (loadError) {
        if (!isMounted) return;

        setError(
          loadError instanceof Error ? loadError.message : MESSAGES.unknownError,
        );

        if (process.env.NODE_ENV === "development") {
          console.error(loadError);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="perfil-page">
      <PageHeader title={PAGE_TITLE} />

      {isLoading && (
        <div className="perfil-state" aria-busy="true" role="status">
          {MESSAGES.loading}
        </div>
      )}

      {!isLoading && error && (
        <div className="perfil-state perfil-state--error" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {!isLoading && !error && !profile && (
        <div className="perfil-state" role="status">
          {MESSAGES.empty}
        </div>
      )}

      {!isLoading && !error && profile && <PerfilView profile={profile} />}
    </section>
  );
}