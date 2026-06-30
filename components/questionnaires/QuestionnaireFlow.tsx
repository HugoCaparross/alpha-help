"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import QuestionBlock from "./QuestionBlock";
import QuestionnaireCompletion from "./QuestionnaireCompletion";
import QuestionnaireIntroduction from "./QuestionnaireIntroduction";

import type { QuestionnaireType } from "@/types/questionnaire";

import { hasCompletedQuestionnaire } from "@/services/questionnaires/questionnaire.service";

interface QuestionnaireFlowProps {
  questionnaireId: QuestionnaireType;
}

type FlowScreen =
  | "loading"
  | "introduction"
  | "in_progress"
  | "completed"
  | "error";

export default function QuestionnaireFlow({
  questionnaireId,
}: QuestionnaireFlowProps) {
  const router = useRouter();

  const [screen, setScreen] = useState<FlowScreen>("loading");

  const [error, setError] = useState("");

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
      console.error("Error loading questionnaire:", error);

      setError("No se ha podido cargar el cuestionario.");

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
          aria-live="assertive"
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

    case "completed":
      return (
        <QuestionnaireCompletion
          questionnaireId={questionnaireId}
          onFinish={() => setScreen("introduction")}
        />
      );

    case "in_progress":
      return (
        <QuestionBlock
          questionnaireId={questionnaireId}
          onComplete={() => setScreen("completed")}
        />
      );

    case "introduction":
      return (
        <QuestionnaireIntroduction
          questionnaireId={questionnaireId}
          onStart={() => setScreen("in_progress")}
        />
      );

    default:
      return null;
  }
}
