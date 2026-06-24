"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import QuestionBlock from "./QuestionBlock";
import QuestionnaireCompletion from "./QuestionnaireCompletion";
import QuestionnaireIntroduction from "./QuestionnaireIntroduction";

import { hasCompletedQuestionnaire } from "@/services/supabase/questionnaire.service";

interface QuestionnaireFlowProps {
  questionnaireId: string;
}

export default function QuestionnaireFlow({
  questionnaireId,
}: QuestionnaireFlowProps) {
  const router = useRouter();

  const [screen, setScreen] = useState<
    "loading" | "introduction" | "in_progress" | "completed"
  >("loading");

  useEffect(() => {
    const validateAccess = async () => {
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
    };

    void validateAccess();
  }, [questionnaireId, router]);

  if (screen === "loading") {
    return null;
  }

  if (screen === "completed") {
    return (
      <QuestionnaireCompletion
        questionnaireId={questionnaireId}
        onFinish={() => setScreen("introduction")}
      />
    );
  }

  if (screen === "in_progress") {
    return (
      <QuestionBlock
        questionnaireId={questionnaireId}
        onComplete={() => setScreen("completed")}
      />
    );
  }

  return (
    <QuestionnaireIntroduction
      questionnaireId={questionnaireId}
      onStart={() => setScreen("in_progress")}
    />
  );
}
