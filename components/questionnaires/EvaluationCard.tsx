"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type {
  QuestionnaireStatus,
  QuestionnaireWithStatus,
} from "@/types/questionnaire";

import EvaluationStatusBadge from "./EvaluationStatusBadge";

interface EvaluationCardProps {
  evaluation: QuestionnaireWithStatus;
}

const STATUS_UI: Record<
  QuestionnaireStatus,
  {
    buttonLabel: string;
    buttonTitle: (title: string) => string;
    helperText: string;
  }
> = {
  pending: {
    buttonLabel: "Comenzar",
    buttonTitle: (title) => `Comenzar ${title}`,
    helperText: "Disponible para completar.",
  },

  completed: {
    buttonLabel: "Revisar",
    buttonTitle: (title) => `Revisar ${title}`,
    helperText: "Cuestionario completado.",
  },

  locked: {
    buttonLabel: "Bloqueado",
    buttonTitle: () => "Este cuestionario todavía no está disponible.",
    helperText: "Se desbloqueará cuando completes las fases anteriores.",
  },
};

/**
 * Tarjeta resumen de una evaluación.
 */
export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const isLocked = evaluation.status === "locked";

  const ui = STATUS_UI[evaluation.status];

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

        <p className="evaluation-card__helper">{ui.helperText}</p>

        <footer className="evaluation-card__footer">
          <EvaluationStatusBadge status={evaluation.status} />

          {isLocked ? (
            <Button
              disabled
              aria-disabled="true"
              title={ui.buttonTitle(evaluation.title)}
            >
              Bloqueado
            </Button>
          ) : (
            <Link
              href={`/cuestionarios/${evaluation.id}`}
              aria-label={`${ui.buttonLabel}: ${evaluation.title}`}
              title={ui.buttonTitle(evaluation.title)}
            >
              <Button>{ui.buttonLabel}</Button>
            </Link>
          )}
        </footer>
      </article>
    </Card>
  );
}
