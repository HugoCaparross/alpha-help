import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import {
    createServerClient as createAdminClient,
} from "@/lib/supabase/admin";

import { getMaterialReleaseDate } from "@/lib/utils/material-release";
import { extractStoragePath } from "@/lib/utils/storage";

const MATERIALS_TABLE = "study_materials";
const SESSIONS_TABLE = "study_sessions";
const QUESTIONNAIRES_TABLE =
    "questionnaire_submissions";

const PDF_BUCKET = "study-materials";
const THUMBNAIL_BUCKET =
    "study-material-thumbnails";

const SIGNED_URL_EXPIRATION_SECONDS =
    60 * 60;

const MIN_ORDER = 0;
const MAX_ORDER = 9;

const MATERIAL_FIELDS = `
  id,
  title,
  description,
  pdf_url,
  thumbnail_url,
  material_order,
  material_type,
  release_date_spain,
  release_date_latam
`;

const SESSION_FIELDS = `
  session_order,
  release_date_spain,
  release_date_latam
`;

type MaterialType =
    | "support"
    | "extended";

type MaterialStatus =
    | "available"
    | "locked";

type LockReason =
    | "initial-evaluation"
    | "release-date";

interface MaterialRow {
    id: string;
    title: string;
    description: string;
    pdf_url: string;
    thumbnail_url: string;
    material_order: number;
    material_type: MaterialType;
    release_date_spain:
    | string
    | null;
    release_date_latam:
    | string
    | null;
}

interface SessionRow {
    session_order: number;
    release_date_spain:
    | string
    | null;
    release_date_latam:
    | string
    | null;
}

/**
 * Obtiene la ruta real dentro de Supabase Storage
 * a partir de una URL o referencia de almacenamiento.
 */
function getStoragePath(
    value:
        | string
        | null
        | undefined,
    bucket: string,
): string | null {
    if (!value) {
        return null;
    }

    return extractStoragePath(
        value.trim(),
        bucket,
    );
}

/**
 * Genera una URL firmada temporal.
 *
 * Esta función solo debe ejecutarse para recursos
 * cuyo acceso ya haya sido validado.
 */
async function createSignedUrl(
    admin: ReturnType<
        typeof createAdminClient
    >,
    value: string,
    bucket: string,
): Promise<string> {
    const path =
        getStoragePath(
            value,
            bucket,
        );

    if (!path) {
        throw new Error(
            "El material contiene una referencia de almacenamiento no válida.",
        );
    }

    const {
        data,
        error,
    } =
        await admin.storage
            .from(bucket)
            .createSignedUrl(
                path,
                SIGNED_URL_EXPIRATION_SECONDS,
            );

    if (
        error ||
        !data?.signedUrl
    ) {
        throw new Error(
            "No se ha podido preparar el material para su consulta.",
        );
    }

    return data.signedUrl;
}

/**
 * Garantiza que los buckets de recursos permanezcan privados.
 */
async function ensurePrivateBucket(
    admin: ReturnType<
        typeof createAdminClient
    >,
    bucket: string,
): Promise<void> {
    const {
        data,
        error,
    } =
        await admin.storage.getBucket(
            bucket,
        );

    /*
     * Si el bucket no existe,
     * la creación debe realizarse
     * desde administración.
     */
    if (
        error ||
        !data
    ) {
        return;
    }

    if (data.public) {
        const {
            error: updateError,
        } =
            await admin.storage.updateBucket(
                bucket,
                {
                    public: false,
                },
            );

        if (updateError) {
            throw new Error(
                `No se ha podido proteger el bucket ${bucket}.`,
            );
        }
    }
}

/**
 * Comprueba si una fecha de liberación
 * ya ha llegado.
 */
function isReleased(
    releaseDate:
        | string
        | null,
): boolean {
    if (!releaseDate) {
        return false;
    }

    const timestamp =
        Date.parse(
            releaseDate,
        );

    return (
        Number.isFinite(
            timestamp,
        ) &&
        timestamp <=
        Date.now()
    );
}

export async function GET() {
    /*
     * ============================================================
     * 1. AUTENTICACIÓN
     * ============================================================
     *
     * La identidad del participante se obtiene exclusivamente
     * desde la sesión de Supabase.
     *
     * Nunca confiamos en un user_id enviado por el navegador.
     */
    const userClient =
        await createServerClient();

    const {
        data: {
            user,
        },
    } =
        await userClient.auth.getUser();

    if (!user) {
        return NextResponse.json(
            {
                error:
                    "No autenticado.",
            },
            {
                status: 401,
            },
        );
    }

    const admin =
        createAdminClient();

    /*
     * ============================================================
     * 2. PROTECCIÓN DE STORAGE
     * ============================================================
     *
     * Los PDFs y miniaturas deben estar almacenados
     * en buckets privados.
     */
    await Promise.all([
        ensurePrivateBucket(
            admin,
            PDF_BUCKET,
        ),

        ensurePrivateBucket(
            admin,
            THUMBNAIL_BUCKET,
        ),
    ]);

    /*
     * ============================================================
     * 3. PERFIL + EVALUACIÓN INICIAL
     * ============================================================
     *
     * Necesitamos conocer:
     *
     * - Región del participante.
     * - Si ha completado la evaluación inicial.
     */
    const [
        {
            data: profile,
            error: profileError,
        },

        {
            data: preSubmission,
            error: preError,
        },
    ] =
        await Promise.all([
            admin
                .from("profiles")
                .select("region")
                .eq(
                    "id",
                    user.id,
                )
                .maybeSingle(),

            admin
                .from(
                    QUESTIONNAIRES_TABLE,
                )
                .select("id")
                .eq(
                    "user_id",
                    user.id,
                )
                .eq(
                    "questionnaire_type",
                    "pre",
                )
                .maybeSingle(),
        ]);

    if (
        profileError ||
        !profile
    ) {
        return NextResponse.json(
            {
                error:
                    "No se ha podido recuperar el perfil del participante.",
            },
            {
                status: 500,
            },
        );
    }

    if (preError) {
        return NextResponse.json(
            {
                error:
                    "No se ha podido comprobar la evaluación inicial.",
            },
            {
                status: 500,
            },
        );
    }

    /*
     * Solo se admiten las dos regiones del estudio.
     */
    if (
        profile.region !==
        "España" &&
        profile.region !==
        "Latinoamérica"
    ) {
        return NextResponse.json(
            {
                error:
                    "La región del participante no es válida.",
            },
            {
                status: 500,
            },
        );
    }

    const databaseRegion =
        profile.region;

    /*
     * Tener una submission de tipo "pre"
     * significa que la evaluación inicial
     * ha sido completada.
     */
    const initialEvaluationCompleted =
        preSubmission !== null;

    /*
     * ============================================================
     * 4. MATERIAL + CALENDARIO
     * ============================================================
     *
     * Recuperamos:
     *
     * - materiales de la región del usuario;
     * - sesiones de la región del usuario.
     *
     * El calendario de sesiones es la fuente de verdad
     * para determinar cuándo se libera cada material.
     */
    const [
        {
            data: materials,
            error: materialsError,
        },

        {
            data: sessions,
            error: sessionsError,
        },
    ] =
        await Promise.all([
            admin
                .from(
                    MATERIALS_TABLE,
                )
                .select(
                    MATERIAL_FIELDS,
                )
                .eq(
                    "region",
                    databaseRegion,
                )
                .gte(
                    "material_order",
                    MIN_ORDER,
                )
                .lte(
                    "material_order",
                    MAX_ORDER,
                )
                .order(
                    "material_order",
                    {
                        ascending: true,
                    },
                )
                .order(
                    "material_type",
                    {
                        ascending: true,
                    },
                ),

            admin
                .from(
                    SESSIONS_TABLE,
                )
                .select(
                    SESSION_FIELDS,
                )
                .eq(
                    "region",
                    databaseRegion,
                )
                .gte(
                    "session_order",
                    MIN_ORDER,
                )
                .lte(
                    "session_order",
                    MAX_ORDER,
                )
                .order(
                    "session_order",
                    {
                        ascending: true,
                    },
                ),
        ]);

    if (
        materialsError ||
        sessionsError
    ) {
        return NextResponse.json(
            {
                error:
                    "No se han podido recuperar los recursos.",
            },
            {
                status: 500,
            },
        );
    }

    /*
     * ============================================================
     * 5. CALENDARIO DE LIBERACIÓN
     * ============================================================
     *
     * Regla:
     *
     *        SESIÓN
     *           ↓
     *       + 1 DÍA
     *           ↓
     *      MATERIAL ABIERTO
     *
     * Esto se calcula de forma independiente para:
     *
     * - España
     * - Latinoamérica
     *
     * según la región del participante.
     */
    const sessionDates =
        new Map<
            number,
            string
        >();

    for (
        const session of
        (sessions ??
            []) as SessionRow[]
    ) {
        const sessionDate =
            databaseRegion ===
                "España"
                ? session.release_date_spain
                : session.release_date_latam;

        const releaseDate =
            getMaterialReleaseDate(
                sessionDate,
            );

        if (releaseDate) {
            sessionDates.set(
                session.session_order,
                releaseDate,
            );
        }
    }

    try {
        const responseMaterials =
            await Promise.all(
                (
                    (materials ??
                        []) as MaterialRow[]
                ).map(
                    async (
                        material,
                    ) => {
                        /*
                         * La fecha efectiva de liberación
                         * procede del calendario de sesiones.
                         */
                        const releaseDate =
                            sessionDates.get(
                                material.material_order,
                            ) ?? null;

                        const released =
                            isReleased(
                                releaseDate,
                            );

                        /*
                         * ==================================================
                         * CONDICIONES DE ACCESO
                         * ==================================================
                         *
                         * Para acceder al material deben cumplirse
                         * LAS DOS condiciones:
                         *
                         * 1. Evaluación inicial completada.
                         * 2. Día de liberación alcanzado.
                         *
                         * Esto se aplica tanto a:
                         *
                         * - material reducido;
                         * - material extendido.
                         */
                        const available =
                            initialEvaluationCompleted &&
                            released;

                        /*
                         * ==================================================
                         * MINIATURA
                         * ==================================================
                         *
                         * La miniatura puede mostrarse mientras el material
                         * está bloqueado.
                         *
                         * La miniatura no permite acceder al PDF.
                         */
                        let thumbnailUrl =
                            material.thumbnail_url ||
                            "/images/logo.png";

                        if (
                            material.thumbnail_url &&
                            getStoragePath(
                                material.thumbnail_url,
                                THUMBNAIL_BUCKET,
                            )
                        ) {
                            try {
                                thumbnailUrl =
                                    await createSignedUrl(
                                        admin,
                                        material.thumbnail_url,
                                        THUMBNAIL_BUCKET,
                                    );
                            } catch {
                                thumbnailUrl =
                                    "/images/logo.png";
                            }
                        }

                        /*
                         * ==================================================
                         * MATERIAL BLOQUEADO
                         * ==================================================
                         *
                         * MUY IMPORTANTE:
                         *
                         * NO se genera una signed URL para el PDF.
                         *
                         * pdfUrl = ""
                         *
                         * Por tanto:
                         *
                         * - no se puede abrir;
                         * - no se puede visualizar;
                         * - no se puede descargar;
                         * - no se entrega ninguna URL funcional;
                         * - manipular el frontend no desbloquea el PDF.
                         */
                        if (!available) {
                            return {
                                id:
                                    material.id,

                                title:
                                    material.title,

                                description:
                                    material.description,

                                pdfUrl:
                                    "",

                                thumbnailUrl,

                                materialOrder:
                                    material.material_order,

                                materialType:
                                    material.material_type,

                                releaseDate,

                                releaseDateSpain:
                                    material.release_date_spain ??
                                    "",

                                releaseDateLatam:
                                    material.release_date_latam ??
                                    "",

                                status:
                                    "locked" as MaterialStatus,

                                lockReason:
                                    (
                                        !initialEvaluationCompleted
                                            ? "initial-evaluation"
                                            : "release-date"
                                    ) as LockReason,
                            };
                        }

                        /*
                         * ==================================================
                         * MATERIAL DISPONIBLE
                         * ==================================================
                         *
                         * Solo después de superar TODAS las comprobaciones
                         * se genera la URL firmada del PDF.
                         */
                        const pdfUrl =
                            await createSignedUrl(
                                admin,
                                material.pdf_url,
                                PDF_BUCKET,
                            );

                        return {
                            id:
                                material.id,

                            title:
                                material.title,

                            description:
                                material.description,

                            pdfUrl,

                            thumbnailUrl,

                            materialOrder:
                                material.material_order,

                            materialType:
                                material.material_type,

                            releaseDate,

                            releaseDateSpain:
                                material.release_date_spain ??
                                "",

                            releaseDateLatam:
                                material.release_date_latam ??
                                "",

                            status:
                                "available" as MaterialStatus,

                            lockReason:
                                null,
                        };
                    },
                ),
            );

        return NextResponse.json({
            materials:
                responseMaterials,
        });
    } catch (
    error
    ) {
        console.error(
            "[api/resources/materials]",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof
                        Error
                        ? error.message
                        : "No se han podido preparar los recursos.",
            },
            {
                status: 500,
            },
        );
    }
}