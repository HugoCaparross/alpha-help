"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import QuestionBlock from "./QuestionBlock";
import QuestionnaireCompletion from "./QuestionnaireCompletion";
import QuestionnaireIntroduction from "./QuestionnaireIntroduction";

import type { QuestionnaireType } from "@/types/questionnaire";

import { hasCompletedQuestionnaire } from "@/services/supabase/questionnaire.service";

interface QuestionnaireFlowProps {
  questionnaireId: QuestionnaireType;
}

type FlowScreen = "loading" | "introduction" | "in_progress" | "completed";

export default function QuestionnaireFlow({
  questionnaireId,
}: QuestionnaireFlowProps) {
  const router = useRouter();

  const [screen, setScreen] = useState<FlowScreen>("loading");

  useEffect(() => {
    async function validateAccess() {
      try {
        if (questionnaireId === "post") {
          const hasCompletedPre = await hasCompletedQuestionnaire("pre");

          if (!hasCompletedPre) {
            router.replace("/cuestionarios");
            return;
          }
        }

        setScreen("introduction");
      } catch {
        router.replace("/cuestionarios");
      }
    }

    void validateAccess();
  }, [questionnaireId, router]);

  switch (screen) {
    case "loading":
      return <section className="questionnaire-loading">Cargando...</section>;

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

    default:
      return (
        <QuestionnaireIntroduction
          questionnaireId={questionnaireId}
          onStart={() => setScreen("in_progress")}
        />
      );
  }
}
