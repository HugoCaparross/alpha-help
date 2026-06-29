"use client";

import { useEffect, useState } from "react";

import PerfilView from "@/components/profile/PerfilView";

import { getProfile } from "@/lib/supabase/getProfile";
import type { UserProfile } from "@/types/user";

import "@/components/styles/perfil.css";

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            err instanceof Error ? err.message : "Error al cargar el perfil";

          setError(message);
        }
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

  if (isLoading) {
    return (
      <section>
        <h1>Perfil</h1>

        <p role="status">Cargando perfil...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>Perfil</h1>

        <p>{error}</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <h1>Perfil</h1>

        <p>No se encontró información del usuario.</p>
      </section>
    );
  }

  return <PerfilView profile={profile} />;
}
