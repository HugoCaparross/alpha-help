"use client";

import { useCallback, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";

import SessionCard from "./SessionCard";
import SessionPlayer from "./SessionPlayer";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionsGridProps {
  readonly sessions: readonly SessionWithStatus[];

  readonly completedIds: ReadonlySet<string>;

  readonly onSessionCompleted?: () => void;
}

/**
 * Rejilla de sesiones.
 *
 * Gestiona la apertura del reproductor
 * y garantiza que únicamente exista
 * un modal abierto al mismo tiempo.
 */
export default function SessionsGrid({
  sessions,
  completedIds,
  onSessionCompleted,
}: SessionsGridProps) {
  const [selectedSession, setSelectedSession] =
    useState<SessionWithStatus | null>(null);

  /**
   * Abre una sesión.
   */
  const openSession = useCallback((session: SessionWithStatus) => {
    setSelectedSession(session);
  }, []);

  /**
   * Cierra el reproductor.
   */
  const closeSession = useCallback(() => {
    setSelectedSession(null);
  }, []);

  /**
   * Título mostrado
   * en el modal.
   */
  const modalTitle = useMemo(() => {
    if (!selectedSession) {
      return "";
    }

    return `Sesión ${selectedSession.sessionOrder} · ${selectedSession.title}`;
  }, [selectedSession]);

  return (
    <>
      <section className="sessions-grid" aria-label="Listado de sesiones">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            completed={completedIds.has(session.id)}
            onOpen={openSession}
          />
        ))}
      </section>

      <Modal
        open={selectedSession !== null}
        title={modalTitle}
        onClose={closeSession}
        maxWidth={1200}
      >
        {selectedSession && (
          <SessionPlayer
            session={selectedSession}
            onCompleted={onSessionCompleted}
          />
        )}
      </Modal>
    </>
  );
}
