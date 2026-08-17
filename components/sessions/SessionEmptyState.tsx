import { CalendarOff } from "lucide-react";

const EMPTY_TITLE = "No hay sesiones disponibles";

const EMPTY_DESCRIPTION =
  "Todavía no hay sesiones disponibles para ti. Las nuevas sesiones se irán habilitando automáticamente según el calendario del programa y tu región.";

export default function SessionEmptyState() {
  return (
    <section
      className="sessions-empty"
      role="status"
      aria-live="polite"
    >
      <div
        className="sessions-empty__icon"
        aria-hidden="true"
      >
        <CalendarOff size={28} />
      </div>

      <h2 className="sessions-empty__title">
        {EMPTY_TITLE}
      </h2>

      <p className="sessions-empty__text">
        {EMPTY_DESCRIPTION}
      </p>
    </section>
  );
}