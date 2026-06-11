"use client";

import { useEffect, useState } from "react";

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

  const initials =
    profile.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="perfil-page">
      <header className="perfil-header">
        <h1 className="perfil-title">Perfil</h1>

        <p className="perfil-description">
          Consulta la información asociada a tu cuenta de Alpha-Help.
        </p>
      </header>

      <section className="perfil-hero">
        <div className="perfil-avatar">
          {initials}
        </div>

        <div className="perfil-hero-content">
          <p className="perfil-email">
            {profile.email}
          </p>

          <p className="perfil-region">
            {profile.region || "No disponible"}
          </p>
        </div>
      </section>

      <div className="perfil-grid">
        <section className="perfil-card">
          <h2 className="perfil-card-title">
            Información personal
          </h2>

          <div className="perfil-field">
            <span className="perfil-label">Sexo</span>
            <span className="perfil-value">
              {profile.gender || "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">Edad</span>
            <span className="perfil-value">
              {profile.age ?? "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Nivel educativo
            </span>
            <span className="perfil-value">
              {profile.education_level || "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Situación laboral
            </span>
            <span className="perfil-value">
              {profile.employment_status || "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Estado civil
            </span>
            <span className="perfil-value">
              {profile.marital_status || "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Nivel socioeconómico
            </span>
            <span className="perfil-value">
              {profile.socioeconomic_level || "No disponible"}
            </span>
          </div>
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">
            Entorno familiar
          </h2>

          <div className="perfil-field">
            <span className="perfil-label">
              Número de hijos
            </span>
            <span className="perfil-value">
              {profile.number_of_children ?? "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Estructura familiar
            </span>
            <span className="perfil-value">
              {profile.family_structure || "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Tipo de centro
            </span>
            <span className="perfil-value">
              {profile.school_type || "No disponible"}
            </span>
          </div>

          <div className="perfil-field">
            <span className="perfil-label">
              Centro educativo
            </span>
            <span className="perfil-value">
              {profile.school_center || "No disponible"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}