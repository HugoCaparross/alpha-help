import {
  CheckCircle2,
  Circle,
} from "lucide-react";

interface DashboardProgressProps {
  preCompleted: boolean;

  postCompleted: boolean;

  completedSessions: number;

  totalSessions: number;

  completedMaterials: number;

  totalMaterials: number;
}

interface ProgressItemData {
  title: string;

  completed: boolean;

  description?: string;
}

interface ProgressItemProps
  extends ProgressItemData { }

export default function DashboardProgress({
  preCompleted,
  postCompleted,
  completedSessions,
  totalSessions,
  completedMaterials,
  totalMaterials,
}: DashboardProgressProps) {
  const safeTotalSessions =
    Math.max(
      totalSessions,
      1,
    );

  const safeTotalMaterials =
    Math.max(
      totalMaterials,
      1,
    );

  const safeCompletedSessions =
    Math.min(
      Math.max(
        completedSessions,
        0,
      ),
      safeTotalSessions,
    );

  const safeCompletedMaterials =
    Math.min(
      Math.max(
        completedMaterials,
        0,
      ),
      safeTotalMaterials,
    );

  const progressItems: readonly ProgressItemData[] =
    [
      {
        title:
          "Cuestionario inicial",

        completed:
          preCompleted,
      },

      {
        title:
          "Sesiones del programa",

        completed:
          safeCompletedSessions ===
          safeTotalSessions,

        description:
          `${safeCompletedSessions} de ${safeTotalSessions} sesiones completadas`,
      },

      {
        title:
          "Materiales del programa",

        completed:
          safeCompletedMaterials ===
          safeTotalMaterials,

        description:
          `${safeCompletedMaterials} de ${safeTotalMaterials} contenidos completados`,
      },

      {
        title:
          "Evaluación final",

        completed:
          postCompleted,
      },
    ];

  return (
    <section
      className="dashboard-section"
      aria-labelledby="dashboard-progress-title"
    >
      <div className="dashboard-card">
        <h2
          id="dashboard-progress-title"
          className="dashboard-card-title"
        >
          Tu progreso
        </h2>

        <div className="dashboard-progress">
          {progressItems.map(
            (item) => (
              <ProgressItem
                key={item.title}
                {...item}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function ProgressItem({
  title,
  completed,
  description,
}: ProgressItemProps) {
  return (
    <div className={`dashboard-progress-item ${completed ? "dashboard-progress-item--completed" : "dashboard-progress-item--pending"}`}>
      <div
        className="dashboard-progress-icon"
        aria-hidden="true"
      >
        {completed ? (
          <CheckCircle2 size={20} />
        ) : (
          <Circle size={20} />
        )}
      </div>

      <div className="dashboard-progress-content">
        <span className="dashboard-progress-label">
          {title}
        </span>

        {description && (
          <span className="dashboard-progress-description">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}