import type { Questionnaire } from "@/types/questionnaire";

export interface Question {
  id: string;
  question: string;
  scaleType:
    | "agreement_7"
    | "psoc_6"
    | "ecpp_4"
    | "pss_5"
    | "kidscreen_5";

  required?: boolean;
}

export const QUESTIONNAIRE_STEPS = [
  {
    id: "capsm",
    title: "CAPSM-IJ",
    description:
      "Conocimientos y creencias sobre salud mental infantojuvenil.",
  },

  {
    id: "psoc",
    title: "PSOC",
    description:
      "Percepción de competencia parental.",
  },

  {
    id: "ecpp",
    title: "ECPP-P",
    description:
      "Competencias parentales percibidas.",
  },

  {
    id: "pss",
    title: "PSS",
    description:
      "Nivel de estrés parental.",
  },

  {
    id: "kidscreen",
    title: "KIDSCREEN",
    description:
      "Bienestar y calidad de vida del menor.",
  },
];

export const SCALES = {
  agreement_7: [
    "Totalmente de acuerdo",
    "Bastante de acuerdo",
    "Algo de acuerdo",
    "Ni de acuerdo ni en desacuerdo",
    "Algo en desacuerdo",
    "En desacuerdo",
    "Totalmente en desacuerdo",
  ],

  psoc_6: [
    "No, totalmente en desacuerdo",
    "En desacuerdo",
    "En parte desacuerdo",
    "En parte de acuerdo",
    "De acuerdo",
    "Sí, totalmente de acuerdo",
  ],

  ecpp_4: [
    "Nunca",
    "A veces",
    "Casi siempre",
    "Siempre",
  ],

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
};

export const CAPSM_QUESTIONS: Question[] = [
  {
    id: "capsm_1",
    scaleType: "agreement_7",
    required: true,
    question:
      "Si un menor tiene mucho miedo o ansiedad en determinadas situaciones, podría superarlo si realmente quisiera.",
  },

  {
    id: "capsm_2",
    scaleType: "agreement_7",
    required: true,
    question:
      "Buscar ayuda psicológica profesional para un menor significa que su familia no es lo suficientemente fuerte para manejar sus propias dificultades.",
  },

  {
    id: "capsm_3",
    scaleType: "agreement_7",
    required: true,
    question:
      "Evitaría que mi hijo se relacionase demasiado con otros niños con dificultades psicológicas por miedo a que no desarrolle ese mismo problema.",
  },

  {
    id: "capsm_4",
    scaleType: "agreement_7",
    required: true,
    question:
      "Un menor con problemas de salud mental nunca vuelve a estar del todo bien.",
  },

  {
    id: "capsm_5",
    scaleType: "agreement_7",
    required: true,
    question:
      "Los trastornos de salud mental o psicológicos pueden aparecer en cualquier menor.",
  },

  {
    id: "capsm_6",
    scaleType: "agreement_7",
    required: true,
    question:
      "Si un menor tiene problemas de salud mental, pensaría que hay algo mal en sus padres.",
  },

  {
    id: "capsm_7",
    scaleType: "agreement_7",
    required: true,
    question:
      "Buscar ayuda profesional para un problema psicológico o de salud mental podría perjudicar el futuro de mi hijo/a.",
  },

  {
    id: "capsm_8",
    scaleType: "agreement_7",
    required: true,
    question:
      "Sé dónde buscar información fiable sobre salud mental en menores.",
  },

  {
    id: "capsm_9",
    scaleType: "agreement_7",
    required: true,
    question:
      "Me preocuparía que otras personas de mi entorno pudieran pensar mal de mí si mi hijo/a tuviera un problema de salud mental.",
  },

  {
    id: "capsm_10",
    scaleType: "agreement_7",
    required: true,
    question:
      "Me preocuparía que otras personas de mi entorno me juzgaran si mi hijo/a tuviera un problema de salud mental.",
  },

  {
    id: "capsm_11",
    scaleType: "agreement_7",
    required: true,
    question:
      "Me sentiría avergonzado/a de tener un hijo/a con problemas de salud mental.",
  },

  {
    id: "capsm_12",
    scaleType: "agreement_7",
    required: true,
    question:
      "Los signos de depresión en menores son muy similares a los de los adultos.",
  },

  {
    id: "capsm_13",
    scaleType: "agreement_7",
    required: true,
    question:
      "Las dificultades emocionales de los menores (por ejemplo, las que duran varios meses) es mejor dejarlas pasar para que se resuelvan solas con el tiempo.",
  },

  {
    id: "capsm_14",
    scaleType: "agreement_7",
    required: true,
    question:
      "Los menores rara vez presentan trastornos mentales diagnosticables, salvo que hayan sido hereditarios.",
  },

  {
    id: "capsm_15",
    scaleType: "agreement_7",
    required: true,
    question:
      "Un menor se siente muy asustado/a en situaciones como hablar delante de la clase o acudir a fiestas.",
  },

  {
    id: "capsm_16",
    scaleType: "agreement_7",
    required: true,
    question:
      "Un menor que tiene dificultades para concentrarse, se distrae fácilmente, actúa impulsivamente y le cuesta permanecer quieto/a.",
  },

  {
    id: "capsm_17",
    scaleType: "agreement_7",
    required: true,
    question:
      "Un menor que pasa mucho tiempo sintiéndose mal consigo mismo/a y ha perdido el interés por actividades que antes disfrutaba.",
  },

  {
    id: "capsm_18",
    scaleType: "agreement_7",
    required: true,
    question:
      "Profesionales sanitarios, como el médico de familia, pediatra o médico de atención primaria.",
  },

  {
    id: "capsm_19",
    scaleType: "agreement_7",
    required: true,
    question:
      "Profesionales de salud mental, como psicólogos/as o psiquiatras.",
  },

  {
    id: "capsm_20",
    scaleType: "agreement_7",
    required: true,
    question:
      "Personal del centro educativo, como profesores/as, orientadores/as o tutores/as.",
  },

  {
    id: "capsm_21",
    scaleType: "agreement_7",
    required: true,
    question:
      "Amigos, familiares y otras redes de apoyo, como comunidades religiosas, asociaciones o clubes deportivos.",
  },

  {
    id: "capsm_22",
    scaleType: "agreement_7",
    required: true,
    question:
      "¿Qué probabilidad habría de que buscara apoyo en alguna de las opciones anteriores si su hijo/a tuviera una dificultad relacionada con la salud mental?",
  },

  {
    id: "capsm_23",
    scaleType: "agreement_7",
    required: true,
    question:
      "¿Qué nivel de confianza tendría para buscar ayuda si su hijo/a estuviera experimentando una dificultad relacionada con la salud mental?",
  },
];

export const PSOC_QUESTIONS: Question[] = [];

export const ECPP_QUESTIONS: Question[] = [];

export const PSS_QUESTIONS: Question[] = [];

export const KIDSCREEN_QUESTIONS: Question[] = [];

export const EVALUATIONS: Questionnaire[] = [
  {
    id: "pre",
    title: "Evaluación inicial",
    description:
      "Cuestionario previo al programa de acompañamiento familiar. Debe completarse antes de acceder a la evaluación final.",
    blocks: QUESTIONNAIRE_STEPS.length,
    estimatedMinutes: 25,
    status: "pending",
  },

  {
    id: "post",
    title: "Evaluación final",
    description:
      "Disponible una vez se haya completado la evaluación inicial.",
    blocks: QUESTIONNAIRE_STEPS.length,
    estimatedMinutes: 25,
    status: "locked",
  },
];