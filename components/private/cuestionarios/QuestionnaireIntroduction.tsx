"use client";

import { notFound, useRouter } from "next/navigation";

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
    title: "Cuestionarios",
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
      "Una vez iniciada, la evaluación debe completarse en una única sesión. Si abandonas el cuestionario antes de finalizarlo, las respuestas no se conservarán.",
  },
] as const;

export default function QuestionnaireIntroduction({
  questionnaireId,
  onStart,
}: QuestionnaireIntroductionProps) {
  const router = useRouter();

  const evaluation = EVALUATIONS.find((item) => item.id === questionnaireId);

  if (!evaluation) {
    notFound();
  }

  return (
    <main className="questionnaire-introduction">
      <header className="questionnaire-introduction__hero">
        <h1 className="questionnaire-introduction__title">
          {evaluation.title}
        </h1>

        <p className="questionnaire-introduction__description">
          Reserva aproximadamente {evaluation.estimatedMinutes} minutos y
          realiza la evaluación en un entorno tranquilo, sin interrupciones.
        </p>
      </header>

      <Card className="card-padding">
        <div className="questionnaire-introduction__content">
          <div className="questionnaire-introduction__grid">
            {INFO_ITEMS.map((item) => (
              <div
                key={item.title}
                className="questionnaire-introduction__item"
              >
                <h2 className="questionnaire-introduction__item-title">
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
              </div>
            ))}
          </div>

          <div className="questionnaire-introduction__actions">
            <Button
              variant="secondary"
              onClick={() => router.replace("/cuestionarios")}
            >
              Atrás
            </Button>

            <Button onClick={onStart}>Comenzar evaluación</Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
