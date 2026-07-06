import SessionCard from "./SessionCard";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionsGridProps {
  readonly sessions: readonly SessionWithStatus[];
}

/**
 * Rejilla de sesiones
 * disponibles para el participante.
 */
export default function SessionsGrid({ sessions }: SessionsGridProps) {
  return (
    <section className="sessions-grid" aria-label="Listado de sesiones">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </section>
  );
}
