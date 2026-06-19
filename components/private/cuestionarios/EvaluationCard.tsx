import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import type { Questionnaire } from "@/types/questionnaire";

import EvaluationStatusBadge from "./EvaluationStatusBadge";

interface EvaluationCardProps {
  evaluation: Questionnaire;
}

export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <Card className="evaluation-card">
      <div className="evaluation-card__content">
        <div className="evaluation-card__header">
          <h2 className="evaluation-card__title">{evaluation.title}</h2>

          <p className="evaluation-card__description">
            {evaluation.description}
          </p>
        </div>

        <div className="evaluation-card__meta">
          <span>{evaluation.blocks} bloques</span>

          <span>·</span>

          <span>{evaluation.estimatedMinutes} minutos</span>
        </div>

        <div className="evaluation-card__footer">
          <EvaluationStatusBadge status={evaluation.status} />

          <Button>Comenzar</Button>
        </div>
      </div>
    </Card>
  );
}
