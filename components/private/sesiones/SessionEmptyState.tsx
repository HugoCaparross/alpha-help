import { CalendarOff } from "lucide-react";

export default function SessionEmptyState() {
  return (
    <div className="sessions-empty">
      <div
        className="sessions-empty__icon"
        aria-hidden="true"
      >
        <CalendarOff size={28} />
      </div>

      <p className="sessions-empty__text">
        No hay sesiones disponibles actualmente.
      </p>
    </div>
  );
}