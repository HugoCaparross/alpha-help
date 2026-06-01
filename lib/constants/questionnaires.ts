export interface Question {
  id: string;
  question: string;
  scaleType:
    | "agreement_7"
    | "psoc_6"
    | "ecpp_4"
    | "pss_5"
    | "kidscreen_5";
}

export const QUESTIONNAIRE_STEPS = [
  {
    id: "demographics",
    title: "Datos familiares",
    description:
      "Información sociodemográfica básica.",
  },

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
    question:
      "Si un menor tiene mucho miedo o ansiedad en determinadas situaciones, podría superarlo si realmente quisiera.",
  },

  {
    id: "capsm_2",
    scaleType: "agreement_7",
    question:
      "Buscar ayuda psicológica profesional para un menor significa que su familia no es lo suficientemente fuerte para manejar sus propias dificultades.",
  },

  {
    id: "capsm_3",
    scaleType: "agreement_7",
    question:
      "Evitaría que mi hijo se relacionase demasiado con otros niños con dificultades psicológicas.",
  },
];

export const PSOC_QUESTIONS: Question[] = [];

export const ECPP_QUESTIONS: Question[] = [];

export const PSS_QUESTIONS: Question[] = [];

export const KIDSCREEN_QUESTIONS: Question[] = [];

export const DEMOGRAPHIC_FIELDS = [
  {
    id: "school",
    label: "Centro escolar",
    type: "text",
  },

  {
    id: "gender",
    label: "Sexo",
    type: "select",
    options: [
      "Hombre",
      "Mujer",
      "Otro",
      "Prefiero no responder",
    ],
  },

  {
    id: "age",
    label: "Edad",
    type: "select",
  },

  {
    id: "education",
    label: "Nivel de estudios",
    type: "select",
    options: [
      "Sin estudios",
      "Educación primaria",
      "Educación secundaria",
      "Bachillerato",
      "Formación Profesional",
      "Universitarios",
      "Máster",
      "Doctorado",
    ],
  },

  {
    id: "employment",
    label: "Situación laboral",
    type: "select",
    options: [
      "Empleado/a",
      "Desempleado/a",
      "Autónomo/a",
      "Estudiante",
      "Jubilado/a",
      "Otro",
    ],
  },

  {
    id: "marital_status",
    label: "Estado civil",
    type: "select",
    options: [
      "Soltero/a",
      "Casado/a",
      "Pareja de hecho",
      "Separado/a",
      "Divorciado/a",
      "Viudo/a",
    ],
  },

  {
    id: "socioeconomic_level",
    label: "Nivel socioeconómico percibido",
    type: "select",
    options: [
      "Muy bajo",
      "Bajo",
      "Medio-bajo",
      "Medio",
      "Medio-alto",
      "Alto",
    ],
  },

  {
    id: "children_count",
    label: "Número de hijos",
    type: "select",
    options: [
      "1",
      "2",
      "3",
      "4",
      "5 o más",
    ],
  },

  {
    id: "child_age",
    label: "Edad del hijo/a participante",
    type: "select",
  },

  {
    id: "child_gender",
    label: "Sexo del hijo/a participante",
    type: "select",
    options: [
      "Niño",
      "Niña",
      "Otro",
      "Prefiero no responder",
    ],
  },
];