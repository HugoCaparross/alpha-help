import type { QuestionnaireState } from "@/types/questionnaire";

interface EvaluationStatusBadgeProps {
  status: QuestionnaireState;
}

const STATUS_CONFIG: Record<
  QuestionnaireState,
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

/**
 * Representación visual del estado
 * de una evaluación.
 */
export default function EvaluationStatusBadge({
  status,
}: EvaluationStatusBadgeProps) {
  const { label, ariaLabel } = STATUS_CONFIG[status];

  return (
    <span
      className="evaluation-status-badge"
      data-status={status}
      aria-label={ariaLabel}
      title={label}
    >
      {label}
    </span>
  );
}
