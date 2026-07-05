"use client";

import { useEffect, useState } from "react";

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

/**
 * Página del perfil del participante.
 */
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

        if (!isMounted) {
          return;
        }

        setProfile(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setError(
          error instanceof Error ? error.message : MESSAGES.unknownError,
        );

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

  if (isLoading) {
    return (
      <section className="perfil-page" aria-busy="true">
        <h1>{PAGE_TITLE}</h1>

        <p role="status">{MESSAGES.loading}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="perfil-page">
        <h1>{PAGE_TITLE}</h1>

        <p role="alert" aria-live="polite">
          {error}
        </p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="perfil-page">
        <h1>{PAGE_TITLE}</h1>

        <p>{MESSAGES.empty}</p>
      </section>
    );
  }

  return <PerfilView profile={profile} />;
}
