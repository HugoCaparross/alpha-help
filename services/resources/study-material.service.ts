import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

import { isSpain, type Region } from "@/lib/utils/regions";

import { extractStoragePath } from "@/lib/utils/storage";

import type {
  MaterialType,
  StudyMaterial,
  StudyMaterialWithStatus,
} from "@/types/study-material";

const STUDY_MATERIALS_TABLE = "study_materials";

const PDF_BUCKET = "study-materials";

const THUMBNAIL_BUCKET = "study-material-thumbnails";

/**
 * Número total de materiales
 * del programa:
 *
 * 0 = Introducción
 * 1-10 = sesiones
 */
export const TOTAL_STUDY_MATERIALS = 11;

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

const ERROR_GET_MATERIALS = "No se han podido recuperar los materiales.";

const ERROR_PROFILE_NOT_FOUND =
  "No se ha podido recuperar el perfil del participante.";

const ERROR_SIGNED_URL =
  "No se ha podido generar el acceso seguro al material.";

export interface GroupedStudyMaterials {
  readonly support: StudyMaterialWithStatus[];

  readonly extended: StudyMaterialWithStatus[];
}

interface StudyMaterialRow {
  id: string;

  title: string;

  description: string;

  pdf_url: string;

  thumbnail_url: string;

  material_order: number;

  material_type: MaterialType;

  release_date_spain: string;

  release_date_latam: string;
}

function mapMaterial(row: StudyMaterialRow): StudyMaterial {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    pdfUrl: row.pdf_url,

    thumbnailUrl: row.thumbnail_url,

    materialOrder: row.material_order,

    materialType: row.material_type,

    releaseDateSpain: row.release_date_spain,

    releaseDateLatam: row.release_date_latam,
  };
}

async function getCurrentRegion(): Promise<Region> {
  const profile = await getProfile();

  if (!profile) {
    throw new Error(ERROR_PROFILE_NOT_FOUND);
  }

  return profile.region;
}

function getReleaseDate(material: StudyMaterial, region: Region): string {
  return isSpain(region)
    ? material.releaseDateSpain
    : material.releaseDateLatam;
}

function isReleased(releaseDate: string): boolean {
  const timestamp = Date.parse(releaseDate);

  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

export function isMaterialAvailable(
  material: StudyMaterial,
  region: Region,
): boolean {
  return isReleased(getReleaseDate(material, region));
}

function getStatus(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus["status"] {
  return isMaterialAvailable(material, region) ? "available" : "locked";
}

function mapMaterialWithStatus(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus {
  return {
    ...material,

    releaseDate: getReleaseDate(material, region),

    status: getStatus(material, region),
  };
}

/**
 * Convierte una ruta privada de
 * Storage en una URL firmada.
 *
 * Las URLs firmadas son temporales
 * y no exponen públicamente el
 * contenido del bucket.
 */
async function createSignedStorageUrl(
  value: string,
  bucket: string,
): Promise<string> {
  const path = extractStoragePath(value, bucket);

  if (!path) {
    throw new Error(ERROR_SIGNED_URL);
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error(ERROR_SIGNED_URL);
  }

  return data.signedUrl;
}

/**
 * Resuelve las URLs privadas de
 * un material que ya está disponible.
 *
 * Las miniaturas locales de Next.js
 * se mantienen tal cual.
 */
async function resolveMaterialUrls(
  material: StudyMaterial,
): Promise<StudyMaterial> {
  const pdfUrl = await createSignedStorageUrl(material.pdfUrl, PDF_BUCKET);

  let thumbnailUrl = material.thumbnailUrl;

  const thumbnailPath = extractStoragePath(
    material.thumbnailUrl,
    THUMBNAIL_BUCKET,
  );

  if (thumbnailPath) {
    thumbnailUrl = await createSignedStorageUrl(
      material.thumbnailUrl,
      THUMBNAIL_BUCKET,
    );
  }

  return {
    ...material,

    pdfUrl,

    thumbnailUrl,
  };
}

export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  const { data, error } = await supabase
    .from(STUDY_MATERIALS_TABLE)
    .select(MATERIAL_FIELDS)
    .order("material_order", {
      ascending: true,
    })
    .order("material_type", {
      ascending: true,
    });

  if (error) {
    throw new Error(ERROR_GET_MATERIALS);
  }

  return (data ?? []).map((row) => mapMaterial(row as StudyMaterialRow));
}

export async function getStudyMaterialById(
  materialId: string,
): Promise<StudyMaterial | null> {
  const [region, result] = await Promise.all([
    getCurrentRegion(),

    supabase
      .from(STUDY_MATERIALS_TABLE)
      .select(MATERIAL_FIELDS)
      .eq("id", materialId)
      .maybeSingle(),
  ]);

  const { data, error } = result;

  if (error) {
    throw new Error(ERROR_GET_MATERIALS);
  }

  if (!data) {
    return null;
  }

  const material = mapMaterial(data as StudyMaterialRow);

  if (!isMaterialAvailable(material, region)) {
    return material;
  }

  return resolveMaterialUrls(material);
}

export async function getStudyMaterialsWithStatus(): Promise<
  StudyMaterialWithStatus[]
> {
  const [region, materials] = await Promise.all([
    getCurrentRegion(),
    getStudyMaterials(),
  ]);

  const materialsWithStatus = materials.map((material) =>
    mapMaterialWithStatus(material, region),
  );

  return Promise.all(
    materialsWithStatus.map(async (material) => {
      if (material.status !== "available") {
        return material;
      }

      const resolved = await resolveMaterialUrls(material);

      return {
        ...resolved,
        releaseDate: material.releaseDate,
        status: material.status,
      };
    }),
  );
}

export async function getGroupedStudyMaterials(): Promise<GroupedStudyMaterials> {
  const materials = await getStudyMaterialsWithStatus();

  return {
    support: materials.filter(({ materialType }) => materialType === "support"),

    extended: materials.filter(
      ({ materialType }) => materialType === "extended",
    ),
  };
}

export async function getAvailableStudyMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  const materials = await getStudyMaterialsWithStatus();

  return materials.filter(({ status }) => status === "available");
}

export async function getNextStudyMaterial(): Promise<StudyMaterialWithStatus | null> {
  const materials = await getStudyMaterialsWithStatus();

  return materials.find(({ status }) => status === "locked") ?? null;
}
