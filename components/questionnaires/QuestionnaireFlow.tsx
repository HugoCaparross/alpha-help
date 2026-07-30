"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import QuestionBlock from "./QuestionBlock";
import QuestionnaireCompletion from "./QuestionnaireCompletion";
import QuestionnaireIntroduction from "./QuestionnaireIntroduction";
import QuestionnaireInstructions from "./QuestionnaireInstructions";

import { hasCompletedQuestionnaire } from "@/services/questionnaires/questionnaire.service";

import type { QuestionnaireType } from "@/types/questionnaire";

interface QuestionnaireFlowProps {
  questionnaireId: QuestionnaireType;
}

type FlowScreen =
  | "loading"
  | "introduction"
  | "instructions"
  | "in_progress"
  | "completed"
  | "error";

const LOAD_ERROR = "No se ha podido cargar el cuestionario.";

export default function QuestionnaireFlow({
  questionnaireId,
}: QuestionnaireFlowProps) {
  const router = useRouter();

  const [screen, setScreen] = useState<FlowScreen>("loading");

  const [error, setError] = useState("");

  /**
   * Comprueba si el cuestionario
   * puede iniciarse.
   */
  const loadQuestionnaire = useCallback(async () => {
    try {
      setError("");

      if (questionnaireId === "post") {
        const hasCompletedPre = await hasCompletedQuestionnaire("pre");

        if (!hasCompletedPre) {
          router.replace("/cuestionarios");

          return;
        }
      }

      setScreen("introduction");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setError(LOAD_ERROR);

      setScreen("error");
    }
  }, [questionnaireId, router]);

  useEffect(() => {
    void loadQuestionnaire();
  }, [loadQuestionnaire]);

  switch (screen) {
    case "loading":
      return (
        <section className="questionnaire-loading" aria-live="polite">
          Cargando cuestionario...
        </section>
      );

    case "error":
      return (
        <section
          className="questionnaire-error"
          role="alert"
          aria-live="polite"
        >
          <p>{error}</p>

          <button
            type="button"
            className="btn-primary"
            onClick={() => void loadQuestionnaire()}
          >
            Reintentar
          </button>
        </section>
      );

    case "introduction":
      return (
        <QuestionnaireIntroduction
          questionnaireId={questionnaireId}
          onStart={() => setScreen("instructions")}
        />
      );

    case "instructions":
      return (
        <QuestionnaireInstructions onStart={() => setScreen("in_progress")} />
      );

    case "in_progress":
      return (
        <QuestionBlock
          questionnaireId={questionnaireId}
          onComplete={() => setScreen("completed")}
        />
      );

    case "completed":
      return (
        <QuestionnaireCompletion
          questionnaireId={questionnaireId}
          onFinish={() => setScreen("introduction")}
        />
      );

    default:
      return null;
  }
}
