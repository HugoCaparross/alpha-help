import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { extractStoragePath } from "@/lib/utils/storage";

const MATERIALS_TABLE = "study_materials";
const PDF_BUCKET = "study-materials";
const THUMBNAIL_BUCKET = "study-material-thumbnails";
const SIGNED_URL_EXPIRATION_SECONDS = 60 * 60;
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

type MaterialType = "support" | "extended";
type MaterialStatus = "available" | "locked";
type LockReason = "release-date";

interface MaterialRow {
    id: string;
    title: string;
    description: string;
    pdf_url: string;
    thumbnail_url: string;
    material_order: number;
    material_type: MaterialType;
    release_date_spain: string | null;
    release_date_latam: string | null;
}

function getStoragePath(value: string | null | undefined, bucket: string): string | null {
    if (!value) return null;
    return extractStoragePath(value.trim(), bucket);
}

async function createSignedUrl(
    admin: ReturnType<typeof createAdminClient>,
    value: string,
    bucket: string,
): Promise<string> {
    const path = getStoragePath(value, bucket);
    if (!path) {
        throw new Error("El material contiene una referencia de almacenamiento no válida.");
    }

    const { data, error } = await admin.storage
        .from(bucket)
        .createSignedUrl(path, SIGNED_URL_EXPIRATION_SECONDS);

    if (error || !data?.signedUrl) {
        throw new Error("No se ha podido preparar el material para su consulta.");
    }

    return data.signedUrl;
}

async function ensurePrivateBucket(
    admin: ReturnType<typeof createAdminClient>,
    bucket: string,
): Promise<void> {
    const { data, error } = await admin.storage.getBucket(bucket);
    if (error || !data) return;

    if (data.public) {
        const { error: updateError } = await admin.storage.updateBucket(bucket, { public: false });
        if (updateError) {
            throw new Error(`No se ha podido proteger el bucket ${bucket}.`);
        }
    }
}

function isReleased(releaseDate: string | null): boolean {
    if (!releaseDate) return false;
    const timestamp = Date.parse(releaseDate);
    return Number.isFinite(timestamp) && timestamp <= Date.now();
}

export async function GET() {
    const userClient = await createServerClient();
    const { data: { user } } = await userClient.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const admin = createAdminClient();

    try {
        await Promise.all([
            ensurePrivateBucket(admin, PDF_BUCKET),
            ensurePrivateBucket(admin, THUMBNAIL_BUCKET),
        ]);

        const { data: profile, error: profileError } = await admin
            .from("profiles")
            .select("region")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: "No se ha podido recuperar el perfil del participante." },
                { status: 500 },
            );
        }

        if (profile.region !== "España" && profile.region !== "Latinoamérica") {
            return NextResponse.json(
                { error: "La región del participante no es válida." },
                { status: 500 },
            );
        }

        const { data: materials, error: materialsError } = await admin
            .from(MATERIALS_TABLE)
            .select(MATERIAL_FIELDS)
            .eq("region", profile.region)
            .gte("material_order", MIN_ORDER)
            .lte("material_order", MAX_ORDER)
            .order("material_order", { ascending: true })
            .order("material_type", { ascending: true });

        if (materialsError) {
            return NextResponse.json(
                { error: "No se han podido recuperar los recursos." },
                { status: 500 },
            );
        }

        const responseMaterials = await Promise.all(
            ((materials ?? []) as MaterialRow[]).map(async (material) => {
                const releaseDate = profile.region === "España"
                    ? material.release_date_spain
                    : material.release_date_latam;

                const available = material.material_order <= 1 || isReleased(releaseDate);

                let thumbnailUrl = material.thumbnail_url || "/images/logo.png";
                if (material.thumbnail_url && getStoragePath(material.thumbnail_url, THUMBNAIL_BUCKET)) {
                    try {
                        thumbnailUrl = await createSignedUrl(admin, material.thumbnail_url, THUMBNAIL_BUCKET);
                    } catch {
                        thumbnailUrl = "/images/logo.png";
                    }
                }

                const base = {
                    id: material.id,
                    title: material.title,
                    description: material.description,
                    thumbnailUrl,
                    materialOrder: material.material_order,
                    materialType: material.material_type,
                    releaseDate,
                    releaseDateSpain: material.release_date_spain,
                    releaseDateLatam: material.release_date_latam,
                };

                if (!available) {
                    return {
                        ...base,
                        pdfUrl: "",
                        status: "locked" as MaterialStatus,
                        lockReason: "release-date" as LockReason,
                    };
                }

                const pdfUrl = await createSignedUrl(admin, material.pdf_url, PDF_BUCKET);
                return {
                    ...base,
                    pdfUrl,
                    status: "available" as MaterialStatus,
                    lockReason: null,
                };
            }),
        );

        return NextResponse.json({ materials: responseMaterials });
    } catch (error) {
        console.error("[api/resources/materials]", error);
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "No se han podido preparar los recursos.",
            },
            { status: 500 },
        );
    }
}
