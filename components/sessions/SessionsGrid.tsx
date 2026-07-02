import SessionCard from "./SessionCard";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionsGridProps {
  sessions: SessionWithStatus[];
}

export default function SessionsGrid({
  sessions,
}: SessionsGridProps) {
  return (
    <section
      className="sessions-grid"
      aria-label="Listado de sesiones"
    >
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
        />
      ))}
    </section>
  );
}