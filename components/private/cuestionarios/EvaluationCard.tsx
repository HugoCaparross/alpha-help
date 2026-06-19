"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { Questionnaire } from "@/types/questionnaire";

import EvaluationStatusBadge from "./EvaluationStatusBadge";

interface EvaluationCardProps {
  evaluation: Questionnaire;
}

export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const router = useRouter();

  const isLocked = evaluation.status === "locked";

  const buttonLabel = evaluation.status === "locked" ? "Bloqueado" : "Comenzar";

  const handleClick = () => {
    if (isLocked) {
      return;
    }

    router.push(`/cuestionarios/${evaluation.id}`);
  };

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

          <Button disabled={isLocked} onClick={handleClick}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
