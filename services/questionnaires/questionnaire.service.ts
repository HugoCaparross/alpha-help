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

import type { User } from "@supabase/supabase-js";

import type {
  QuestionnaireProgress,
  QuestionnaireType,
} from "@/types/questionnaire";

export interface QuestionnaireAnswers {
  [questionId: string]: number;
}

const VALID_QUESTIONNAIRE_TYPES = ["pre", "post"] as const;

const MIN_ANSWER = 1;

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

async function getAuthenticatedUserWithRefresh(): Promise<User | null> {
  const user = await getUser();

  if (user) {
    return user;
  }

  const { data, error } = await supabase.auth.refreshSession();

  if (error || !data.user) {
    return null;
  }

  return data.user;
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

    if (value < MIN_ANSWER || value > scale.length) {
      throw new Error(`La respuesta de "${questionId}" está fuera de rango.`);
    }
  }
}

async function hasCompletedQuestionnaireByUser(
  userId: string,
  questionnaireType: QuestionnaireType,
): Promise<boolean> {
  const { data: submission, error: submissionError } = await supabase
    .from(SUBMISSIONS_TABLE)
    .select("id")
    .eq("user_id", userId)
    .eq("questionnaire_type", questionnaireType)
    .maybeSingle();

  if (submissionError) {
    throw new Error(ERROR_CHECK);
  }

  if (!submission) {
    return false;
  }

  const requiredQuestionIds = ALL_QUESTIONS.filter(
    (question) => question.required,
  ).map((question) => question.id);

  const { data: responses, error: responsesError } = await supabase
    .from("questionnaire_responses")
    .select("question_key")
    .eq("submission_id", submission.id)
    .eq("user_id", userId);

  if (responsesError) {
    throw new Error(ERROR_CHECK);
  }

  const responseKeys = new Set(
    (responses ?? []).map((response) => response.question_key),
  );

  return (
    responseKeys.size === requiredQuestionIds.length &&
    requiredQuestionIds.every((questionId) => responseKeys.has(questionId))
  );
}

export async function submitQuestionnaire(
  questionnaireType: QuestionnaireType,
  answers: QuestionnaireAnswers,
) {
  validateQuestionnaireType(questionnaireType);

  validateAnswers(answers);

  const user = await getAuthenticatedUserWithRefresh();

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

  const requestBody = JSON.stringify({
    questionnaireType,
    answers,
  });

  async function sendSubmissionRequest() {
    return fetch("/api/questionnaires/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  }

  let response = await sendSubmissionRequest();

  // Si la sesión ha quedado obsoleta mientras el participante
  // estaba respondiendo, renovamos la sesión y repetimos el envío
  // una única vez.
  if (response.status === 401) {
    const { data, error } = await supabase.auth.refreshSession();

    if (!error && data.session) {
      response = await sendSubmissionRequest();
    }
  }

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

  const { data: submissions, error } = await supabase
    .from(SUBMISSIONS_TABLE)
    .select("id, questionnaire_type")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_GET_COMPLETED);
  }

  const completed = await Promise.all(
    ((submissions as Array<{ id: string; questionnaire_type: QuestionnaireType }> | null) ?? []).map(
      async ({ id, questionnaire_type }) => {
        const { data: responses, error: responsesError } = await supabase
          .from("questionnaire_responses")
          .select("question_key")
          .eq("submission_id", id)
          .eq("user_id", user.id);

        if (responsesError) {
          throw new Error(ERROR_GET_COMPLETED);
        }

        const responseKeys = new Set(
          (responses ?? []).map((response) => response.question_key),
        );

        const requiredQuestionIds = ALL_QUESTIONS.filter(
          (question) => question.required,
        ).map((question) => question.id);

        return responseKeys.size === requiredQuestionIds.length &&
          requiredQuestionIds.every((questionId) => responseKeys.has(questionId))
          ? questionnaire_type
          : null;
      },
    ),
  );

  return completed.filter(
    (questionnaireType): questionnaireType is QuestionnaireType =>
      questionnaireType !== null,
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
  const hasCompletedPre = await hasCompletedQuestionnaire("pre");

  if (!hasCompletedPre) {
    return false;
  }

  const response = await fetch("/api/questionnaires/status", {
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json().catch(() => null)) as {
    postAvailable?: boolean;
  } | null;

  return payload?.postAvailable === true;
}
