import type { QuestionnaireType } from "@/types/questionnaire";

/**
 * Respuestas del cuestionario.
 *
 * Clave:
 *  questionId
 *
 * Valor:
 *  respuesta seleccionada
 */
export type QuestionnaireAnswers = Record<string, number>;

/**
 * Puntuación de una subescala.
 */
export interface QuestionnaireSubscale {
  /**
   * Nombre de la subescala.
   */
  name: string;

  /**
   * Puntuación obtenida.
   */
  score: number;
}

/**
 * Resultado completo del cálculo
 * de un cuestionario.
 */
export interface QuestionnaireScore {
  /**
   * PRE o POST.
   */
  questionnaire: QuestionnaireType;

  /**
   * Número total de preguntas
   * respondidas.
   */
  answeredQuestions: number;

  /**
   * Indica si todas las preguntas
   * obligatorias fueron respondidas.
   */
  completed: boolean;

  /**
   * Puntuación total.
   */
  totalScore: number;

  /**
   * Subescalas calculadas.
   */
  subscales: QuestionnaireSubscale[];
}

/**
 * Calcula las puntuaciones
 * oficiales de un cuestionario.
 *
 * Actualmente devuelve la
 * estructura base.
 *
 * En los siguientes pasos
 * añadiremos:
 *
 * - CAPSM
 * - PSOC
 * - ECPP
 * - PSS
 * - KIDSCREEN
 */
export function calculateQuestionnaireScore(
  questionnaire: QuestionnaireType,
  answers: QuestionnaireAnswers,
): QuestionnaireScore {
  return {
    questionnaire,

    answeredQuestions: Object.keys(answers).length,

    completed: true,

    totalScore: 0,

    subscales: [],
  };
}