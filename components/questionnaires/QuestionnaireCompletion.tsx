"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { QuestionnaireType } from "@/types/questionnaire";

interface QuestionnaireCompletionProps {
  questionnaireId: QuestionnaireType;

  onFinish: () => void;
}

const CONTENT: Record<
  QuestionnaireType,
  {
    title: string;
    description: string;
    button: string;
  }
> = {
  pre: {
    title: "Evaluación inicial completada",

    description:
      "Has completado correctamente la evaluación inicial. Tus respuestas se han registrado y serán utilizadas exclusivamente con fines de investigación. Ya puedes continuar con las siguientes fases del estudio cuando estén disponibles.",

    button: "Continuar",
  },

  post: {
    title: "Evaluación final completada",

    description:
      "Has finalizado tu participación en esta fase del estudio. Agradecemos sinceramente el tiempo dedicado y tu colaboración. Tus respuestas contribuirán al desarrollo de la investigación.",

    button: "Finalizar",
  },
};

export default function QuestionnaireCompletion({
  questionnaireId,
  onFinish,
}: QuestionnaireCompletionProps) {
  const router = useRouter();

  const content = CONTENT[questionnaireId];

  function handleFinish() {
    onFinish();

    router.replace("/cuestionarios");
  }

  return (
    <main className="questionnaire-completion">
      <Card className="card-padding">
        <article
          className="questionnaire-completion__content"
          role="status"
          aria-live="polite"
        >
          <header>
            <h1 className="questionnaire-completion__title">{content.title}</h1>
          </header>

          <section>
            <p className="questionnaire-completion__description">
              {content.description}
            </p>
          </section>

          <footer className="questionnaire-completion__actions">
            <Button onClick={handleFinish}>{content.button}</Button>
          </footer>
        </article>
      </Card>
    </main>
  );
}
