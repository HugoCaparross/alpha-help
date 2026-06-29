import type { Question } from "./types";

/**
 * Cuestionario CAPSM.
 *
 * Instrumento de alfabetización en salud mental
 * dirigido a padres y madres.
 *
 * El orden de las preguntas coincide con el
 * instrumento oficial utilizado en el estudio.
 */
export const CAPSM_QUESTIONS: readonly Question[] = [
  /*********************************
   * Creencias, conocimientos
   * y estigma en salud mental
   *********************************/

  {
    id: "capsm_1",
    question:
      "Si un menor tiene mucho miedo o ansiedad en determinadas situaciones, podría superarlo si realmente quisiera.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_2",
    question:
      "Buscar ayuda psicológica profesional para un menor significa que su familia no es lo suficientemente fuerte para manejar sus propias dificultades.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_3",
    question:
      "Evitaría que mi hijo se relacionase demasiado con otro niño con dificultades psicológicas por miedo a que desarrolle ese mismo problema.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_4",
    question:
      "Un menor con problemas de salud mental nunca vuelve a estar del todo bien.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_5",
    question:
      "Los trastornos de salud mental o psicológicos pueden aparecer en cualquier menor.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_6",
    question:
      "Si un menor tiene problemas de salud mental, pensaría que hay algo mal en sus padres.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_7",
    question:
      "Buscar ayuda profesional para un problema psicológico o de salud mental podría perjudicar el futuro de mi hijo/a.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_8",
    question:
      "Sé dónde buscar información fiable sobre salud mental en menores.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_9",
    question:
      "Me preocuparía que otras personas de mi entorno pudieran pensar mal de mí si mi hijo/a tuviera un problema de salud mental.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_10",
    question:
      "Me preocuparía que otras personas de mi entorno me juzgaran si mi hijo/a tuviera un problema de salud mental.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_11",
    question:
      "Me sentiría avergonzado/a de tener un hijo/a con problemas de salud mental.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_12",
    question:
      "Los signos de depresión en menores son muy similares a los de los adultos.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_13",
    question:
      "Las dificultades emocionales de los menores (por ejemplo, las que duran varios meses) es mejor dejarlas pasar para que se resuelvan solas con el tiempo.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_14",
    question:
      "Los menores rara vez presentan trastornos mentales diagnosticables, salvo que hayan sido heredados.",
    scaleType: "agreement_7",
    required: true,
  },

  /*********************************
   * Reconocimiento de problemas
   * de salud mental
   *********************************/

  {
    id: "capsm_15",
    question:
      "Un menor se siente muy asustado/a en situaciones como hablar delante de la clase o acudir a fiestas.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_16",
    question:
      "Un menor que tiene dificultades para concentrarse, se distrae fácilmente, actúa impulsivamente y le cuesta permanecer quieto/a.",
    scaleType: "agreement_7",
    required: true,
  },

  {
    id: "capsm_17",
    question:
      "Un menor que pasa mucho tiempo sintiéndose mal consigo mismo/a y ha perdido el interés por actividades que antes disfrutaba.",
    scaleType: "agreement_7",
    required: true,
  },

  /*********************************
   * Confianza en recursos de ayuda
   *********************************/

  {
    id: "capsm_18",
    question:
      "Profesionales sanitarios, como el médico de familia, pediatra o médico de atención primaria.",
    scaleType: "help_confidence_5",
    required: true,
  },

  {
    id: "capsm_19",
    question:
      "Profesionales de salud mental, como psicólogos/as o psiquiatras.",
    scaleType: "help_confidence_5",
    required: true,
  },

  {
    id: "capsm_20",
    question:
      "Personal del centro educativo, como profesores/as, orientadores/as o tutores/as.",
    scaleType: "help_confidence_5",
    required: true,
  },

  {
    id: "capsm_21",
    question:
      "Amigos, familiares y otras redes de apoyo, como comunidades religiosas, asociaciones o clubes deportivos.",
    scaleType: "help_confidence_5",
    required: true,
  },

  /*********************************
   * Intención de búsqueda de ayuda
   *********************************/

  {
    id: "capsm_22",
    question:
      "¿Qué probabilidad habría de que buscara apoyo en alguna de las opciones anteriores si su hijo/a tuviera una dificultad relacionada con la salud mental?",
    scaleType: "help_probability_5",
    required: true,
  },

  {
    id: "capsm_23",
    question:
      "¿Qué nivel de confianza tendría para buscar ayuda si su hijo/a estuviera experimentando una dificultad relacionada con la salud mental?",
    scaleType: "help_confidence_5",
    required: true,
  },
] as const;