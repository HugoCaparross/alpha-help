"use client";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { EVALUATIONS } from "@/lib/constants/questionnaires";

interface QuestionnaireIntroductionProps {
  questionnaireId: string;
  onStart: () => void;
}

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
    <div className="questionnaire-introduction">
      <div className="questionnaire-introduction__hero">
        <h1 className="questionnaire-introduction__title">
          {evaluation.title}
        </h1>

        <p className="questionnaire-introduction__description">
          Reserva aproximadamente {evaluation.estimatedMinutes} minutos y
          realiza la evaluación en un entorno tranquilo, sin interrupciones.
        </p>
      </div>

      <Card className="card-padding">
        <div className="questionnaire-introduction__content">
          <div className="questionnaire-introduction__grid">
            <div className="questionnaire-introduction__item">
              <h2 className="questionnaire-introduction__item-title">
                Duración estimada
              </h2>

              <p className="questionnaire-introduction__item-text">
                {evaluation.estimatedMinutes} minutos
              </p>
            </div>

            <div className="questionnaire-introduction__item">
              <h2 className="questionnaire-introduction__item-title">
                Cuestionarios
              </h2>

              <p className="questionnaire-introduction__item-text">
                {evaluation.blocks} bloques de evaluación
              </p>
            </div>

            <div className="questionnaire-introduction__item">
              <h2 className="questionnaire-introduction__item-title">
                Confidencialidad
              </h2>

              <p className="questionnaire-introduction__item-text">
                Tus respuestas serán tratadas de forma confidencial y utilizadas
                exclusivamente con fines de investigación.
              </p>
            </div>

            <div className="questionnaire-introduction__item">
              <h2 className="questionnaire-introduction__item-title">
                Importante
              </h2>

              <p className="questionnaire-introduction__item-text">
                Una vez iniciada, la evaluación debe completarse en una única
                sesión. Si abandonas el cuestionario antes de finalizarlo, las
                respuestas no se conservarán.
              </p>
            </div>
          </div>

          <div className="questionnaire-introduction__actions">
            <Button
              variant="secondary"
              onClick={() => router.push("/cuestionarios")}
            >
              Atrás
            </Button>

            <Button onClick={onStart}>Comenzar evaluación</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
