import { CheckCircle2, Circle } from "lucide-react";

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

interface ProgressItemProps extends ProgressItemData {}

export default function DashboardProgress({
  preCompleted,
  postCompleted,
  completedSessions,
  totalSessions,
  completedMaterials,
  totalMaterials,
}: DashboardProgressProps) {
  const progressItems: readonly ProgressItemData[] = [
    {
      title: "Cuestionario inicial",
      completed: preCompleted,
    },
    {
      title: "Sesiones del programa",
      completed: completedSessions === totalSessions,
      description: `${completedSessions} de ${totalSessions} sesiones completadas`,
    },
    {
      title: "Materiales de apoyo",
      completed: completedMaterials === totalMaterials,
      description: `${completedMaterials} de ${totalMaterials} materiales completados`,
    },
    {
      title: "Evaluación final",
      completed: postCompleted,
    },
  ];

  return (
    <section
      className="dashboard-section"
      aria-labelledby="dashboard-progress-title"
    >
      <div className="dashboard-card">
        <h2 id="dashboard-progress-title" className="dashboard-card-title">
          Tu progreso
        </h2>

        <div className="dashboard-progress">
          {progressItems.map((item) => (
            <ProgressItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressItem({ title, completed, description }: ProgressItemProps) {
  return (
    <div className="dashboard-progress-item">
      <div className="dashboard-progress-icon" aria-hidden="true">
        {completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </div>

      <div className="dashboard-progress-content">
        <span className="dashboard-progress-label">{title}</span>

        {description && (
          <span className="dashboard-progress-description">{description}</span>
        )}
      </div>
    </div>
  );
}
