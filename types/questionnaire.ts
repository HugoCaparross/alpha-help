/**
 * Tipos de cuestionario disponibles
 * dentro del programa.
 */
export type QuestionnaireType =
  | "pre"
  | "post";

/**
 * Estado de un cuestionario
 * dentro de la interfaz.
 */
export type QuestionnaireState =
  | "pending"
  | "completed"
  | "locked";

/**
 * Estado global de los cuestionarios
 * del participante.
 */
export interface QuestionnaireProgress {
  readonly preCompleted: boolean;

  readonly postCompleted: boolean;
}

/**
 * Definición de un cuestionario
 * dentro del programa.
 */
export interface Questionnaire {
  readonly id: QuestionnaireType;

  readonly title: string;

  readonly description: string;

  readonly blocks: number;

  readonly estimatedMinutes: number;
}

/**
 * Cuestionario junto con su estado
 * para el usuario actual.
 */
export interface QuestionnaireWithStatus
  extends Questionnaire {
  readonly status: QuestionnaireState;
}