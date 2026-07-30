"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { EVALUATIONS } from "@/lib/constants/questionnaires";

import type { QuestionnaireType } from "@/types/questionnaire";

interface QuestionnaireIntroductionProps {
  questionnaireId: QuestionnaireType;
  onStart: () => void;
}

const INFO_ITEMS = [
  {
    title: "Duración estimada",
    getValue: (minutes: number) => `${minutes} minutos`,
  },
  {
    title: "Estructura",
    getValue: (_: number, blocks: number) => `${blocks} bloques de evaluación`,
  },
  {
    title: "Confidencialidad",
    value:
      "Tus respuestas serán tratadas de forma confidencial y utilizadas exclusivamente con fines de investigación.",
  },
  {
    title: "Importante",
    value:
      "Si abandonas el cuestionario antes de finalizarlo, el progreso no se guardará.",
  },
] as const;

/**
 * Pantalla de introducción previa
 * al inicio del cuestionario.
 */
export default function QuestionnaireIntroduction({
  questionnaireId,
  onStart,
}: QuestionnaireIntroductionProps) {
  const router = useRouter();

  const [starting, setStarting] = useState(false);

  const evaluation = EVALUATIONS.find(
    (evaluation) => evaluation.id === questionnaireId,
  );

  if (!evaluation) {
    return null;
  }

  const startButtonLabel = starting ? "Iniciando..." : "Comenzar evaluación";

  function handleStart() {
    if (starting) {
      return;
    }

    setStarting(true);

    onStart();
  }

  return (
    <main className="questionnaire-introduction">
      <header className="questionnaire-introduction__hero">
        <h1 className="questionnaire-introduction__title">
          {evaluation.title}
        </h1>

        <p className="questionnaire-introduction__description">
          Reserva aproximadamente{" "}
          <strong>{evaluation.estimatedMinutes} minutos</strong> para completar
          este cuestionario en un entorno tranquilo y sin interrupciones.
        </p>
      </header>

      <Card className="card-padding">
        <section
          className="questionnaire-introduction__content"
          aria-labelledby="questionnaire-information"
        >
          <div className="questionnaire-introduction__grid">
            {INFO_ITEMS.map((item) => (
              <article
                key={item.title}
                className="questionnaire-introduction__item"
              >
                <h2
                  className="questionnaire-introduction__item-title"
                  id={
                    item.title === "Duración estimada"
                      ? "questionnaire-information"
                      : undefined
                  }
                >
                  {item.title}
                </h2>

                <p className="questionnaire-introduction__item-text">
                  {"getValue" in item
                    ? item.getValue(
                        evaluation.estimatedMinutes,
                        evaluation.blocks,
                      )
                    : item.value}
                </p>
              </article>
            ))}
          </div>

          <div className="questionnaire-introduction__actions">
            <Button
              variant="secondary"
              onClick={() => router.replace("/cuestionarios")}
            >
              Atrás
            </Button>

            <Button onClick={handleStart} disabled={starting}>
              {startButtonLabel}
            </Button>
          </div>
        </section>
      </Card>
    </main>
  );
}
