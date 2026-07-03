import type {
  Questionnaire,
  QuestionnaireWithStatus,
} from "@/types/questionnaire";

export interface Question {
  id: string;
  question: string;

  scaleType:
    | "agreement_7"
    | "help_confidence_5"
    | "help_probability_5"
    | "psoc_6"
    | "ecpp_4"
    | "pss_5"
    | "kidscreen_5";

  required?: boolean;

  reverse?: boolean;

  dimension?: string;
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

  help_confidence_5: [
    "Mucha confianza",
    "Bastante confianza",
    "No estoy seguro",
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
    scaleType: "help_confidence_5",
    required: true,
    question:
      "Profesionales sanitarios, como el médico de familia, pediatra o médico de atención primaria.",
  },

  {
    id: "capsm_19",
    scaleType: "help_confidence_5",
    required: true,
    question:
      "Profesionales de salud mental, como psicólogos/as o psiquiatras.",
  },

  {
    id: "capsm_20",
    scaleType: "help_confidence_5",
    required: true,
    question:
      "Personal del centro educativo, como profesores/as, orientadores/as o tutores/as.",
  },

  {
    id: "capsm_21",
    scaleType: "help_confidence_5",
    required: true,
    question:
      "Amigos, familiares y otras redes de apoyo, como comunidades religiosas, asociaciones o clubes deportivos.",
  },

  {
    id: "capsm_22",
    scaleType: "help_probability_5",
    required: true,
    question:
      "¿Qué probabilidad habría de que buscara apoyo en alguna de las opciones anteriores si su hijo/a tuviera una dificultad relacionada con la salud mental?",
  },

  {
    id: "capsm_23",
    scaleType: "help_confidence_5",
    required: true,
    question:
      "¿Qué nivel de confianza tendría para buscar ayuda si su hijo/a estuviera experimentando una dificultad relacionada con la salud mental?",
  },
];

export const PSOC_QUESTIONS: Question[] = [
  {
    id: "psoc_1",
    scaleType: "psoc_6",
    required: true,
    question:
      "Es difícil, pero yo ya he aprendido a influir en mis hijos.",
  },

  {
    id: "psoc_2",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Con la edad que tiene mi hijo, ser madre/padre no es agradable.",
  },

  {
    id: "psoc_3",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "En las cosas que tienen que ver con mis hijos, me acuesto igual que me levanto, con la sensación de no haber terminado nada.",
  },

  {
    id: "psoc_4",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "No sé por qué, pero, aunque como padre/madre creo que controlo la situación, a veces siento como si la situación me controlara a mí.",
  },

  {
    id: "psoc_5",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Mi madre/padre estaba mejor preparada/o que yo para ser una buena madre/padre.",
  },

  {
    id: "psoc_6",
    scaleType: "psoc_6",
    required: true,
    question:
      "Yo sería capaz de decirle a unos padres primerizos qué es exactamente lo que tienen que hacer para ser buenos padres.",
  },

  {
    id: "psoc_7",
    scaleType: "psoc_6",
    required: true,
    question:
      "Ser padre/madre es algo llevadero y cualquier problema se resuelve fácilmente.",
  },

  {
    id: "psoc_8",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Una de las cosas más difíciles de ser padre/madre es saber si lo estás haciendo bien o no.",
  },

  {
    id: "psoc_9",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Como padre/madre, a veces siento que no doy abasto.",
  },

  {
    id: "psoc_10",
    scaleType: "psoc_6",
    required: true,
    question:
      "He conseguido ser tan buen/a padre/madre como quería.",
  },

  {
    id: "psoc_11",
    scaleType: "psoc_6",
    required: true,
    question:
      "Si hay alguien que sabe lo que le pasa a mi hijo/a cuando está raro/a, esa/e soy yo.",
  },

  {
    id: "psoc_12",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Se me da mejor y disfruto más haciendo otras cosas diferentes a ser padre/madre.",
  },

  {
    id: "psoc_13",
    scaleType: "psoc_6",
    required: true,
    question:
      "Teniendo en cuenta el tiempo que llevo siendo padre/madre, me manejo muy bien con estas cosas.",
  },

  {
    id: "psoc_14",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Si ser padre/madre fuera más interesante, lo haría con más ganas.",
  },

  {
    id: "psoc_15",
    scaleType: "psoc_6",
    required: true,
    question:
      "Creo que soy capaz de hacer todas las cosas que hacen falta para ser un/a buen/a padre/madre.",
  },

  {
    id: "psoc_16",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
    question:
      "Ser padre/madre me pone nervioso/a y ansioso/a.",
  },
];

export const ECPP_QUESTIONS: Question[] = [
  {
    id: "ecpp_1",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Felicito a mis hijos/as cada vez que hacen algo bien.",
  },

  {
    id: "ecpp_2",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Promuevo en casa las reglas, normas y expectativas de conducta que mis hijos reciben del centro educativo.",
  },

  {
    id: "ecpp_3",
    scaleType: "ecpp_4",
    required: true,
    question:
      "En casa apoyo para que cada uno exprese sus opiniones.",
  },

  {
    id: "ecpp_4",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Acompaño a mis hijos/as en los deberes y tareas que les mandan del centro educativo.",
  },

  {
    id: "ecpp_5",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Acudo a lugares donde hay más menores para hacer que mis hijos se relacionen más.",
  },

  {
    id: "ecpp_6",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Veo con mis hijos/as ciertos programas de TV y los comento después con ellos.",
  },

  {
    id: "ecpp_7",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Me preocupo por acompañar a mis hijos en diferentes actividades programadas.",
  },

  {
    id: "ecpp_8",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Colaboro en las tareas del hogar y así transmitir la importancia de la colaboración y la responsabilidad.",
  },

  {
    id: "ecpp_9",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Ayudo a mis hijos/as a establecer una rutina diaria en cuanto a hábitos de higiene.",
  },

  {
    id: "ecpp_10",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Mantengo organizado una especie de archivo de mis hijos/as donde se incluyan datos médicos, escolares y legales.",
  },

  {
    id: "ecpp_11",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Procuro estar atento/a a los intereses, talentos y habilidades de mis hijos/as y los apoyo en ellos.",
  },

  {
    id: "ecpp_12",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Tenemos horarios fijos en los que mis hijos tienen que estar acostados o levantados.",
  },

  {
    id: "ecpp_13",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Dedico un tiempo al día para hablar con mis hijos/as.",
  },

  {
    id: "ecpp_14",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Ayudo a mis hijos/as a establecer una rutina diaria en lo referido al estudio.",
  },

  {
    id: "ecpp_15",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Hago pequeñas salidas familiares al cine, zoológico, museos, parques u otras ciudades.",
  },

  {
    id: "ecpp_16",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Dispongo de suficiente tiempo para atender y cuidar a mis hijos/as.",
  },

  {
    id: "ecpp_17",
    scaleType: "ecpp_4",
    required: true,
    question:
      "Soy muy consciente de los cambios que ha experimentado mi familia con la llegada de los hijos/as en mi rol de padre/madre.",
  },
];

export const PSS_QUESTIONS: Question[] = [
  {
    id: "pss_1",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Me siento feliz en mi papel como padre/madre.",
  },

  {
    id: "pss_2",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "No hay nada o casi nada que no haría por mi hijo/a si fuera necesario.",
  },

  {
    id: "pss_3",
    scaleType: "pss_5",
    required: true,
    question:
      "Atender a mi hijo/a a veces me quita más tiempo y energía de la que tengo.",
  },

  {
    id: "pss_4",
    scaleType: "pss_5",
    required: true,
    question:
      "A veces me preocupa el hecho de si estoy haciendo lo suficiente por mi hijo/a.",
  },

  {
    id: "pss_5",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Me siento muy cercano/a a mi hijo/a.",
  },

  {
    id: "pss_6",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Disfruto pasando tiempo con mi hijo/a.",
  },

  {
    id: "pss_7",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Mi hijo/a es una fuente importante de afecto para mí.",
  },

  {
    id: "pss_8",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Tener un hijo/a me da una visión más certera y optimista para el futuro.",
  },

  {
    id: "pss_9",
    scaleType: "pss_5",
    required: true,
    question:
      "La mayor fuente de estrés en mi vida es mi hijo/a.",
  },

  {
    id: "pss_10",
    scaleType: "pss_5",
    required: true,
    question:
      "Tener un hijo/a deja poco tiempo y flexibilidad en mi vida.",
  },

  {
    id: "pss_11",
    scaleType: "pss_5",
    required: true,
    question:
      "Tener un hijo/a ha supuesto una carga financiera.",
  },

  {
    id: "pss_12",
    scaleType: "pss_5",
    required: true,
    question:
      "Me resulta difícil equilibrar diferentes responsabilidades debido a mi hijo/a.",
  },

  {
    id: "pss_13",
    scaleType: "pss_5",
    required: true,
    question:
      "El comportamiento de mi hijo/a a menudo me resulta incómodo o estresante.",
  },

  {
    id: "pss_14",
    scaleType: "pss_5",
    required: true,
    question:
      "Si tuviera que hacerlo de nuevo, podría decidir no tener un hijo/a.",
  },

  {
    id: "pss_15",
    scaleType: "pss_5",
    required: true,
    question:
      "Me siento abrumado/a por la responsabilidad de ser padre/madre.",
  },

  {
    id: "pss_16",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Me siento satisfecho/a como padre/madre.",
  },

  {
    id: "pss_17",
    scaleType: "pss_5",
    required: true,
    reverse: true,
    question:
      "Disfruto de mi hijo/a.",
  },
];

export const KIDSCREEN_QUESTIONS: Question[] = [
  {
    id: "kidscreen_1",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente se ha sentido lleno/a de energía?",
  },

  {
    id: "kidscreen_2",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha disfrutado de la vida?",
  },

  {
    id: "kidscreen_3",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha estado de buen humor?",
  },

  {
    id: "kidscreen_4",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente lo ha pasado bien?",
  },

  {
    id: "kidscreen_5",
    scaleType: "kidscreen_5",
    required: true,
    reverse: true,
    question:
      "¿El niño/a o adolescente se ha sentido triste?",
  },

  {
    id: "kidscreen_6",
    scaleType: "kidscreen_5",
    required: true,
    reverse: true,
    question:
      "¿El niño/a o adolescente se ha sentido tan mal que no quería hacer nada?",
  },

  {
    id: "kidscreen_7",
    scaleType: "kidscreen_5",
    required: true,
    reverse: true,
    question:
      "¿El niño/a o adolescente se ha sentido solo/a?",
  },

  {
    id: "kidscreen_8",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha estado contento/a con su forma de ser?",
  },

  {
    id: "kidscreen_9",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha tenido suficiente tiempo para él/ella?",
  },

  {
    id: "kidscreen_10",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha podido hacer las cosas que ha querido en su tiempo libre?",
  },

  {
    id: "kidscreen_11",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿Los padres del niño/a o adolescente han tenido suficiente tiempo para él/ella?",
  },

  {
    id: "kidscreen_12",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿Los padres del niño/a o adolescente lo han tratado de forma justa?",
  },

  {
    id: "kidscreen_13",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha podido hablar con sus padres cuando ha querido?",
  },

  {
    id: "kidscreen_14",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El niño/a o adolescente ha tenido suficiente dinero para hacer las mismas cosas que sus amigos/as?",
  },

  {
    id: "kidscreen_15",
    scaleType: "kidscreen_5",
    required: true,
    question:
      "¿El/la niño/a o adolescente cree que ha tenido suficiente dinero para sus gastos personales?",
  },
];

export const EVALUATIONS: QuestionnaireWithStatus[] = [
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