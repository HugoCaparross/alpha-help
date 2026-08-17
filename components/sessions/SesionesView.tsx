"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import PageHeader from "@/components/ui/PageHeader";

import SessionEmptyState from "./SessionEmptyState";
import SessionsGrid from "./SessionsGrid";

import {
  getSessionsWithStatus,
} from "@/services/sessions/study-session.service";

import {
  getCompletedSessionIds,
} from "@/services/sessions/session-progress.service";

import type {
  SessionWithStatus,
} from "@/types/study-session";

const PAGE_TITLE =
  "Sesiones del programa";

const PAGE_DESCRIPTION =
  "El programa está formado por una introducción y nueve sesiones. Los contenidos aparecen automáticamente cuando llega su fecha de publicación.";

const LOADING_MESSAGE =
  "Preparando las sesiones...";

const ERROR_MESSAGE =
  "No se han podido cargar las sesiones. Inténtalo de nuevo.";

export default function SesionesView() {
  const [
    sessions,
    setSessions,
  ] =
    useState<
      SessionWithStatus[]
    >([]);

  const [
    completedIds,
    setCompletedIds,
  ] =
    useState<
      Set<string>
    >(new Set());

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadSessions =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const [
            data,
            completed,
          ] =
            await Promise.all([
              getSessionsWithStatus(),

              getCompletedSessionIds(),
            ]);

          setSessions(data);

          setCompletedIds(
            new Set(
              completed,
            ),
          );
        } catch (loadError) {
          if (
            process.env.NODE_ENV ===
            "development"
          ) {
            console.error(
              loadError,
            );
          }

          setSessions([]);
          setCompletedIds(
            new Set(),
          );

          setError(
            ERROR_MESSAGE,
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  if (loading) {
    return (
      <section
        className="sesiones-loading"
        aria-busy="true"
      >
        <p>
          {LOADING_MESSAGE}
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="sesiones-error"
        role="alert"
        aria-live="polite"
      >
        <p>{error}</p>

        <button
          type="button"
          className="btn-primary"
          onClick={() =>
            void loadSessions()
          }
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (
    sessions.length === 0
  ) {
    return (
      <section className="sesiones-page">
        <PageHeader
          title={PAGE_TITLE}
          description={
            PAGE_DESCRIPTION
          }
        />

        <SessionEmptyState />
      </section>
    );
  }

  return (
    <section className="sesiones-page">
      <PageHeader
        title={PAGE_TITLE}
        description={
          PAGE_DESCRIPTION
        }
      />

      <SessionsGrid
        sessions={sessions}
        completedIds={
          completedIds
        }
        onSessionCompleted={
          loadSessions
        }
      />
    </section>
  );
}