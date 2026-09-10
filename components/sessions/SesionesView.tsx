"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import PageHeader from "@/components/ui/PageHeader";
import { getProfile } from "@/lib/supabase/getProfile";
import type { Region } from "@/lib/utils/regions";

import SessionEmptyState from "./SessionEmptyState";
import SessionsGrid from "./SessionsGrid";
import SessionCalendar from "./SessionCalendar";

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
  "El programa está formado por una introducción, nueve sesiones y una sesión adicional de cierre sin contenidos.";

const LOADING_MESSAGE =
  "Preparando las sesiones...";

const ERROR_MESSAGE =
  "No se han podido cargar las sesiones. Inténtalo de nuevo.";

const YOUTUBE_CACHE_INTERVAL =
  60_000;

type YoutubeStatus =
  | "live"
  | "upcoming"
  | "completed"
  | "video"
  | "unknown";

interface YoutubeSessionCacheStatus {
  readonly id: string;

  readonly isLive: boolean;

  readonly status: YoutubeStatus;

  readonly checkedAt:
  | string
  | null;
}

interface YoutubeCacheResponse {
  readonly sessions?:
  YoutubeSessionCacheStatus[];
}

/**
 * Recupera únicamente el estado cacheado de YouTube.
 *
 * IMPORTANTE:
 * Esta llamada NO consulta YouTube.
 *
 * El sincronizador automático actualiza Supabase en segundo plano
 * y esta ruta solamente devuelve el último estado confirmado.
 */
async function refreshYoutubeCache(
  sessions: SessionWithStatus[],
): Promise<SessionWithStatus[]> {
  try {
    const response =
      await fetch(
        "/api/youtube/sessions-status",
        {
          cache:
            "no-store",
        },
      );

    if (!response.ok) {
      return sessions;
    }

    const payload =
      (await response.json()) as YoutubeCacheResponse;

    if (
      !payload.sessions
    ) {
      return sessions;
    }

    const statusMap =
      new Map(
        payload.sessions.map(
          (item) => [
            item.id,
            item,
          ],
        ),
      );

    return sessions.map(
      (session) => {
        const cachedStatus =
          statusMap.get(
            session.id,
          );

        if (
          !cachedStatus
        ) {
          return session;
        }

        return {
          ...session,

          isLive:
            cachedStatus.isLive,

          youtubeStatus:
            cachedStatus.status,

          youtubeCheckedAt:
            cachedStatus.checkedAt,
        };
      },
    );
  } catch {
    /**
     * La página ya dispone de los datos
     * cacheados de study_sessions.
     * Si esta actualización ligera falla,
     * no hacemos fallar toda la pantalla.
     */
    return sessions;
  }
}

function hasPendingYoutubeState(
  sessions: SessionWithStatus[],
): boolean {
  return sessions.some(
    (session) =>
      session.youtubeStatus ===
      "live" ||
      session.youtubeStatus ===
      "upcoming" ||
      session.youtubeStatus ===
      "unknown" ||
      session.isLive,
  );
}

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
    >(
      new Set(),
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    region,
    setRegion,
  ] =
    useState<Region | null>(null);

  const loadSessions =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError("");

        try {
          const [
            profile,
            data,
            completed,
          ] =
            await Promise.all([
              getProfile(),
              getSessionsWithStatus(),
              getCompletedSessionIds(),
            ]);

          if (!profile) {
            throw new Error("No se ha podido recuperar el perfil del participante.");
          }

          setRegion(profile.region);

          const refreshed =
            await refreshYoutubeCache(
              data,
            );

          setSessions(
            refreshed,
          );

          setCompletedIds(
            new Set(
              completed,
            ),
          );
        } catch (
        loadError
        ) {
          if (
            process.env
              .NODE_ENV ===
            "development"
          ) {
            console.error(
              loadError,
            );
          }

          setSessions(
            [],
          );

          setRegion(null);

          setCompletedIds(
            new Set(),
          );

          setError(
            ERROR_MESSAGE,
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  /**
   * Mientras exista alguna sesión cuyo estado pueda cambiar,
   * refrescamos el CACHE de Supabase cada minuto.
   *
   * Esto NO genera llamadas adicionales a YouTube.
   * El cron automático es el que consulta YouTube.
   */
  useEffect(() => {
    if (
      !hasPendingYoutubeState(
        sessions,
      )
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          void refreshYoutubeCache(
            sessions,
          ).then(
            (
              refreshed,
            ) => {
              setSessions(
                refreshed,
              );
            },
          );
        },
        YOUTUBE_CACHE_INTERVAL,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, [sessions]);

  if (loading) {
    return (
      <section
        className="sesiones-page"
        aria-busy="true"
      >
        <PageHeader
          title={
            PAGE_TITLE
          }
          description={
            PAGE_DESCRIPTION
          }
        />

        <div className="sesiones-loading">
          <p>
            {
              LOADING_MESSAGE
            }
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="sesiones-page">
        <PageHeader
          title={
            PAGE_TITLE
          }
          description={
            PAGE_DESCRIPTION
          }
        />

        <div
          className="sesiones-error"
          role="alert"
          aria-live="polite"
        >
          <p>
            {error}
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              void loadSessions()
            }
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  if (
    sessions.length ===
    0
  ) {
    return (
      <section className="sesiones-page">
        <PageHeader
          title={
            PAGE_TITLE
          }
          description={
            PAGE_DESCRIPTION
          }
        />

        <SessionCalendar region={region ?? "spain"} />

        <SessionEmptyState />
      </section>
    );
  }

  return (
    <section className="sesiones-page">
      <PageHeader
        title={
          PAGE_TITLE
        }
        description={
          PAGE_DESCRIPTION
        }
      />

      <SessionCalendar region={region ?? "spain"} />

      <SessionsGrid
        sessions={
          sessions
        }
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