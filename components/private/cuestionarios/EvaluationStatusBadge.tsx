import type { QuestionnaireStatus } from "@/types/questionnaire";

interface EvaluationStatusBadgeProps {
  status: QuestionnaireStatus;
}

const STATUS_LABELS: Record<QuestionnaireStatus, string> = {
  pending: "Pendiente",
  completed: "Completada",
  locked: "Bloqueada",
};

export default function EvaluationStatusBadge({
  status,
}: EvaluationStatusBadgeProps) {
  const label = STATUS_LABELS[status];

  return (
    <span
      className="evaluation-status-badge"
      data-status={status}
      aria-label={`Estado: ${label}`}
    >
      {label}
    </span>
  );
}
