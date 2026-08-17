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
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Fecha pendiente";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function NextUnlockCard({
  title,
  content,
  emptyMessage,
}: NextUnlockCardProps) {
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

export default function DashboardNextUnlocks({
  nextSession,
  nextMaterial,
}: DashboardNextUnlocksProps) {
  const nextSessionContent = nextSession
    ? { title: nextSession.title, releaseDate: nextSession.releaseDate }
    : null;

  const nextMaterialContent = nextMaterial
    ? { title: nextMaterial.title, releaseDate: nextMaterial.releaseDate }
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
          emptyMessage="No hay otra sesión pendiente de desbloqueo."
        />

        <NextUnlockCard
          title="Próximo material"
          content={nextMaterialContent}
          emptyMessage="No hay otro material pendiente de desbloqueo."
        />
      </div>
    </section>
  );
}