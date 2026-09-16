import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import {
  CAPSM_QUESTIONS,
  ECPP_QUESTIONS,
  KIDSCREEN_QUESTIONS,
  PSS_QUESTIONS,
  PSOC_QUESTIONS,
  SCALES,
  type Question,
} from "@/lib/constants/questionnaires";

import type { QuestionnaireType } from "@/types/questionnaire";

interface QuestionnaireAnswers {
  [questionId: string]: number;
}

interface SubmitBody {
  questionnaireType: QuestionnaireType;
  answers: QuestionnaireAnswers;
}

const VALID_TYPES: readonly QuestionnaireType[] = ["pre", "post"];

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

function validateBody(body: unknown): SubmitBody {
  if (typeof body !== "object" || body === null) {
    throw new Error("Los datos enviados no son válidos.");
  }

  const data = body as Record<string, unknown>;

  if (
    typeof data.questionnaireType !== "string" ||
    !VALID_TYPES.includes(data.questionnaireType as QuestionnaireType)
  ) {
    throw new Error("Tipo de cuestionario no válido.");
  }

  if (
    typeof data.answers !== "object" ||
    data.answers === null ||
    Array.isArray(data.answers)
  ) {
    throw new Error("Las respuestas no son válidas.");
  }

  const answers = data.answers as QuestionnaireAnswers;
  const entries = Object.entries(answers);

  if (entries.length === 0) {
    throw new Error("No se han proporcionado respuestas.");
  }

  const requiredQuestionIds = ALL_QUESTIONS.filter(
    (question) => question.required,
  ).map((question) => question.id);

  const missingQuestions = requiredQuestionIds.filter(
    (questionId) => answers[questionId] === undefined,
  );

  const unknownQuestions = entries.filter(
    ([questionId]) => !QUESTION_MAP.has(questionId),
  );

  if (missingQuestions.length > 0) {
    throw new Error(
      `Faltan ${missingQuestions.length} respuestas por completar.`,
    );
  }

  if (entries.length !== requiredQuestionIds.length || unknownQuestions.length > 0) {
    throw new Error("El número de respuestas enviadas no es válido.");
  }

  for (const questionId of requiredQuestionIds) {
    const value = answers[questionId];
    const question = QUESTION_MAP.get(questionId);

    if (!question) {
      throw new Error(`La pregunta "${questionId}" no existe.`);
    }

    if (!Number.isInteger(value)) {
      throw new Error(`La respuesta de "${questionId}" no es válida.`);
    }

    const scale = SCALES[question.scaleType];

    if (value < 1 || value > scale.length) {
      throw new Error(`La respuesta de "${questionId}" está fuera de rango.`);
    }
  }

  return {
    questionnaireType: data.questionnaireType as QuestionnaireType,
    answers,
  };
}

export async function POST(request: Request) {
  try {
    const { questionnaireType, answers } = validateBody(
      await request.json().catch(() => null),
    );
    const supabase = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "Usuario no autenticado." },
        { status: 401 },
      );
    }

    const admin = createAdminClient();

    const { data: existingSubmission, error: existingError } = await admin
      .from("questionnaire_submissions")
      .select("id")
      .eq("user_id", user.id)
      .eq("questionnaire_type", questionnaireType)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          ok: false,
          error: "No se ha podido comprobar el estado del cuestionario.",
        },
        { status: 500 },
      );
    }

    if (existingSubmission) {
      return NextResponse.json(
        { ok: false, error: "Este cuestionario ya ha sido completado." },
        { status: 409 },
      );
    }

    if (questionnaireType === "post") {
      const { data: preSubmission, error: preError } = await admin
        .from("questionnaire_submissions")
        .select("id")
        .eq("user_id", user.id)
        .eq("questionnaire_type", "pre")
        .maybeSingle();

      if (preError) {
        return NextResponse.json(
          {
            ok: false,
            error: "No se ha podido comprobar la evaluación inicial.",
          },
          { status: 500 },
        );
      }

      if (!preSubmission) {
        return NextResponse.json(
          {
            ok: false,
            error: "Debes completar primero la evaluación inicial.",
          },
          { status: 403 },
        );
      }

      const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("region")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile?.region) {
        return NextResponse.json(
          { ok: false, error: "No se ha podido determinar la región del participante." },
          { status: 500 },
        );
      }

      const { data: settings, error: settingsError } = await admin
        .from("questionnaire_settings")
        .select("post_enabled_spain, post_release_at_spain, post_enabled_latam, post_release_at_latam")
        .eq("id", 1)
        .maybeSingle();

      if (settingsError) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "No se ha podido comprobar la disponibilidad de la evaluación final.",
          },
          { status: 500 },
        );
      }

      const isSpain = profile.region === "España";
      const enabled = isSpain ? Boolean(settings?.post_enabled_spain) : Boolean(settings?.post_enabled_latam);
      const releaseAt = isSpain ? settings?.post_release_at_spain ?? null : settings?.post_release_at_latam ?? null;
      const available = Boolean(enabled && (!releaseAt || new Date(releaseAt).getTime() <= Date.now()));

      if (!available) {
        return NextResponse.json(
          { ok: false, error: "Este cuestionario todavía no está disponible." },
          { status: 403 },
        );
      }
    }

    const { data: submission, error: submissionError } = await admin
      .from("questionnaire_submissions")
      .insert({ user_id: user.id, questionnaire_type: questionnaireType })
      .select("id")
      .single();

    if (submissionError || !submission) {
      if (submissionError?.code === "23505") {
        return NextResponse.json(
          { ok: false, error: "Este cuestionario ya ha sido completado." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: "No se ha podido crear el registro del cuestionario.",
        },
        { status: 500 },
      );
    }

    const responses = Object.entries(answers).map(([questionKey, answer]) => ({
      submission_id: submission.id,
      user_id: user.id,
      questionnaire_type: questionnaireType,
      question_key: questionKey,
      answer,
    }));

    const { error: responsesError } = await admin
      .from("questionnaire_responses")
      .insert(responses);

    if (responsesError) {
      console.error("Questionnaire responses error:", responsesError);

      const { error: rollbackError } = await admin
        .from("questionnaire_submissions")
        .delete()
        .eq("id", submission.id)
        .eq("user_id", user.id);

      if (rollbackError) {
        console.error("Questionnaire submission rollback error:", rollbackError);
      }

      return NextResponse.json(
        {
          ok: false,
          error: "No se han podido guardar las respuestas del cuestionario.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ok: true, submissionId: submission.id },
      { status: 201 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Questionnaire submission error:", error);
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se ha podido completar el cuestionario.",
      },
      { status: 400 },
    );
  }
}
