import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

import {
  CAPSM_QUESTIONS,
  ECPP_QUESTIONS,
  KIDSCREEN_QUESTIONS,
  PSOC_QUESTIONS,
  PSS_QUESTIONS,
  SCALES,
  type Question,
} from "@/lib/constants/questionnaires";

/* =========================
   TIPOS
========================= */

export type QuestionnaireType =
  | "pre"
  | "post";

export interface QuestionnaireAnswers {
  [questionId: string]: number;
}

/* =========================
   CONSTANTES
========================= */

const VALID_QUESTIONNAIRE_TYPES = [
  "pre",
  "post",
] as const;

const SUBMISSIONS_TABLE =
  "questionnaire_submissions";

const RESPONSES_TABLE =
  "questionnaire_responses";

const ALL_QUESTIONS: Question[] = [
  ...CAPSM_QUESTIONS,
  ...PSOC_QUESTIONS,
  ...ECPP_QUESTIONS,
  ...PSS_QUESTIONS,
  ...KIDSCREEN_QUESTIONS,
];

const QUESTION_MAP = new Map(
  ALL_QUESTIONS.map((question) => [
    question.id,
    question,
  ]),
);

/* =========================
   VALIDACIONES
========================= */

function validateQuestionnaireType(
  questionnaireType: QuestionnaireType,
): void {
  if (
    !VALID_QUESTIONNAIRE_TYPES.includes(
      questionnaireType,
    )
  ) {
    throw new Error(
      "Tipo de cuestionario no válido.",
    );
  }
}

function validateAnswers(
  answers: QuestionnaireAnswers,
): void {
  const entries =
    Object.entries(answers);

  if (entries.length === 0) {
    throw new Error(
      "No se han proporcionado respuestas.",
    );
  }

  for (const [
    questionId,
    value,
  ] of entries) {
    const question =
      QUESTION_MAP.get(questionId);

    if (!question) {
      throw new Error(
        `La pregunta "${questionId}" no existe.`,
      );
    }

    if (
      !Number.isInteger(value)
    ) {
      throw new Error(
        `La respuesta de "${questionId}" no es válida.`,
      );
    }

    const scale =
      SCALES[question.scaleType];

    if (
      value < 1 ||
      value > scale.length
    ) {
      throw new Error(
        `La respuesta de "${questionId}" está fuera de rango.`,
      );
    }
  }
}

/* =========================
   HELPERS
========================= */

function buildResponses(
  submissionId: string,
  userId: string,
  questionnaireType: QuestionnaireType,
  answers: QuestionnaireAnswers,
) {
  return Object.entries(
    answers,
  ).map(
    ([questionKey, answer]) => ({
      submission_id:
        submissionId,
      user_id: userId,
      questionnaire_type:
        questionnaireType,
      question_key:
        questionKey,
      answer,
    }),
  );
}

async function hasCompletedQuestionnaireByUser(
  userId: string,
  questionnaireType: QuestionnaireType,
): Promise<boolean> {
  const { data, error } =
    await supabase
      .from(SUBMISSIONS_TABLE)
      .select("id")
      .eq("user_id", userId)
      .eq(
        "questionnaire_type",
        questionnaireType,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      "No se ha podido comprobar el estado del cuestionario.",
    );
  }

  return data !== null;
}
/* =========================
   FUNCIONES PÚBLICAS
========================= */

/**
 * Guarda un cuestionario completado junto con todas sus respuestas.
 *
 * Realiza las siguientes comprobaciones:
 * - Usuario autenticado.
 * - Tipo de cuestionario válido.
 * - Respuestas válidas.
 * - Cuestionario no completado previamente.
 * - El POST únicamente puede realizarse tras completar el PRE.
 */
export async function submitQuestionnaire(
  questionnaireType: QuestionnaireType,
  answers: QuestionnaireAnswers,
) {
  validateQuestionnaireType(questionnaireType);

  validateAnswers(answers);

  const user = await getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const alreadyCompleted =
    await hasCompletedQuestionnaireByUser(
      user.id,
      questionnaireType,
    );

  if (alreadyCompleted) {
    throw new Error(
      "Este cuestionario ya ha sido completado.",
    );
  }

  if (questionnaireType === "post") {
    const hasCompletedPre =
      await hasCompletedQuestionnaireByUser(
        user.id,
        "pre",
      );

    if (!hasCompletedPre) {
      throw new Error(
        "Debes completar primero la evaluación inicial.",
      );
    }
  }

  const {
    data: submission,
    error: submissionError,
  } = await supabase
    .from(SUBMISSIONS_TABLE)
    .insert({
      user_id: user.id,
      questionnaire_type: questionnaireType,
    })
    .select()
    .single();

  if (submissionError || !submission) {
    throw new Error(
      "No se ha podido crear el registro del cuestionario.",
    );
  }

  const responses = buildResponses(
    submission.id,
    user.id,
    questionnaireType,
    answers,
  );

  const {
    error: responsesError,
  } = await supabase
    .from(RESPONSES_TABLE)
    .insert(responses);

  if (responsesError) {
    await supabase
      .from(SUBMISSIONS_TABLE)
      .delete()
      .eq("id", submission.id);

    throw new Error(
      "No se han podido guardar las respuestas del cuestionario.",
    );
  }

  return submission;
}

export async function hasCompletedQuestionnaire(
  questionnaireType: QuestionnaireType,
): Promise<boolean> {
  validateQuestionnaireType(
    questionnaireType,
  );

  const user = await getUser();

  if (!user) {
    return false;
  }

  return hasCompletedQuestionnaireByUser(
    user.id,
    questionnaireType,
  );
}

export async function getCompletedQuestionnaires(): Promise<
  QuestionnaireType[]
> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } =
    await supabase
      .from(SUBMISSIONS_TABLE)
      .select(
        "questionnaire_type",
      )
      .eq(
        "user_id",
        user.id,
      );

  if (error) {
    throw new Error(
      "No se han podido recuperar los cuestionarios completados.",
    );
  }

  return data.map(
    ({
      questionnaire_type,
    }) =>
      questionnaire_type as QuestionnaireType,
  );
}