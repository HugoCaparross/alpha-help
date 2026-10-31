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

const REQUIRED_QUESTION_IDS = ALL_QUESTIONS
    .filter((question) => question.required)
    .map((question) => question.id);

interface SubmissionRow {
    id: string;
    questionnaire_type: QuestionnaireType;
}

interface ResponseRow {
    submission_id: string | null;
    questionnaire_type: QuestionnaireType;
    question_key: string;
}

function isComplete(questionKeys: Set<string>): boolean {
    return (
        questionKeys.size === REQUIRED_QUESTION_IDS.length &&
        REQUIRED_QUESTION_IDS.every((questionId) =>
            questionKeys.has(questionId),
        )
    );
}

export async function GET() {
    try {
        // 1. Obtener y validar al usuario autenticado.
        const authClient = await createServerClient();

        const {
            data: { user },
            error: authError,
        } = await authClient.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Usuario no autenticado.",
                },
                { status: 401 },
            );
        }

        // 2. Consultar los registros desde el servidor.
        // Se utiliza Service Role exclusivamente en este entorno.
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
                    error:
                        "No se ha podido recuperar el progreso de los cuestionarios.",
                },
                { status: 500 },
            );
        }

        const submissionRows = (submissions ?? []) as SubmissionRow[];
        const responseRows = (responses ?? []) as ResponseRow[];

        // 3. Comprobar si un tipo de cuestionario está realmente completado.
        function hasCompleted(type: QuestionnaireType): boolean {
            const typeSubmissions = submissionRows.filter(
                (submission) => submission.questionnaire_type === type,
            );

            if (typeSubmissions.length === 0) {
                return false;
            }

            // Primero comprobamos las respuestas vinculadas
            // directamente a cada envío.
            for (const submission of typeSubmissions) {
                const linkedKeys = new Set(
                    responseRows
                        .filter(
                            (response) =>
                                response.submission_id === submission.id &&
                                response.questionnaire_type === type,
                        )
                        .map((response) => response.question_key),
                );

                if (isComplete(linkedKeys)) {
                    return true;
                }
            }

            // Compatibilidad con registros históricos:
            // respuestas del usuario y tipo sin submission_id.
            if (typeSubmissions.length === 1) {
                const legacyKeys = new Set(
                    responseRows
                        .filter(
                            (response) =>
                                response.questionnaire_type === type &&
                                response.submission_id === null,
                        )
                        .map((response) => response.question_key),
                );

                return isComplete(legacyKeys);
            }

            return false;
        }

        // 4. Obtener el estado PRE y POST.
        const preCompleted = hasCompleted("pre");
        const postCompleted = hasCompleted("post");

        const completed: QuestionnaireType[] = [];

        if (preCompleted) {
            completed.push("pre");
        }

        if (postCompleted) {
            completed.push("post");
        }

        // 5. Devolver el resultado sin almacenar caché.
        return NextResponse.json(
            {
                ok: true,
                preCompleted,
                postCompleted,
                completed,
            },
            {
                headers: {
                    "Cache-Control": "no-store, max-age=0",
                },
            },
        );
    } catch (error) {
        console.error("Unexpected questionnaire progress error:", error);

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Se ha producido un error al comprobar el estado de los cuestionarios.",
            },
            { status: 500 },
        );
    }
}