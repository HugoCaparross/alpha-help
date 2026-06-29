import type { Question } from "./types";

/**
 * Cuestionario PSOC.
 *
 * Parenting Sense of Competence Scale.
 *
 * Evalúa la percepción de competencia parental
 * y la satisfacción con el rol de padre o madre.
 *
 * El orden de las preguntas coincide con el
 * instrumento oficial utilizado en el estudio.
 */
export const PSOC_QUESTIONS: readonly Question[] = [
  /*********************************
   * Competencia parental
   *********************************/

  {
    id: "psoc_1",
    question:
      "Es difícil, pero yo ya he aprendido a influir en mis hijos.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_2",
    question:
      "Con la edad que tiene mi hijo, ser madre/padre no es agradable.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_3",
    question:
      "En las cosas que tienen que ver con mis hijos, me acuesto igual que me levanto, con la sensación de no haber terminado nada.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_4",
    question:
      "No sé por qué, pero, aunque como padre/madre creo que controlo la situación, a veces siento como si la situación me controlara a mí.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_5",
    question:
      "Mi madre/padre estaba mejor preparada/o que yo para ser una buena madre/padre.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_6",
    question:
      "Yo sería capaz de decirle a unos padres primerizos qué es exactamente lo que tienen que hacer para ser buenos padres.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_7",
    question:
      "Ser padre/madre es algo llevadero y cualquier problema se resuelve fácilmente.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_8",
    question:
      "Una de las cosas más difíciles de ser padre/madre es saber si lo estás haciendo bien o no.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_9",
    question:
      "Como padre/madre, a veces siento que no doy abasto.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_10",
    question:
      "He conseguido ser tan buen/a padre/madre como quería.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_11",
    question:
      "Si hay alguien que sabe lo que le pasa a mi hijo/a cuando está raro/a, esa/e soy yo.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_12",
    question:
      "Se me da mejor y disfruto más haciendo otras cosas diferentes a ser padre/madre.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_13",
    question:
      "Teniendo en cuenta el tiempo que llevo siendo padre/madre, me manejo muy bien con estas cosas.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_14",
    question:
      "Si ser padre/madre fuera más interesante, lo haría con más ganas.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },

  {
    id: "psoc_15",
    question:
      "Creo que soy capaz de hacer todas las cosas que hacen falta para ser un/a buen/a padre/madre.",
    scaleType: "psoc_6",
    required: true,
  },

  {
    id: "psoc_16",
    question:
      "Ser padre/madre me pone nervioso/a y ansioso/a.",
    scaleType: "psoc_6",
    required: true,
    reverse: true,
  },
] as const;