import type { Question } from "./types";

/**
 * Cuestionario KIDSCREEN.
 *
 * Versión adaptada para el estudio Alpha-Help.
 *
 * Evalúa el bienestar percibido del menor durante
 * los últimos siete días desde la perspectiva del
 * padre, madre o cuidador principal.
 *
 * El orden de las preguntas coincide exactamente
 * con el cuestionario utilizado en el estudio.
 */
export const KIDSCREEN_QUESTIONS: readonly Question[] = [
  {
    id: "kidscreen_1",
    question:
      "¿El niño/a o adolescente se ha sentido lleno/a de energía?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_2",
    question:
      "¿El niño/a o adolescente ha disfrutado de la vida?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_3",
    question:
      "¿El niño/a o adolescente ha estado de buen humor?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_4",
    question:
      "¿El niño/a o adolescente lo ha pasado bien?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_5",
    question:
      "¿El niño/a o adolescente se ha sentido triste?",
    scaleType: "kidscreen_5",
    required: true,
    reverse: true,
  },

  {
    id: "kidscreen_6",
    question:
      "¿El niño/a o adolescente se ha sentido tan mal que no quería hacer nada?",
    scaleType: "kidscreen_5",
    required: true,
    reverse: true,
  },

  {
    id: "kidscreen_7",
    question:
      "¿El niño/a o adolescente se ha sentido solo/a?",
    scaleType: "kidscreen_5",
    required: true,
    reverse: true,
  },

  {
    id: "kidscreen_8",
    question:
      "¿El niño/a o adolescente ha estado contento/a con su forma de ser?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_9",
    question:
      "¿El niño/a o adolescente ha tenido suficiente tiempo para él/ella?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_10",
    question:
      "¿El niño/a o adolescente ha podido hacer las cosas que ha querido en su tiempo libre?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_11",
    question:
      "¿Los padres del niño/a o adolescente han tenido suficiente tiempo para él/ella?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_12",
    question:
      "¿Los padres del niño/a o adolescente lo han tratado de forma justa?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_13",
    question:
      "¿El niño/a o adolescente ha podido hablar con sus padres cuando ha querido?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_14",
    question:
      "¿El niño/a o adolescente ha tenido suficiente dinero para hacer las mismas cosas que sus amigos/as?",
    scaleType: "kidscreen_5",
    required: true,
  },

  {
    id: "kidscreen_15",
    question:
      "¿El/la niño/a o adolescente cree que ha tenido suficiente dinero para sus gastos personales?",
    scaleType: "kidscreen_5",
    required: true,
  },
] as const;