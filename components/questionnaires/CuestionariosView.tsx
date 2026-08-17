"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import EvaluationCard from "./EvaluationCard";

import { EVALUATIONS } from "@/lib/constants/questionnaires";
import { getCompletedQuestionnaires } from "@/services/questionnaires/questionnaire.service";
import type { QuestionnaireType } from "@/types/questionnaire";
import type { QuestionnaireState, QuestionnaireWithStatus } from "@/types/questionnaire";

const PAGE_DESCRIPTION =
  "Completa los cuestionarios siguiendo el orden indicado. La evaluación inicial se realiza antes de acceder al programa de intervención y la evaluación final estará disponible una vez finalizado. Todas las respuestas son confidenciales y se utilizarán exclusivamente con fines de investigación.";

const LOAD_ERROR = "No se han podido cargar los cuestionarios. Inténtalo de nuevo.";

type AvailabilityResponse = {
  postAvailable: boolean;
  postReleaseAt: string | null;
};

export default function CuestionariosView() {
  const [completed, setCompleted] = useState<QuestionnaireType[]>([]);
  const [postAvailable, setPostAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuestionnaires = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [questionnaires, statusResponse] = await Promise.all([
        getCompletedQuestionnaires(),
        fetch("/api/questionnaires/status", { cache: "no-store" }),
      ]);

      if (!statusResponse.ok) {
        throw new Error(LOAD_ERROR);
      }

      const status = (await statusResponse.json()) as AvailabilityResponse;

      setCompleted(questionnaires);
      setPostAvailable(status.postAvailable);
    } catch (loadError) {
      if (process.env.NODE_ENV === "development") {
        console.error(loadError);
      }

      setCompleted([]);
      setPostAvailable(false);
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
      let status: QuestionnaireState;

      if (evaluation.id === "pre") {
        status = hasCompletedPre ? "completed" : "pending";
      } else if (hasCompletedPost) {
        status = "completed";
      } else if (!hasCompletedPre || !postAvailable) {
        status = "locked";
      } else {
        status = "pending";
      }

      return { ...evaluation, status };
    });
  }, [completed, postAvailable]);

  if (loading) {
    return (
      <section className="questionnaires-page" aria-busy="true">
        <PageHeader title="Cuestionarios" description={PAGE_DESCRIPTION} />
        <p className="questionnaires-loading__message" role="status">
          Cargando cuestionarios...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="questionnaires-page">
        <PageHeader title="Cuestionarios" description={PAGE_DESCRIPTION} />
        <div className="questionnaires-error" role="alert" aria-live="polite">
          <p>{error}</p>
          <button type="button" className="btn-primary" onClick={() => void loadQuestionnaires()}>
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="questionnaires-page">
      <PageHeader title="Cuestionarios" description={PAGE_DESCRIPTION} />

      <div className="questionnaires-list">
        {evaluations.map((evaluation) => (
          <EvaluationCard
            key={evaluation.id}
            evaluation={evaluation}
          />
        ))}
      </div>
    </section>
  );
}