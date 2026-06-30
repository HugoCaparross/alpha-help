import type { QuestionnaireStatus } from "@/types/questionnaire";

interface EvaluationStatusBadgeProps {
  status: QuestionnaireStatus;
}

const STATUS_CONFIG: Record<
  QuestionnaireStatus,
  {
    label: string;
    ariaLabel: string;
  }
> = {
  pending: {
    label: "Pendiente",
    ariaLabel: "Estado del cuestionario: pendiente",
  },

  completed: {
    label: "Completado",
    ariaLabel: "Estado del cuestionario: completado",
  },

  locked: {
    label: "Bloqueado",
    ariaLabel: "Estado del cuestionario: bloqueado",
  },
};

export default function EvaluationStatusBadge({
  status,
}: EvaluationStatusBadgeProps) {
  const { label, ariaLabel } = STATUS_CONFIG[status];

  return (
    <span
      className="evaluation-status-badge"
      data-status={status}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      title={label}
    >
      {label}
    </span>
  );
}
