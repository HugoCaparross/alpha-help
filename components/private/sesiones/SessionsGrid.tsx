import SessionCard from "./SessionCard";
import SessionEmptyState from "./SessionEmptyState";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionsGridProps {
  sessions: SessionWithStatus[];
}

export default function SessionsGrid({
  sessions,
}: SessionsGridProps) {
  if (sessions.length === 0) {
    return <SessionEmptyState />;
  }

  return (
    <div className="sessions-grid">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
        />
      ))}
    </div>
  );
}