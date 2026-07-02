import { CalendarOff } from "lucide-react";

export default function SessionEmptyState() {
  return (
    <section className="sessions-empty" role="status" aria-live="polite">
      <div className="sessions-empty__icon" aria-hidden="true">
        <CalendarOff size={28} />
      </div>

      <h2 className="sessions-empty__title">No hay sesiones disponibles</h2>

      <p className="sessions-empty__text">
        Todavía no hay sesiones disponibles para ti. Las nuevas sesiones se irán
        habilitando automáticamente según el calendario del programa y tu
        región.
      </p>
    </section>
  );
}
