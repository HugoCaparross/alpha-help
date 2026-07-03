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

export interface QuestionnaireStatus {
  preCompleted: boolean;

  postCompleted: boolean;
}

interface QuestionnaireResponseInsert {
  submission_id: string;

  user_id: string;

  questionnaire_type: QuestionnaireType;

  question_key: string;

  answer: number;
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
   MENSAJES
========================= */

const ERROR_INVALID_TYPE =
  "Tipo de cuestionario no válido.";

const ERROR_EMPTY_ANSWERS =
  "No se han proporcionado respuestas.";

const ERROR_CHECK =
  "No se ha podido comprobar el estado del cuestionario.";

const ERROR_SUBMISSION =
  "No se ha podido crear el registro del cuestionario.";

const ERROR_RESPONSES =
  "No se han podido guardar las respuestas del cuestionario.";

const ERROR_COMPLETED =
  "Este cuestionario ya ha sido completado.";

const ERROR_PRE_REQUIRED =
  "Debes completar primero la evaluación inicial.";

const ERROR_GET_COMPLETED =
  "No se han podido recuperar los cuestionarios completados.";

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
      ERROR_INVALID_TYPE,
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
      ERROR_EMPTY_ANSWERS,
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
): QuestionnaireResponseInsert[] {
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
      ERROR_CHECK,
    );
  }

  return data !== null;
}
/* =========================
   FUNCIONES PÚBLICAS
========================= */

/**
 * Guarda un cuestionario completado
 * junto con todas sus respuestas.
 *
 * Flujo:
 *
 * 1. Valida el tipo.
 * 2. Valida las respuestas.
 * 3. Comprueba autenticación.
 * 4. Evita duplicados.
 * 5. Obliga a completar el PRE
 *    antes del POST.
 * 6. Inserta el envío.
 * 7. Inserta todas las respuestas.
 */
export async function submitQuestionnaire(
  questionnaireType: QuestionnaireType,
  answers: QuestionnaireAnswers,
) {
  validateQuestionnaireType(
    questionnaireType,
  );

  validateAnswers(answers);

  const user = await getUser();

  if (!user) {
    throw new Error(
      "Usuario no autenticado.",
    );
  }

  const alreadyCompleted =
    await hasCompletedQuestionnaireByUser(
      user.id,
      questionnaireType,
    );

  if (alreadyCompleted) {
    throw new Error(
      ERROR_COMPLETED,
    );
  }

  if (
    questionnaireType === "post"
  ) {
    const hasCompletedPre =
      await hasCompletedQuestionnaireByUser(
        user.id,
        "pre",
      );

    if (!hasCompletedPre) {
      throw new Error(
        ERROR_PRE_REQUIRED,
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
      questionnaire_type:
        questionnaireType,
    })
    .select()
    .single();

  if (
    submissionError ||
    !submission
  ) {
    throw new Error(
      ERROR_SUBMISSION,
    );
  }

  const responses =
    buildResponses(
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
      .eq(
        "id",
        submission.id,
      );

    throw new Error(
      ERROR_RESPONSES,
    );
  }

  return submission;
}
/**
 * Indica si el participante
 * ya ha completado un cuestionario.
 */
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

/**
 * Devuelve los cuestionarios
 * completados por el participante.
 */
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
      ERROR_GET_COMPLETED,
    );
  }

  return data.map(
    ({
      questionnaire_type,
    }) =>
      questionnaire_type as QuestionnaireType,
  );
}

/**
 * Devuelve el estado global
 * de los cuestionarios del participante.
 *
 * Esta función debe utilizarse
 * desde Dashboard y desde la
 * pantalla de Cuestionarios.
 */
export async function getQuestionnaireStatus(): Promise<QuestionnaireStatus> {
  const [
    preCompleted,
    postCompleted,
  ] = await Promise.all([
    hasCompletedQuestionnaire(
      "pre",
    ),

    hasCompletedQuestionnaire(
      "post",
    ),
  ]);

  return {
    preCompleted,

    postCompleted,
  };
}

/**
 * Indica si el participante
 * puede acceder al cuestionario POST.
 *
 * Actualmente únicamente requiere
 * haber completado el PRE.
 *
 * Si en el futuro el estudio exige
 * completar sesiones, materiales
 * o esperar una fecha concreta,
 * toda esa lógica se añadirá aquí
 * sin afectar a los componentes.
 */
export async function canStartPostQuestionnaire(): Promise<boolean> {
  return hasCompletedQuestionnaire(
    "pre",
  );
}