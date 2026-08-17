"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { QuestionnaireState, QuestionnaireWithStatus } from "@/types/questionnaire";
import EvaluationStatusBadge from "./EvaluationStatusBadge";

interface EvaluationCardProps {
  evaluation: QuestionnaireWithStatus;
}

const STATUS_UI: Record<QuestionnaireState, { buttonLabel: string; buttonTitle: (title: string) => string; helperText: string }> = {
  pending: {
    buttonLabel: "Comenzar",
    buttonTitle: (title) => `Comenzar ${title}`,
    helperText: "Disponible para completar.",
  },
  completed: {
    buttonLabel: "Completado",
    buttonTitle: (title) => `${title} ya está completado.`,
    helperText: "Cuestionario completado.",
  },
  locked: {
    buttonLabel: "Bloqueado",
    buttonTitle: () => "Este cuestionario todavía no está disponible.",
    helperText: "Se desbloqueará cuando completes las fases anteriores.",
  },
};


export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const ui = STATUS_UI[evaluation.status];
  const isInteractive = evaluation.status === "pending";

  return (
    <Card className={`evaluation-card card-padding evaluation-card--${evaluation.status}`}>
      <article className="evaluation-card__content" aria-labelledby={`evaluation-${evaluation.id}`}>
        <header className="evaluation-card__header">
          <h2 id={`evaluation-${evaluation.id}`} className="evaluation-card__title">
            {evaluation.title}
          </h2>
          <p className="evaluation-card__description">{evaluation.description}</p>
        </header>

        <div className="evaluation-card__meta">
          <span>{evaluation.blocks} bloques</span>
          <span aria-hidden="true">·</span>
          <span>{evaluation.estimatedMinutes} minutos</span>
        </div>

        <div className="evaluation-card__helper-wrap">
          <p className="evaluation-card__helper">{ui.helperText}</p>
        </div>

        <footer className="evaluation-card__footer">
          <EvaluationStatusBadge status={evaluation.status} />

          {isInteractive ? (
            <Link
              href={`/cuestionarios/${evaluation.id}`}
              aria-label={`${ui.buttonLabel}: ${evaluation.title}`}
              title={ui.buttonTitle(evaluation.title)}
            >
              <Button>{ui.buttonLabel}</Button>
            </Link>
          ) : (
            <Button disabled aria-disabled="true" title={ui.buttonTitle(evaluation.title)}>
              {ui.buttonLabel}
            </Button>
          )}
        </footer>
      </article>
    </Card>
  );
}