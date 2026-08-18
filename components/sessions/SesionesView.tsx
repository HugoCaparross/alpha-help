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

const YOUTUBE_STATUS_INTERVAL =
  60_000;

interface YoutubeSessionStatus {
  id: string;
  isLive: boolean;
  status:
  | "live"
  | "upcoming"
  | "completed"
  | "video"
  | "unknown";
}

async function refreshYoutubeStatuses(
  sessions: SessionWithStatus[],
): Promise<
  SessionWithStatus[]
> {
  const liveCandidates =
    sessions.filter(
      (session) =>
        session.isLive ||
        session.youtubeUrl.includes(
          "/live/",
        ),
    );

  if (
    liveCandidates.length ===
    0
  ) {
    return sessions;
  }

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
    (await response.json()) as {
      sessions?: YoutubeSessionStatus[];
    };

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
      const status =
        statusMap.get(
          session.id,
        );

      if (!status) {
        return session;
      }

      return {
        ...session,
        isLive:
          status.isLive,
      };
    },
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

  const loadSessions =
    useCallback(
      async () => {
        setLoading(
          true,
        );
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

          const refreshed =
            await refreshYoutubeStatuses(
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

  useEffect(() => {
    const hasLiveSession =
      sessions.some(
        (session) =>
          session.isLive ||
          session.youtubeUrl.includes(
            "/live/",
          ),
      );

    if (
      !hasLiveSession
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          void refreshYoutubeStatuses(
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
        YOUTUBE_STATUS_INTERVAL,
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