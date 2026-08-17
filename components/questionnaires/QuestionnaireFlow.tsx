"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BackToDashboard from "@/components/ui/BackToDashboard";

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

export default function QuestionnaireFlow({ questionnaireId }: QuestionnaireFlowProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<FlowScreen>("loading");
  const [error, setError] = useState("");

  const loadQuestionnaire = useCallback(async () => {
    try {
      setError("");

      const completed = await hasCompletedQuestionnaire(questionnaireId);

      if (completed) {
        router.replace("/cuestionarios");
        return;
      }

      if (questionnaireId === "post") {
        const [hasCompletedPre, statusResponse] = await Promise.all([
          hasCompletedQuestionnaire("pre"),
          fetch("/api/questionnaires/status", { cache: "no-store" }),
        ]);

        if (!hasCompletedPre || !statusResponse.ok) {
          router.replace("/cuestionarios");
          return;
        }

        const status = (await statusResponse.json()) as {
          postAvailable?: boolean;
        };

        if (!status.postAvailable) {
          router.replace("/cuestionarios");
          return;
        }
      }

      setScreen("introduction");
    } catch (loadError) {
      if (process.env.NODE_ENV === "development") {
        console.error(loadError);
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
          <div className="page-navigation">
            <BackToDashboard />
          </div>
          Cargando cuestionario...
        </section>
      );

    case "error":
      return (
        <section className="questionnaire-error" role="alert" aria-live="polite">
          <div className="page-navigation">
            <BackToDashboard />
          </div>
          <p>{error}</p>
          <button type="button" className="btn-primary" onClick={() => void loadQuestionnaire()}>
            Reintentar
          </button>
        </section>
      );

    case "introduction":
      return (
        <section className="questionnaire-flow">
          <div className="page-navigation">
            <BackToDashboard />
          </div>
          <QuestionnaireIntroduction questionnaireId={questionnaireId} onStart={() => setScreen("instructions")} />
        </section>
      );

    case "instructions":
      return (
        <section className="questionnaire-flow">
          <div className="page-navigation">
            <BackToDashboard />
          </div>
          <QuestionnaireInstructions onStart={() => setScreen("in_progress")} />
        </section>
      );

    case "in_progress":
      return (
        <QuestionBlock questionnaireId={questionnaireId} onComplete={() => setScreen("completed")} />
      );

    case "completed":
      return (
        <section className="questionnaire-flow">
          <div className="page-navigation">
            <BackToDashboard />
          </div>
          <QuestionnaireCompletion
            questionnaireId={questionnaireId}
            onFinish={() => router.replace("/cuestionarios")}
          />
        </section>
      );

    default:
      return null;
  }
}