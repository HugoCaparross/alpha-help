import { CalendarDays } from "lucide-react";

import type { SessionWithStatus } from "@/types/study-session";
import type { StudyMaterialWithStatus } from "@/types/study-material";

interface DashboardNextUnlocksProps {
  nextSession: SessionWithStatus | null;

  nextMaterial: StudyMaterialWithStatus | null;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Próximos contenidos que se
 * desbloquearán para el participante.
 */
export default function DashboardNextUnlocks({
  nextSession,
  nextMaterial,
}: DashboardNextUnlocksProps) {
  return (
    <section
      className="dashboard-section"
      aria-labelledby="dashboard-next-title"
    >
      <h2 id="dashboard-next-title" className="dashboard-section-title">
        Próximos desbloqueos
      </h2>

      <div className="dashboard-next-grid">
        <article className="dashboard-next-card">
          <div className="dashboard-next-icon" aria-hidden="true">
            <CalendarDays size={22} />
          </div>

          <div>
            <h3 className="dashboard-next-card-title">Próxima sesión</h3>

            {nextSession ? (
              <>
                <p className="dashboard-next-card-name">{nextSession.title}</p>

                <p className="dashboard-next-card-date">
                  {formatDate(nextSession.releaseDate)}
                </p>
              </>
            ) : (
              <p className="dashboard-next-card-empty">
                No quedan sesiones pendientes.
              </p>
            )}
          </div>
        </article>

        <article className="dashboard-next-card">
          <div className="dashboard-next-icon" aria-hidden="true">
            <CalendarDays size={22} />
          </div>

          <div>
            <h3 className="dashboard-next-card-title">Próximo material</h3>

            {nextMaterial ? (
              <>
                <p className="dashboard-next-card-name">{nextMaterial.title}</p>

                <p className="dashboard-next-card-date">
                  {formatDate(nextMaterial.releaseDate)}
                </p>
              </>
            ) : (
              <p className="dashboard-next-card-empty">
                No quedan materiales pendientes.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
