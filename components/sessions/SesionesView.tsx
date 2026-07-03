"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import SessionEmptyState from "./SessionEmptyState";
import SessionsGrid from "./SessionsGrid";

import { getProfile } from "@/lib/supabase/getProfile";

import { getSessionsWithStatus } from "@/services/sessions/study-session.service";

import type { SessionWithStatus } from "@/types/study-session";

const ERROR_MESSAGE =
  "No se han podido cargar las sesiones. Inténtalo de nuevo.";

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
        throw new Error("Perfil no encontrado.");
      }

      const data = await getSessionsWithStatus(profile.region);

      setSessions(data);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }

      setSessions([]);

      setError(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  if (loading) {
    return (
      <section className="sesiones-loading" aria-busy="true">
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
        description="A lo largo del programa tendrás acceso a nueve sesiones formativas. Cada sesión se desbloqueará automáticamente en su fecha de publicación según tu región."
      />

      <SessionsGrid sessions={sessions} />
    </section>
  );
}
