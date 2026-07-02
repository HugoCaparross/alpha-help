"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import SessionsGrid from "./SessionsGrid";
import SessionEmptyState from "./SessionEmptyState";

import { getProfile } from "@/lib/supabase/getProfile";

import { getSessionsWithStatus } from "@/services/sessions/study-session.service";

import type { Region } from "@/lib/utils/regions";

import type { SessionWithStatus } from "@/types/study-session";

export default function SesionesView() {
  const [sessions, setSessions] = useState<SessionWithStatus[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const profile = await getProfile();

      if (!profile) {
        throw new Error("No se ha encontrado el perfil del usuario.");
      }

      const region = (profile.region ?? "spain") as Region;

      const sessionsData = await getSessionsWithStatus(region);

      setSessions(sessionsData);
    } catch (error) {
      console.error("Error loading sessions:", error);

      setSessions([]);

      setError("No se han podido cargar las sesiones. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  if (loading) {
    return (
      <section className="sesiones-loading">
        <p>Preparando las sesiones...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="sesiones-error" role="alert" aria-live="polite">
        <p>{error}</p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => void loadSessions()}
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (sessions.length === 0) {
    return <SessionEmptyState />;
  }

  return (
    <section className="sesiones-page">
      <PageHeader
        title="Sesiones del programa"
        description="A lo largo del programa tendrás acceso a nueve sesiones formativas. Cada sesión estará disponible automáticamente en su fecha de publicación correspondiente según tu región."
      />

      <SessionsGrid sessions={sessions} />
    </section>
  );
}
