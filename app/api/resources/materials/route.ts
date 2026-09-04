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
    } = await admin.storage
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

async function ensurePrivateBucket(
    admin: ReturnType<
        typeof createAdminClient
    >,
    bucket: string,
): Promise<void> {
    const {
        data,
        error,
    } = await admin.storage.getBucket(
        bucket,
    );

    /*
     * Si el bucket todavía no existe,
     * no intentamos crearlo desde esta
     * ruta de usuario.
     *
     * La creación/configuración se
     * realiza desde administración.
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
     * El usuario se comprueba siempre
     * mediante Supabase en servidor.
     *
     * No confiamos en información enviada
     * desde el cliente.
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
     * Los dos buckets utilizados por
     * los materiales deben permanecer
     * privados.
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
     * Recuperamos simultáneamente:
     *
     * 1. La región del usuario.
     * 2. Si ha completado la evaluación
     *    inicial.
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
     * Solo existen dos programas válidos.
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
     * Tener una submission de tipo
     * "pre" significa que la evaluación
     * inicial ha sido completada.
     */
    const initialEvaluationCompleted =
        preSubmission !== null;

    /*
     * Recuperamos materiales y sesiones
     * de la región correspondiente.
     *
     * Nunca mezclamos España y
     * Latinoamérica.
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
     * Calculamos la fecha de apertura
     * desde el calendario de sesiones.
     *
     * Regla:
     *
     * sesión → +1 día → material disponible
     *
     * No confiamos únicamente en la
     * fecha almacenada en el material,
     * porque el calendario es la fuente
     * de verdad.
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
                         * La fecha efectiva de
                         * liberación se obtiene del
                         * calendario de sesiones.
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
                         * Para que un material esté
                         * disponible deben cumplirse
                         * AMBAS condiciones:
                         *
                         * 1. Evaluación inicial
                         *    completada.
                         *
                         * 2. Fecha de liberación
                         *    alcanzada.
                         */
                        const available =
                            initialEvaluationCompleted &&
                            released;

                        /*
                         * La miniatura sí puede
                         * mostrarse aunque el material
                         * esté bloqueado.
                         *
                         * Si está en Storage privado,
                         * se genera una URL temporal.
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
                         * MATERIAL BLOQUEADO
                         *
                         * MUY IMPORTANTE:
                         *
                         * pdfUrl se devuelve como
                         * string vacío.
                         *
                         * Por tanto, el cliente nunca
                         * recibe la URL firmada del PDF.
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
                         * MATERIAL DISPONIBLE
                         *
                         * Solo aquí se genera la URL
                         * firmada del PDF.
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