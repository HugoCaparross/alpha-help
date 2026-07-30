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
    title: "Has terminado de responder a las preguntas.",

    description:
      "Muchas gracias por tu tiempo. Tus respuestas se han registrado correctamente y serán utilizadas exclusivamente con fines de investigación. Ya puedes acceder a los contenidos de la intervención.",

    button: "Acceder a los contenidos",
  },

  post: {
    title: "Has terminado de responder a las preguntas.",

    description:
      "Muchas gracias por tu tiempo. Tus respuestas se han registrado correctamente y contribuirán al desarrollo de la investigación.",

    button: "Finalizar",
  },
};

/**
 * Pantalla mostrada al finalizar
 * correctamente un cuestionario.
 */
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
        <article className="questionnaire-completion__content">
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
