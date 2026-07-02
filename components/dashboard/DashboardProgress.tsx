import { CheckCircle2, Circle } from "lucide-react";

interface DashboardProgressProps {
  questionnaireCompleted: boolean;

  sessionsCompleted: boolean;

  materialsCompleted: boolean;

  postCompleted: boolean;
}

/**
 * Resumen del progreso del participante.
 */
export default function DashboardProgress({
  questionnaireCompleted,
  sessionsCompleted,
  materialsCompleted,
  postCompleted,
}: DashboardProgressProps) {
  const progressItems = [
    {
      id: "pre",
      title: "Cuestionario inicial",
      completed: questionnaireCompleted,
    },
    {
      id: "sessions",
      title: "Sesiones del programa",
      completed: sessionsCompleted,
    },
    {
      id: "materials",
      title: "Materiales de apoyo",
      completed: materialsCompleted,
    },
    {
      id: "post",
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
            <div key={item.id} className="dashboard-progress-item">
              <div className="dashboard-progress-icon" aria-hidden="true">
                {item.completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </div>

              <span className="dashboard-progress-label">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
