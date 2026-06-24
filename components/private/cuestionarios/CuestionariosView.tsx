"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import EvaluationCard from "./EvaluationCard";

import { EVALUATIONS } from "@/lib/constants/questionnaires";
import type { Questionnaire, QuestionnaireStatus } from "@/types/questionnaire";

import {
  getCompletedQuestionnaires,
  type QuestionnaireType,
} from "@/services/supabase/questionnaire.service";

export default function CuestionariosView() {
  const [completed, setCompleted] = useState<QuestionnaireType[]>([]);

  useEffect(() => {
    const loadQuestionnaires = async () => {
      try {
        const questionnaires = await getCompletedQuestionnaires();

        setCompleted(questionnaires);
      } catch {
        setCompleted([]);
      }
    };

    void loadQuestionnaires();
  }, []);

  const evaluations: Questionnaire[] = EVALUATIONS.map((evaluation) => {
    const isPreCompleted = completed.includes("pre");

    let status: QuestionnaireStatus;

    if (evaluation.id === "pre") {
      status = completed.includes("pre") ? "completed" : "pending";
    } else {
      status = completed.includes("post")
        ? "completed"
        : isPreCompleted
          ? "pending"
          : "locked";
    }

    return {
      ...evaluation,
      status,
    };
  });

  return (
    <section className="questionnaires-page">
      <PageHeader
        title="Formularios"
        description="
        Completa las evaluaciones del estudio en el orden indicado.
        Tus respuestas son confidenciales y se utilizan exclusivamente
        con fines de investigación."
      />

      <div className="questionnaires-list">
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </section>
  );
}
