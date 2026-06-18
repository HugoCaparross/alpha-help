"use client";

import { useEffect, useState } from "react";

import PerfilView from "@/components/private/perfil/PerfilView";

import { getProfile } from "@/lib/supabase/getProfile";
import type { UserProfile } from "@/types/user";

import "@/components/styles/perfil.css";

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProfile();

        setProfile(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al cargar el perfil";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1>Perfil</h1>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Perfil</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h1>Perfil</h1>
        <p>No se encontró información del usuario.</p>
      </div>
    );
  }

  return <PerfilView profile={profile} />;
}