import type { QuestionnaireStatus } from "@/types/questionnaire";

interface EvaluationStatusBadgeProps {
  status: QuestionnaireStatus;
}

export default function EvaluationStatusBadge({
  status,
}: EvaluationStatusBadgeProps) {
  const labels: Record<QuestionnaireStatus, string> = {
    pending: "Pendiente",
    completed: "Completada",
  };

  return (
    <span className="evaluation-status-badge" data-status={status}>
      {labels[status]}
    </span>
  );
}
