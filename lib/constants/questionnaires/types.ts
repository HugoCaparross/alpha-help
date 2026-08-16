/**
 * Tipos de escalas disponibles
 * para las preguntas del estudio.
 *
 * Deben corresponder siempre con
 * las escalas definidas en scales.ts.
 */
export type ScaleType =
  | "agreement_6"
  | "help_confidence_5"
  | "help_probability_5"
  | "psoc_6"
  | "ecpp_4"
  | "pss_5"
  | "kidscreen_5";

/**
 * Definición de una pregunta
 * de cualquier cuestionario.
 */
export interface Question {
  /**
   * Identificador único.
   */
  id: string;

  /**
   * Texto literal de la pregunta.
   */
  question: string;

  /**
   * Escala utilizada por la pregunta.
   */
  scaleType: ScaleType;

  /**
   * Indica si la pregunta es obligatoria.
   */
  required: boolean;

  /**
   * Indica si la puntuación debe
   * invertirse durante el cálculo.
   */
  reverse?: boolean;
}

/**
 * Identificadores de los bloques
 * del cuestionario.
 */
export type QuestionnaireStepId =
  | "capsm"
  | "psoc"
  | "ecpp"
  | "pss"
  | "kidscreen";

/**
 * Información de cada bloque
 * mostrado durante la evaluación.
 */
export interface QuestionnaireStep {
  id: QuestionnaireStepId;

  title: string;
}
