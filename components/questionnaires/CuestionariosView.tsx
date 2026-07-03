"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import EvaluationCard from "./EvaluationCard";

import { EVALUATIONS } from "@/lib/constants/questionnaires";

import {
  getCompletedQuestionnaires,
  type QuestionnaireType,
} from "@/services/questionnaires/questionnaire.service";

import type {
  QuestionnaireStatus,
  QuestionnaireWithStatus,
} from "@/types/questionnaire";

const PAGE_DESCRIPTION =
  "Completa los cuestionarios siguiendo el orden indicado. Tus respuestas son completamente confidenciales y se utilizarán exclusivamente con fines de investigación.";

const LOAD_ERROR =
  "No se han podido cargar los cuestionarios. Inténtalo de nuevo.";

export default function CuestionariosView() {
  const [completed, setCompleted] = useState<QuestionnaireType[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /**
   * Recupera el estado de los
   * cuestionarios del participante.
   */
  const loadQuestionnaires = useCallback(async () => {
    setLoading(true);

    setError("");

    try {
      const questionnaires = await getCompletedQuestionnaires();

      setCompleted(questionnaires);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setCompleted([]);

      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestionnaires();
  }, [loadQuestionnaires]);

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

  if (loading) {
    return (
      <section className="questionnaires-loading">
        <p>Cargando cuestionarios...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="questionnaires-error" role="alert" aria-live="polite">
        <p>{error}</p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => void loadQuestionnaires()}
        >
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <section className="questionnaires-page">
      <PageHeader title="Cuestionarios" description={PAGE_DESCRIPTION} />

      <div className="questionnaires-list">
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </section>
  );
}
