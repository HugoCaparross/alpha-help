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
  const status = evaluation.status;

  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  const buttonLabel = isCompleted ? "Revisar" : "Comenzar";

  const buttonTitle = isLocked
    ? "Este cuestionario todavía no está disponible."
    : `${buttonLabel} ${evaluation.title}`;

  const helperText = isCompleted
    ? "Cuestionario completado."
    : isLocked
      ? "Se desbloqueará cuando completes las fases anteriores."
      : "Disponible para completar.";

  return (
    <Card className="evaluation-card card-padding">
      <article
        className="evaluation-card__content"
        aria-labelledby={`evaluation-${evaluation.id}`}
      >
        <header className="evaluation-card__header">
          <h2
            id={`evaluation-${evaluation.id}`}
            className="evaluation-card__title"
          >
            {evaluation.title}
          </h2>

          <p className="evaluation-card__description">
            {evaluation.description}
          </p>
        </header>

        <div className="evaluation-card__meta">
          <span>{evaluation.blocks} bloques</span>

          <span aria-hidden="true">·</span>

          <span>{evaluation.estimatedMinutes} minutos</span>
        </div>

        <p className="evaluation-card__helper">{helperText}</p>

        <footer className="evaluation-card__footer">
          <EvaluationStatusBadge status={status} />

          {isLocked ? (
            <Button disabled aria-disabled="true" title={buttonTitle}>
              Bloqueado
            </Button>
          ) : (
            <Link
              href={`/cuestionarios/${evaluation.id}`}
              aria-label={`${buttonLabel}: ${evaluation.title}`}
              title={buttonTitle}
            >
              <Button>{buttonLabel}</Button>
            </Link>
          )}
        </footer>
      </article>
    </Card>
  );
}
