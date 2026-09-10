import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { buildCsv, csvResponse } from "@/lib/utils/csv";
import {
  CAPSM_QUESTIONS,
  ECPP_QUESTIONS,
  KIDSCREEN_QUESTIONS,
  PSOC_QUESTIONS,
  PSS_QUESTIONS,
} from "@/lib/constants/questionnaires";

import { getClientIp, isAllowedByRateLimit } from "@/lib/utils/rateLimit";

interface SubmissionRow {
  user_id: string;

  questionnaire_type: "pre" | "post";

  submitted_at: string;
}

interface ResponseRow {
  user_id: string;

  questionnaire_type: "pre" | "post";

  question_key: string;

  answer: number;
}

interface ProfileRow {
  id: string;

  email: string;

  participant_code: string;
}

/**
 * GET /api/admin/export/questionnaires
 *
 * Exporta los cuestionarios pre y post
 * en una única fila por participante,
 * con una columna por cada pregunta
 * respondida (prefijada con pre_/post_).
 */
export async function GET(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const ip = getClientIp(request);

  if (
    !isAllowedByRateLimit(
      `admin-export-questionnaires:${auth.userId}:${ip}`,
      5,
      10 * 60_000,
    )
  ) {
    return NextResponse.json(
      { error: "Demasiadas exportaciones. Inténtalo más tarde." },
      { status: 429 },
    );
  }

  const admin = createAdminClient();

  const [profilesResult, submissionsResult, responsesResult] =
    await Promise.all([
      admin
        .from("profiles")
        .select("id, email, participant_code")
        .order("created_at", { ascending: true }),

      admin
        .from("questionnaire_submissions")
        .select("user_id, questionnaire_type, submitted_at"),

      admin
        .from("questionnaire_responses")
        .select("user_id, questionnaire_type, question_key, answer"),
    ]);

  if (
    profilesResult.error ||
    submissionsResult.error ||
    responsesResult.error
  ) {
    return NextResponse.json(
      { error: "No se han podido exportar los cuestionarios." },
      { status: 500 },
    );
  }

  const profiles = (profilesResult.data ?? []) as ProfileRow[];
  const submissions = (submissionsResult.data ?? []) as SubmissionRow[];
  const responses = (responsesResult.data ?? []) as ResponseRow[];

  const allQuestionKeys = [
    ...CAPSM_QUESTIONS,
    ...PSOC_QUESTIONS,
    ...ECPP_QUESTIONS,
    ...PSS_QUESTIONS,
    ...KIDSCREEN_QUESTIONS,
  ].map((question) => question.id);

  // Las columnas se construyen a partir del cuestionario, no de las filas
  // existentes en questionnaire_responses. Así el CSV mantiene siempre la
  // misma estructura aunque todavía no haya respuestas almacenadas.
  const preKeys = allQuestionKeys;
  const postKeys = allQuestionKeys;

  const responseMap = new Map(
    responses.map((response) => [
      `${response.user_id}:${response.questionnaire_type}:${response.question_key}`,
      response.answer,
    ]),
  );

  const columns = [
    "user_id",
    "email",
    "participant_code",
    "pre_submitted_at",
    ...preKeys.map((key) => `pre_${key}`),
    "post_submitted_at",
    ...postKeys.map((key) => `post_${key}`),
  ];

  const rows = profiles.map((profile) => {
    const row: Record<string, unknown> = {
      user_id: profile.id,
      email: profile.email,
      participant_code: profile.participant_code,
    };

    const preSubmission = submissions.find(
      (submission) =>
        submission.user_id === profile.id &&
        submission.questionnaire_type === "pre",
    );

    const postSubmission = submissions.find(
      (submission) =>
        submission.user_id === profile.id &&
        submission.questionnaire_type === "post",
    );

    row.pre_submitted_at = preSubmission?.submitted_at ?? "";
    row.post_submitted_at = postSubmission?.submitted_at ?? "";

    for (const key of preKeys) {
      row[`pre_${key}`] =
        responseMap.get(`${profile.id}:pre:${key}`) ?? "";
    }

    for (const key of postKeys) {
      row[`post_${key}`] =
        responseMap.get(`${profile.id}:post:${key}`) ?? "";
    }

    return row;
  });

  const csv = buildCsv(columns, rows);

  return csvResponse(csv, "cuestionarios-participantes.csv");
}
