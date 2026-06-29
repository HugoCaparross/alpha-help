import type { QuestionnaireStep } from "./types";

/**
 * Bloques oficiales que componen
 * el cuestionario del estudio.
 *
 * El orden de este listado determina
 * el flujo completo de la evaluación.
 */
export const QUESTIONNAIRE_STEPS: readonly QuestionnaireStep[] = [
  {
    id: "capsm",
    title: "CAPSM",
  },
  {
    id: "psoc",
    title: "PSOC",
  },
  {
    id: "ecpp",
    title: "ECPP-P",
  },
  {
    id: "pss",
    title: "PSS",
  },
  {
    id: "kidscreen",
    title: "KIDSCREEN-10",
  },
] as const;