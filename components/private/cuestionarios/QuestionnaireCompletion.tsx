"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface QuestionnaireCompletionProps {
  questionnaireId: string;
  onFinish: () => void;
}

export default function QuestionnaireCompletion({
  questionnaireId,
  onFinish,
}: QuestionnaireCompletionProps) {
  const router = useRouter();

  const title =
    questionnaireId === "pre"
      ? "Evaluación inicial completada"
      : "Evaluación final completada";

  const handleFinish = () => {
    onFinish();

    router.push("/cuestionarios");

    router.refresh();
  };

  return (
    <div className="questionnaire-completion">
      <Card className="card-padding">
        <div className="questionnaire-completion__content">
          <h1 className="questionnaire-completion__title">{title}</h1>

          <p className="questionnaire-completion__description">
            Gracias por completar el cuestionario. Tus respuestas han sido
            registradas correctamente y serán utilizadas exclusivamente con
            fines de investigación.
          </p>

          <Button onClick={handleFinish}>Volver a cuestionarios</Button>
        </div>
      </Card>
    </div>
  );
}
