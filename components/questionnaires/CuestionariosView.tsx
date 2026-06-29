"use client";

import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import EvaluationCard from "./EvaluationCard";

import { EVALUATIONS } from "@/lib/constants/questionnaires";
import type {
  QuestionnaireStatus,
  QuestionnaireWithStatus,
} from "@/types/questionnaire";

import {
  getCompletedQuestionnaires,
  type QuestionnaireType,
} from "@/services/questionnaires/questionnaire.service";

export default function CuestionariosView() {
  const [completed, setCompleted] = useState<QuestionnaireType[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadQuestionnaires() {
      try {
        const questionnaires = await getCompletedQuestionnaires();

        if (isMounted) {
          setCompleted(questionnaires);
        }
      } catch {
        if (isMounted) {
          setCompleted([]);
        }
      }
    }

    loadQuestionnaires();

    return () => {
      isMounted = false;
    };
  }, []);

  const evaluations = useMemo<QuestionnaireWithStatus[]>(() => {
    const hasCompletedPre = completed.includes("pre");
    const hasCompletedPost = completed.includes("post");

    return EVALUATIONS.map((evaluation) => {
      let status: QuestionnaireStatus;

      if (evaluation.id === "pre") {
        status = hasCompletedPre ? "completed" : "pending";
      } else {
        status = hasCompletedPost
          ? "completed"
          : hasCompletedPre
            ? "pending"
            : "locked";
      }

      return {
        ...evaluation,
        status,
      };
    });
  }, [completed]);

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
