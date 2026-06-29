import type { QuestionnaireType } from "@/types/questionnaire";

/**
 * Información general de un
 * cuestionario del estudio.
 */
export interface Evaluation {
  /**
   * Identificador del cuestionario.
   */
  id: QuestionnaireType;

  /**
   * Nombre mostrado al usuario.
   */
  title: string;

  /**
   * Descripción breve.
   */
  description: string;

  /**
   * Número de bloques que contiene.
   */
  blocks: number;

  /**
   * Duración estimada en minutos.
   */
  estimatedMinutes: number;
}

/**
 * Cuestionarios disponibles
 * dentro del programa.
 */
export const EVALUATIONS: readonly Evaluation[] = [
  {
    id: "pre",
    title: "Evaluación inicial (PRE)",
    description:
      "Completa la evaluación inicial antes de comenzar el programa.",
    blocks: 5,
    estimatedMinutes: 20,
  },
  {
    id: "post",
    title: "Evaluación final (POST)",
    description:
      "Completa la evaluación final tras finalizar el programa.",
    blocks: 5,
    estimatedMinutes: 20,
  },
] as const;