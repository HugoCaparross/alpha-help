import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { fetchAllRows } from "@/lib/supabase/fetchAll";
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
  created_at: string;
}

/**
 * Todas las preguntas del proyecto, en el mismo orden en el que aparecen
 * en la estructura oficial de los cuestionarios.
 */
const ALL_QUESTION_KEYS = [
  ...CAPSM_QUESTIONS,
  ...PSOC_QUESTIONS,
  ...ECPP_QUESTIONS,
  ...PSS_QUESTIONS,
  ...KIDSCREEN_QUESTIONS,
].map((question) => question.id);

/**
 * GET /api/admin/export/questionnaires
 *
 * Genera el CSV completo de cuestionarios PRE/POST.
 *
 * Una fila = un participante.
 *
 * Las respuestas se recuperan mediante paginación, por lo que la exportación
 * no depende del número de participantes ni del número total de respuestas.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status },
    );
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
      {
        error: "Demasiadas exportaciones. Inténtalo más tarde.",
      },
      { status: 429 },
    );
  }

  const admin = createAdminClient();

  /*
   * Las tres consultas son independientes y todas utilizan paginación.
   *
   * Esto es fundamental:
   *
   * 55 participantes
   *   -> 4.840 respuestas
   *
   * 500 participantes
   *   -> 44.000 respuestas
   *
   * 5.000 participantes
   *   -> 440.000 respuestas
   *
   * El código continúa leyendo páginas hasta llegar al final.
   */
  const [profilesResult, submissionsResult, responsesResult] =
    await Promise.all([
      fetchAllRows<ProfileRow>((from, to) =>
        admin
          .from("profiles")
          .select("id, email, participant_code, created_at")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(from, to),
      ),

      fetchAllRows<SubmissionRow>((from, to) =>
        admin
          .from("questionnaire_submissions")
          .select("user_id, questionnaire_type, submitted_at")
          .order("user_id", { ascending: true })
          .order("questionnaire_type", { ascending: true })
          .order("submitted_at", { ascending: true })
          .range(from, to),
      ),

      fetchAllRows<ResponseRow>((from, to) =>
        admin
          .from("questionnaire_responses")
          .select(
            "user_id, questionnaire_type, question_key, answer",
          )
          .order("user_id", { ascending: true })
          .order("questionnaire_type", { ascending: true })
          .order("question_key", { ascending: true })
          .range(from, to),
      ),
    ]);

  if (profilesResult.error) {
    console.error(
      "Questionnaire export - profiles error:",
      profilesResult.error,
    );

    return NextResponse.json(
      {
        error: "No se han podido recuperar los participantes.",
      },
      { status: 500 },
    );
  }

  if (submissionsResult.error) {
    console.error(
      "Questionnaire export - submissions error:",
      submissionsResult.error,
    );

    return NextResponse.json(
      {
        error: "No se han podido recuperar los cuestionarios.",
      },
      { status: 500 },
    );
  }

  if (responsesResult.error) {
    console.error(
      "Questionnaire export - responses error:",
      responsesResult.error,
    );

    return NextResponse.json(
      {
        error: "No se han podido recuperar las respuestas.",
      },
      { status: 500 },
    );
  }

  const profiles = profilesResult.data;
  const submissions = submissionsResult.data;
  const responses = responsesResult.data;

  /*
   * Índice de respuestas.
   *
   * Clave:
   * user_id + questionnaire_type + question_key
   *
   * Esto evita depender del orden en el que Supabase devuelve las respuestas.
   */
  const responseMap = new Map<string, number>();

  for (const response of responses) {
    responseMap.set(
      `${response.user_id}:${response.questionnaire_type}:${response.question_key}`,
      response.answer,
    );
  }

  /*
   * Índice de submissions.
   *
   * Evitamos hacer .find() para cada participante, lo que sería mucho más
   * costoso cuando el número de participantes crezca.
   */
  const submissionMap = new Map<string, SubmissionRow>();

  for (const submission of submissions) {
    const key = `${submission.user_id}:${submission.questionnaire_type}`;

    /*
     * Si por cualquier motivo existieran varias submissions históricas del
     * mismo tipo, conservamos la primera que aparece según el orden estable
     * de la consulta.
     */
    if (!submissionMap.has(key)) {
      submissionMap.set(key, submission);
    }
  }

  /*
   * Las columnas NO se construyen mirando las respuestas existentes.
   *
   * Se construyen directamente desde las 88 preguntas oficiales.
   *
   * Esto garantiza que todos los CSV tengan exactamente la misma estructura,
   * incluso si algunos participantes todavía no han realizado PRE o POST.
   */
  const columns = [
    "user_id",
    "email",
    "participant_code",
    "pre_submitted_at",
    ...ALL_QUESTION_KEYS.map((key) => `pre_${key}`),
    "post_submitted_at",
    ...ALL_QUESTION_KEYS.map((key) => `post_${key}`),
  ];

  const rows: Record<string, unknown>[] = [];

  for (const profile of profiles) {
    const row: Record<string, unknown> = {
      user_id: profile.id,
      email: profile.email,
      participant_code: profile.participant_code,
    };

    const preSubmission = submissionMap.get(
      `${profile.id}:pre`,
    );

    const postSubmission = submissionMap.get(
      `${profile.id}:post`,
    );

    row.pre_submitted_at = preSubmission?.submitted_at ?? "";
    row.post_submitted_at = postSubmission?.submitted_at ?? "";

    /*
     * PRE
     */
    for (const questionKey of ALL_QUESTION_KEYS) {
      const response = responseMap.get(
        `${profile.id}:pre:${questionKey}`,
      );

      row[`pre_${questionKey}`] = response ?? "";
    }

    /*
     * POST
     */
    for (const questionKey of ALL_QUESTION_KEYS) {
      const response = responseMap.get(
        `${profile.id}:post:${questionKey}`,
      );

      row[`post_${questionKey}`] = response ?? "";
    }

    rows.push(row);
  }

  const csv = buildCsv(columns, rows);

  return csvResponse(
    csv,
    "cuestionarios-participantes.csv",
  );
}