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
};

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProfile();

        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : MESSAGES.unknownError);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section>
        <h1>{PAGE_TITLE}</h1>

        <p role="status">{MESSAGES.loading}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>{PAGE_TITLE}</h1>

        <p role="alert" aria-live="polite">
          {error}
        </p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <h1>{PAGE_TITLE}</h1>

        <p>{MESSAGES.empty}</p>
      </section>
    );
  }

  return <PerfilView profile={profile} />;
}
