import { CalendarDays } from "lucide-react";

import type { SessionWithStatus } from "@/types/study-session";
import type { StudyMaterialWithStatus } from "@/types/study-material";

interface DashboardNextUnlocksProps {
  nextSession: SessionWithStatus | null;

  nextMaterial: StudyMaterialWithStatus | null;
}

interface UnlockContent {
  title: string;

  releaseDate: string;
}

interface NextUnlockCardProps {
  title: string;

  content: UnlockContent | null;

  emptyMessage: string;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function NextUnlockCard({ title, content, emptyMessage }: NextUnlockCardProps) {
  return (
    <article className="dashboard-next-card">
      <div className="dashboard-next-icon" aria-hidden="true">
        <CalendarDays size={22} />
      </div>

      <div className="dashboard-next-content">
        <h3 className="dashboard-next-card-title">{title}</h3>

        {content ? (
          <>
            <p className="dashboard-next-card-name">{content.title}</p>

            <p className="dashboard-next-card-date">
              {formatDate(content.releaseDate)}
            </p>
          </>
        ) : (
          <p className="dashboard-next-card-empty">{emptyMessage}</p>
        )}
      </div>
    </article>
  );
}

/**
 * Muestra el siguiente contenido
 * pendiente de desbloquear para
 * el participante.
 */
export default function DashboardNextUnlocks({
  nextSession,
  nextMaterial,
}: DashboardNextUnlocksProps) {
  const nextSessionContent: UnlockContent | null = nextSession
    ? {
        title: nextSession.title,
        releaseDate: nextSession.releaseDate,
      }
    : null;

  const nextMaterialContent: UnlockContent | null = nextMaterial
    ? {
        title: nextMaterial.title,
        releaseDate: nextMaterial.releaseDate,
      }
    : null;

  return (
    <section
      className="dashboard-section"
      aria-labelledby="dashboard-next-title"
    >
      <h2 id="dashboard-next-title" className="dashboard-section-title">
        Próximos desbloqueos
      </h2>

      <div className="dashboard-next-grid">
        <NextUnlockCard
          title="Próxima sesión"
          content={nextSessionContent}
          emptyMessage="No quedan sesiones pendientes."
        />

        <NextUnlockCard
          title="Próximo material"
          content={nextMaterialContent}
          emptyMessage="No quedan materiales pendientes."
        />
      </div>
    </section>
  );
}
