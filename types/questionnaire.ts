/**
 * Tipos de cuestionario disponibles
 * dentro del programa.
 */
export type QuestionnaireType =
  | "pre"
  | "post";

/**
 * Estado del cuestionario
 * para un usuario.
 */
export type QuestionnaireStatus =
  | "pending"
  | "completed"
  | "locked";

/**
 * Definición de un cuestionario
 * dentro del programa.
 */
export interface Questionnaire {
  id: QuestionnaireType;

  title: string;

  description: string;

  blocks: number;

  estimatedMinutes: number;
}

/**
 * Cuestionario junto con su estado
 * para el usuario actual.
 */
export interface QuestionnaireWithStatus
  extends Questionnaire {
  status: QuestionnaireStatus;
}