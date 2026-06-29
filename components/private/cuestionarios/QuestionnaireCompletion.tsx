"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { QuestionnaireType } from "@/types/questionnaire";

interface QuestionnaireCompletionProps {
  questionnaireId: QuestionnaireType;
  onFinish: () => void;
}

const TITLES: Record<QuestionnaireType, string> = {
  pre: "Evaluación inicial completada",
  post: "Evaluación final completada",
};

export default function QuestionnaireCompletion({
  questionnaireId,
  onFinish,
}: QuestionnaireCompletionProps) {
  const router = useRouter();

  const handleFinish = () => {
    onFinish();
    router.replace("/cuestionarios");
  };

  return (
    <main className="questionnaire-completion">
      <Card className="card-padding">
        <div className="questionnaire-completion__content">
          <h1 className="questionnaire-completion__title">
            {TITLES[questionnaireId]}
          </h1>

          <p className="questionnaire-completion__description">
            Gracias por completar el cuestionario. Tus respuestas han sido
            registradas correctamente y serán utilizadas exclusivamente con
            fines de investigación.
          </p>

          <Button onClick={handleFinish}>
            Volver a cuestionarios
          </Button>
        </div>
      </Card>
    </main>
  );
}