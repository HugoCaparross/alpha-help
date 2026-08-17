import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

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

  for (const [questionId, value] of entries) {
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

    const { data: existingSubmission, error: existingError } = await supabase
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
      const { data: preSubmission, error: preError } = await supabase
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

      const { data: settings, error: settingsError } = await supabase
        .from("questionnaire_settings")
        .select("post_enabled, post_release_at")
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

      const releaseAt = settings?.post_release_at ?? null;
      const available = Boolean(
        settings?.post_enabled &&
        (!releaseAt || new Date(releaseAt).getTime() <= Date.now()),
      );

      if (!available) {
        return NextResponse.json(
          { ok: false, error: "Este cuestionario todavía no está disponible." },
          { status: 403 },
        );
      }
    }

    const { data: submission, error: submissionError } = await supabase
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

    const { error: responsesError } = await supabase
      .from("questionnaire_responses")
      .insert(responses);

    if (responsesError) {
      console.error("Questionnaire responses error:", responsesError);
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
