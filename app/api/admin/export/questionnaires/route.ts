import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { buildCsv, csvResponse } from "@/lib/utils/csv";

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
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
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

  if (profilesResult.error || submissionsResult.error || responsesResult.error) {
    return NextResponse.json(
      { error: "No se han podido exportar los cuestionarios." },
      { status: 500 },
    );
  }

  const profiles = (profilesResult.data ?? []) as ProfileRow[];
  const submissions = (submissionsResult.data ?? []) as SubmissionRow[];
  const responses = (responsesResult.data ?? []) as ResponseRow[];

  const preKeys = Array.from(
    new Set(
      responses
        .filter((r) => r.questionnaire_type === "pre")
        .map((r) => r.question_key),
    ),
  ).sort();

  const postKeys = Array.from(
    new Set(
      responses
        .filter((r) => r.questionnaire_type === "post")
        .map((r) => r.question_key),
    ),
  ).sort();

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
      (s) => s.user_id === profile.id && s.questionnaire_type === "pre",
    );

    const postSubmission = submissions.find(
      (s) => s.user_id === profile.id && s.questionnaire_type === "post",
    );

    row.pre_submitted_at = preSubmission?.submitted_at ?? "";
    row.post_submitted_at = postSubmission?.submitted_at ?? "";

    for (const key of preKeys) {
      const answer = responses.find(
        (r) =>
          r.user_id === profile.id &&
          r.questionnaire_type === "pre" &&
          r.question_key === key,
      );

      row[`pre_${key}`] = answer?.answer ?? "";
    }

    for (const key of postKeys) {
      const answer = responses.find(
        (r) =>
          r.user_id === profile.id &&
          r.questionnaire_type === "post" &&
          r.question_key === key,
      );

      row[`post_${key}`] = answer?.answer ?? "";
    }

    return row;
  });

  const csv = buildCsv(columns, rows);

  return csvResponse(csv, "cuestionarios-participantes.csv");
}