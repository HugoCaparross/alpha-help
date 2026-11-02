import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import {
    CAPSM_QUESTIONS,
    ECPP_QUESTIONS,
    KIDSCREEN_QUESTIONS,
    PSOC_QUESTIONS,
    PSS_QUESTIONS,
    type Question,
} from "@/lib/constants/questionnaires";

import type { QuestionnaireType } from "@/types/questionnaire";

const ALL_QUESTIONS: readonly Question[] = [
    ...CAPSM_QUESTIONS,
    ...PSOC_QUESTIONS,
    ...ECPP_QUESTIONS,
    ...PSS_QUESTIONS,
    ...KIDSCREEN_QUESTIONS,
];

const REQUIRED_QUESTION_IDS: readonly string[] = ALL_QUESTIONS
    .filter((question) => question.required)
    .map((question) => question.id);

/**
 * capsm_23 se añadió después de que una parte del grupo ya hubiera
 * completado el PRE con 87 preguntas. Esa pregunta sigue apareciendo en el
 * formulario para los nuevos participantes, pero no se exige para considerar
 * completado el PRE de quienes ya lo habían terminado.
 */
const OPTIONAL_FOR_COMPLETION = new Set<string>(["capsm_23"]);

const COMPLETION_REQUIRED_IDS: readonly string[] = REQUIRED_QUESTION_IDS.filter(
    (id) => !OPTIONAL_FOR_COMPLETION.has(id),
);

interface SubmissionRow {
    id: string;
    questionnaire_type: QuestionnaireType;
}

interface ResponseRow {
    submission_id: string | null;
    questionnaire_type: QuestionnaireType | null;
    question_key: string;
}

/**
 * Un cuestionario está completado cuando existe su submission y las
 * respuestas del participante para ese tipo cubren todas las obligatorias.
 */
function hasCompleted(
    type: QuestionnaireType,
    submissionRows: SubmissionRow[],
    responseRows: ResponseRow[],
): boolean {
    const typeSubmissions = submissionRows.filter(
        (submission) => submission.questionnaire_type === type,
    );

    if (typeSubmissions.length === 0) {
        return false;
    }

    const submissionIds = new Set(typeSubmissions.map((submission) => submission.id));

    const answeredKeys = new Set<string>();

    for (const response of responseRows) {
        const belongsToType =
            response.questionnaire_type === type ||
            (response.submission_id !== null &&
                submissionIds.has(response.submission_id));

        if (belongsToType) {
            answeredKeys.add(response.question_key);
        }
    }

    return COMPLETION_REQUIRED_IDS.every((id) => answeredKeys.has(id));
}

export async function GET() {
    try {
        const authClient = await createServerClient();

        const {
            data: { user },
            error: authError,
        } = await authClient.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { ok: false, error: "Usuario no autenticado." },
                { status: 401 },
            );
        }

        const admin = createAdminClient();

        const [
            { data: submissions, error: submissionsError },
            { data: responses, error: responsesError },
        ] = await Promise.all([
            admin
                .from("questionnaire_submissions")
                .select("id, questionnaire_type")
                .eq("user_id", user.id),

            admin
                .from("questionnaire_responses")
                .select("submission_id, questionnaire_type, question_key")
                .eq("user_id", user.id),
        ]);

        if (submissionsError || responsesError) {
            console.error("Questionnaire progress lookup failed:", {
                userId: user.id,
                submissionsError,
                responsesError,
            });

            return NextResponse.json(
                {
                    ok: false,
                    error: "No se ha podido recuperar el progreso de los cuestionarios.",
                },
                { status: 500 },
            );
        }

        const submissionRows = (submissions ?? []) as SubmissionRow[];
        const responseRows = (responses ?? []) as ResponseRow[];

        const preCompleted = hasCompleted("pre", submissionRows, responseRows);
        const postCompleted = hasCompleted("post", submissionRows, responseRows);

        const completed: QuestionnaireType[] = [];

        if (preCompleted) completed.push("pre");
        if (postCompleted) completed.push("post");

        return NextResponse.json(
            { ok: true, preCompleted, postCompleted, completed },
            { headers: { "Cache-Control": "no-store, max-age=0" } },
        );
    } catch (error) {
        console.error("Unexpected questionnaire progress error:", error);

        return NextResponse.json(
            {
                ok: false,
                error: "Se ha producido un error al comprobar el estado de los cuestionarios.",
            },
            { status: 500 },
        );
    }
}