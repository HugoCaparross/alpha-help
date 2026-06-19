import { notFound } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { EVALUATIONS } from "@/lib/constants/questionnaires";

interface QuestionnaireIntroductionProps {
  questionnaireId: string;
}

export default function QuestionnaireIntroduction({
  questionnaireId,
}: QuestionnaireIntroductionProps) {
  const evaluation = EVALUATIONS.find(
    (item) => item.id === questionnaireId
  );

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
          Antes de comenzar, te recomendamos disponer del tiempo suficiente y
          realizar la evaluación en un entorno tranquilo.
        </p>
      </div>

      <Card>
        <div className="questionnaire-introduction__content">
          <div className="questionnaire-introduction__section">
            <h2 className="questionnaire-introduction__section-title">
              Duración aproximada
            </h2>

            <p className="questionnaire-introduction__section-text">
              {evaluation.estimatedMinutes} minutos
            </p>
          </div>

          <div className="questionnaire-introduction__section">
            <h2 className="questionnaire-introduction__section-title">
              Número de bloques
            </h2>

            <p className="questionnaire-introduction__section-text">
              {evaluation.blocks} bloques de preguntas
            </p>
          </div>

          <div className="questionnaire-introduction__section">
            <h2 className="questionnaire-introduction__section-title">
              Confidencialidad
            </h2>

            <p className="questionnaire-introduction__section-text">
              Tus respuestas son confidenciales y se utilizan únicamente con
              fines de investigación.
            </p>
          </div>

          <div className="questionnaire-introduction__section">
            <h2 className="questionnaire-introduction__section-title">
              Importante
            </h2>

            <p className="questionnaire-introduction__section-text">
              La evaluación debe completarse en una única sesión. Las respuestas
              no se guardan de forma parcial.
            </p>
          </div>

          <div className="questionnaire-introduction__actions">
            <Button variant="secondary">
              Atrás
            </Button>

            <Button>
              Comenzar evaluación
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}