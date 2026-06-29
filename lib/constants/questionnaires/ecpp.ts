import type { Question } from "./types";

/**
 * Cuestionario ECPP-P.
 *
 * Escala de Competencia Parental Percibida.
 *
 * Evalúa conductas y competencias parentales
 * relacionadas con la educación, comunicación,
 * acompañamiento y apoyo al desarrollo de los hijos.
 *
 * El orden de las preguntas coincide con el
 * instrumento oficial utilizado en el estudio.
 */
export const ECPP_QUESTIONS: readonly Question[] = [
  {
    id: "ecpp_1",
    question:
      "Felicito a mis hijos/as cada vez que hacen algo bien.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_2",
    question:
      "Promuevo en casa las reglas, normas y expectativas de conducta que mis hijos reciben del centro educativo.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_3",
    question:
      "En casa apoyo para que cada uno exprese sus opiniones.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_4",
    question:
      "Acompaño a mis hijos/as en los deberes y tareas que les mandan del centro educativo.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_5",
    question:
      "Acudo a lugares donde hay más menores para hacer que mis hijos se relacionen más.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_6",
    question:
      "Veo con mis hijos/as ciertos programas de TV y los comento después con ellos.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_7",
    question:
      "Me preocupo por acompañar a mis hijos en diferentes actividades programadas.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_8",
    question:
      "Colaboro en las tareas del hogar y así transmito la importancia de la colaboración y la responsabilidad.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_9",
    question:
      "Ayudo a mis hijos/as a establecer una rutina diaria en cuanto a hábitos de higiene.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_10",
    question:
      "Mantengo organizado una especie de archivo/registro de mis hijos/as donde se incluyen datos médicos, escolares, legales…",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_11",
    question:
      "Procuro estar atento/a a los intereses, talentos y habilidades de mis hijos/as y les apoyo en ellos.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_12",
    question:
      "Tenemos horarios fijos en los que mis hijos/as tienen que estar acostados o levantados.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_13",
    question:
      "Dedico un tiempo al día para hablar con mis hijos/as.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_14",
    question:
      "Ayudo a mis hijos/as a establecer una rutina diaria en lo referido al estudio.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_15",
    question:
      "Hago pequeñas salidas familiares al cine, zoológico, museos, parques, otras ciudades…",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_16",
    question:
      "Dispongo de suficiente tiempo para atender y cuidar a mis hijos/as.",
    scaleType: "ecpp_4",
    required: true,
  },

  {
    id: "ecpp_17",
    question:
      "Soy muy consciente de los cambios que ha experimentado mi familia con la llegada de los hijos/as en mi rol de padre/madre.",
    scaleType: "ecpp_4",
    required: true,
  },
] as const;