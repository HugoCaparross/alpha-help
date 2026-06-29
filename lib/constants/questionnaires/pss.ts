import type { Question } from "./types";

/**
 * Cuestionario PSS.
 *
 * Parental Stress Scale.
 *
 * Evalúa el nivel de estrés parental asociado
 * al ejercicio del rol de padre o madre.
 *
 * El orden de las preguntas coincide con el
 * instrumento oficial utilizado en el estudio.
 */
export const PSS_QUESTIONS: readonly Question[] = [
  {
    id: "pss_1",
    question:
      "Me siento feliz en mi papel como padre/madre.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_2",
    question:
      "No hay nada o casi nada que no haría por mi hijo/a si fuera necesario.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_3",
    question:
      "Atender a mi hijo/a a veces me quita más tiempo y energía de la que tengo.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_4",
    question:
      "A veces me preocupa el hecho de si estoy haciendo lo suficiente por mi hijo/a.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_5",
    question:
      "Me siento muy cercano/a a mi hijo/a.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_6",
    question:
      "Disfruto pasando tiempo con mi hijo/a.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_7",
    question:
      "Mi hijo/a es una fuente importante de afecto para mí.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_8",
    question:
      "Tener un hijo/a me da una visión más certera y optimista para el futuro.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_9",
    question:
      "La mayor fuente de estrés en mi vida es mi hijo/a.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_10",
    question:
      "Tener un hijo/a deja poco tiempo y flexibilidad en mi vida.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_11",
    question:
      "Tener un hijo/a ha supuesto una carga financiera.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_12",
    question:
      "Me resulta difícil equilibrar diferentes responsabilidades debido a mi hijo/a.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_13",
    question:
      "El comportamiento de mi hijo/a a menudo me resulta incómodo o estresante.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_14",
    question:
      "Si tuviera que hacerlo de nuevo, podría decidir no tener un hijo/a.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_15",
    question:
      "Me siento abrumado/a por la responsabilidad de ser padre/madre.",
    scaleType: "pss_5",
    required: true,
  },

  {
    id: "pss_16",
    question:
      "Me siento satisfecho/a como padre/madre.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },

  {
    id: "pss_17",
    question:
      "Disfruto de mi hijo/a.",
    scaleType: "pss_5",
    required: true,
    reverse: true,
  },
] as const;