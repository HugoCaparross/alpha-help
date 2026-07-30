"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface QuestionnaireInstructionsProps {
  onStart: () => void;
}

/**
 * Instrucciones previas al inicio
 * del cuestionario.
 */
export default function QuestionnaireInstructions({
  onStart,
}: QuestionnaireInstructionsProps) {
  const [starting, setStarting] = useState(false);

  function handleStart() {
    if (starting) {
      return;
    }

    setStarting(true);

    onStart();
  }

  return (
    <main className="questionnaire-introduction">
      <Card className="card-padding">
        <section className="questionnaire-introduction__content">
          <header className="questionnaire-introduction__hero">
            <h1 className="questionnaire-introduction__title">
              Antes de comenzar
            </h1>
          </header>

          <div className="questionnaire-introduction__text">
            <p>
              Gracias por participar en este proyecto de investigación. A
              continuación, te pediremos que respondas a una serie de preguntas
              sobre distintos aspectos relacionados con la salud mental y el
              bienestar emocional de los menores, así como sobre tu experiencia
              como padre, madre o cuidador principal.
            </p>

            <p>
              Tus respuestas nos ayudarán a conocer mejor las necesidades de las
              familias y a evaluar la utilidad de la intervención Alpha-Help.
            </p>

            <p>
              Completar este cuestionario te llevará aproximadamente entre
              <strong> 15 y 20 minutos.</strong>
            </p>

            <p>
              No existen respuestas correctas o incorrectas. Te pedimos que
              respondas con la mayor sinceridad posible.
            </p>

            <p>
              Toda la información recogida será tratada de forma
              <strong> confidencial, codificada y pseudoanonimizada</strong> y
              se utilizará exclusivamente con fines de investigación.
            </p>

            <p>
              Si tienes más de un hijo o hija con edades comprendidas entre los
              10 y los 16 años, responde pensando siempre en el hijo o hija de
              menor edad.
            </p>

            <p>
              Te recomendamos completar el cuestionario en un momento tranquilo
              y sin interrupciones para poder responder con calma a todas las
              preguntas.
            </p>

            <p>
              <strong>Muchas gracias por tu colaboración.</strong>
            </p>

            <p className="questionnaire-introduction__highlight">
              Por favor, indica hasta qué punto estás de acuerdo o en desacuerdo
              con cada afirmación.
            </p>
          </div>

          <div className="questionnaire-introduction__actions">
            <Button onClick={handleStart} disabled={starting}>
              {starting ? "Iniciando..." : "Comenzar cuestionario"}
            </Button>
          </div>
        </section>
      </Card>
    </main>
  );
}
