"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadQuestionnaires = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const questionnaires =
        await getCompletedQuestionnaires();

      setCompleted(questionnaires);
    } catch (error) {
      console.error(
        "Error loading questionnaires:",
        error,
      );

      setCompleted([]);

      setError(
        "No se han podido cargar los cuestionarios. Inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestionnaires();
  }, [loadQuestionnaires]);

  const evaluations =
    useMemo<QuestionnaireWithStatus[]>(() => {
      const hasCompletedPre =
        completed.includes("pre");

      const hasCompletedPost =
        completed.includes("post");

      return EVALUATIONS.map(
        (evaluation) => {
          let status: QuestionnaireStatus;

          if (evaluation.id === "pre") {
            status = hasCompletedPre
              ? "completed"
              : "pending";
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
        },
      );
    }, [completed]);

  return (
    <section className="questionnaires-page">
      <PageHeader
        title="Cuestionarios"
        description="Completa los cuestionarios siguiendo el orden indicado. Tus respuestas son completamente confidenciales y se utilizarán exclusivamente con fines de investigación."
      />

      {loading ? (
        <div className="questionnaires-loading">
          <p>Cargando cuestionarios...</p>
        </div>
      ) : error ? (
        <div
          className="questionnaires-error"
          role="alert"
          aria-live="polite"
        >
          <p>{error}</p>

          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              void loadQuestionnaires()
            }
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="questionnaires-list">
          {evaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
            />
          ))}
        </div>
      )}
    </section>
  );
}