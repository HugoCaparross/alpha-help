"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { QuestionnaireWithStatus } from "@/types/questionnaire";

import EvaluationStatusBadge from "./EvaluationStatusBadge";

interface EvaluationCardProps {
  evaluation: QuestionnaireWithStatus;
}

export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const isLocked = evaluation.status === "locked";

  return (
    <Card className="evaluation-card card-padding">
      <article className="evaluation-card__content">
        <div className="evaluation-card__header">
          <h2 className="evaluation-card__title">{evaluation.title}</h2>

          <p className="evaluation-card__description">
            {evaluation.description}
          </p>
        </div>

        <div className="evaluation-card__meta">
          <span>{evaluation.blocks} bloques</span>

          <span aria-hidden="true">·</span>

          <span>{evaluation.estimatedMinutes} minutos</span>
        </div>

        <div className="evaluation-card__footer">
          <EvaluationStatusBadge status={evaluation.status} />

          {isLocked ? (
            <Button disabled>Bloqueado</Button>
          ) : (
            <Link href={`/cuestionarios/${evaluation.id}`}>
              <Button>Comenzar</Button>
            </Link>
          )}
        </div>
      </article>
    </Card>
  );
}
