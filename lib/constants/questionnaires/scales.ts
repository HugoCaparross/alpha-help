import type { ScaleType } from "./types";

/**
 * Escalas utilizadas por los
 * cuestionarios del estudio.
 *
 * La posición de cada elemento
 * determina su valor numérico.
 *
 * IMPORTANTE:
 * questionnaire_responses.answer
 * admite actualmente valores 1-6.
 */
export const SCALES: Record<ScaleType, readonly string[]> = {
  agreement_6: [
    "Muy de acuerdo",
    "De acuerdo",
    "Algo de acuerdo",
    "Algo en desacuerdo",
    "En desacuerdo",
    "Muy en desacuerdo",
  ],

  help_confidence_5: [
    "Mucha confianza",
    "Bastante confianza",
    "No estoy seguro/a",
    "Poca confianza",
    "No acudiría a ellos",
  ],

  help_probability_5: [
    "Muy probable",
    "Bastante probable",
    "Ni probable ni improbable",
    "Poco probable",
    "Muy poco probable",
  ],

  psoc_6: [
    "No, totalmente en desacuerdo",
    "En desacuerdo",
    "En parte en desacuerdo",
    "En parte de acuerdo",
    "De acuerdo",
    "Sí, totalmente de acuerdo",
  ],

  ecpp_4: ["Nunca", "A veces", "Casi siempre", "Siempre"],

  pss_5: [
    "Totalmente en desacuerdo",
    "En desacuerdo",
    "Ni de acuerdo ni en desacuerdo",
    "De acuerdo",
    "Totalmente de acuerdo",
  ],

  kidscreen_5: [
    "Nunca",
    "Casi nunca",
    "Algunas veces",
    "Casi siempre",
    "Siempre",
  ],
} as const;
