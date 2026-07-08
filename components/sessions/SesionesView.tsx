"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import SessionEmptyState from "./SessionEmptyState";
import SessionsGrid from "./SessionsGrid";

import { getSessionsWithStatus } from "@/services/sessions/study-session.service";

import type { SessionWithStatus } from "@/types/study-session";

const PAGE_TITLE = "Sesiones del programa";

const PAGE_DESCRIPTION =
  "A lo largo del programa tendrás acceso a nueve sesiones formativas. Cada sesión se desbloqueará automáticamente en su fecha de publicación según tu región.";

const LOADING_MESSAGE = "Preparando las sesiones...";

const ERROR_MESSAGE =
  "No se han podido cargar las sesiones. Inténtalo de nuevo.";

/**
 * Vista principal del módulo
 * de sesiones del programa.
 */
export default function SesionesView() {
  const [sessions, setSessions] = useState<SessionWithStatus[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /**
   * Obtiene las sesiones
   * disponibles para el
   * participante.
   */
  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getSessionsWithStatus();

      setSessions(data);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setSessions([]);

      setError(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Inicializa la vista.
   */
  const initializeSessions = useCallback(() => {
    void loadSessions();
  }, [loadSessions]);

  /**
   * Reintenta la carga
   * de las sesiones.
   */
  function retryLoadSessions() {
    void loadSessions();
  }

  useEffect(() => {
    initializeSessions();
  }, [initializeSessions]);

  if (loading) {
    return (
      <section className="sesiones-loading" aria-busy="true">
        <p>{LOADING_MESSAGE}</p>
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
          onClick={retryLoadSessions}
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
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      <SessionsGrid sessions={sessions} />
    </section>
  );
}
