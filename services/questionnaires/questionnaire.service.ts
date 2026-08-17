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

import type {
  QuestionnaireProgress,
  QuestionnaireType,
} from "@/types/questionnaire";

export interface QuestionnaireAnswers {
  [questionId: string]: number;
}

interface CompletedQuestionnaireRow {
  questionnaire_type: QuestionnaireType;
}

const VALID_QUESTIONNAIRE_TYPES = ["pre", "post"] as const;

const MIN_ANSWER = 1;

const MAX_ANSWER = 6;

const SUBMISSIONS_TABLE = "questionnaire_submissions";

const ALL_QUESTIONS: readonly Question[] = [
  ...CAPSM_QUESTIONS,
  ...PSOC_QUESTIONS,
  ...ECPP_QUESTIONS,
  ...PSS_QUESTIONS,
  ...KIDSCREEN_QUESTIONS,
];

const QUESTION_MAP = new Map<string, Question>(
  ALL_QUESTIONS.map((question) => [question.id, question]),
);

const ERROR_INVALID_TYPE = "Tipo de cuestionario no válido.";

const ERROR_UNAUTHENTICATED = "Usuario no autenticado.";

const ERROR_EMPTY_ANSWERS = "No se han proporcionado respuestas.";

const ERROR_CHECK = "No se ha podido comprobar el estado del cuestionario.";

const ERROR_SUBMISSION = "No se ha podido crear el registro del cuestionario.";

const ERROR_COMPLETED = "Este cuestionario ya ha sido completado.";

const ERROR_PRE_REQUIRED = "Debes completar primero la evaluación inicial.";

const ERROR_GET_COMPLETED =
  "No se han podido recuperar los cuestionarios completados.";

function validateQuestionnaireType(questionnaireType: QuestionnaireType): void {
  if (!VALID_QUESTIONNAIRE_TYPES.includes(questionnaireType)) {
    throw new Error(ERROR_INVALID_TYPE);
  }
}

function validateAnswers(answers: QuestionnaireAnswers): void {
  const entries = Object.entries(answers);

  if (entries.length === 0) {
    throw new Error(ERROR_EMPTY_ANSWERS);
  }

  for (const [questionId, value] of entries) {
    const question = QUESTION_MAP.get(questionId);

    if (!question) {
      throw new Error(`La pregunta "${questionId}" no existe.`);
    }

    if (!Number.isInteger(value)) {
      throw new Error(`La respuesta de "${questionId}" no es válida.`);
    }

    const scale = SCALES[question.scaleType];

    if (value < MIN_ANSWER || value > MAX_ANSWER || value > scale.length) {
      throw new Error(`La respuesta de "${questionId}" está fuera de rango.`);
    }
  }
}

async function hasCompletedQuestionnaireByUser(
  userId: string,
  questionnaireType: QuestionnaireType,
): Promise<boolean> {
  const { data, error } = await supabase
    .from(SUBMISSIONS_TABLE)
    .select("id")
    .eq("user_id", userId)
    .eq("questionnaire_type", questionnaireType)
    .maybeSingle();

  if (error) {
    throw new Error(ERROR_CHECK);
  }

  return data !== null;
}

export async function submitQuestionnaire(
  questionnaireType: QuestionnaireType,
  answers: QuestionnaireAnswers,
) {
  validateQuestionnaireType(questionnaireType);

  validateAnswers(answers);

  const user = await getUser();

  if (!user) {
    throw new Error(ERROR_UNAUTHENTICATED);
  }

  const alreadyCompleted = await hasCompletedQuestionnaireByUser(
    user.id,
    questionnaireType,
  );

  if (alreadyCompleted) {
    throw new Error(ERROR_COMPLETED);
  }

  if (questionnaireType === "post") {
    const hasCompletedPre = await hasCompletedQuestionnaireByUser(
      user.id,
      "pre",
    );

    if (!hasCompletedPre) {
      throw new Error(ERROR_PRE_REQUIRED);
    }
  }

  const response = await fetch("/api/questionnaires/submit", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      questionnaireType,
      answers,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    error?: string;
    submissionId?: string;
  } | null;

  if (!response.ok || !payload?.ok || !payload.submissionId) {
    throw new Error(payload?.error ?? ERROR_SUBMISSION);
  }

  return {
    id: payload.submissionId,
  };
}

export async function hasCompletedQuestionnaire(
  questionnaireType: QuestionnaireType,
): Promise<boolean> {
  validateQuestionnaireType(questionnaireType);

  const user = await getUser();

  if (!user) {
    return false;
  }

  return hasCompletedQuestionnaireByUser(user.id, questionnaireType);
}

export async function getCompletedQuestionnaires(): Promise<
  QuestionnaireType[]
> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from(SUBMISSIONS_TABLE)
    .select("questionnaire_type")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_GET_COMPLETED);
  }

  return ((data as CompletedQuestionnaireRow[] | null) ?? []).map(
    ({ questionnaire_type }) => questionnaire_type,
  );
}

export async function getQuestionnaireState(): Promise<QuestionnaireProgress> {
  const [preCompleted, postCompleted] = await Promise.all([
    hasCompletedQuestionnaire("pre"),

    hasCompletedQuestionnaire("post"),
  ]);

  return {
    preCompleted,
    postCompleted,
  };
}

export async function canStartPostQuestionnaire(): Promise<boolean> {
  return hasCompletedQuestionnaire("pre");
}
