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
 * El programa contiene 10 contenidos:
 *
 * 0 = Introducción
 * 1-9 = nueve sesiones
 *
 * Cada contenido puede tener dos documentos:
 * - support
 * - extended
 *
 * La BD es la fuente de verdad sobre qué materiales existen.
 */
export const TOTAL_STUDY_MATERIALS = 10;

const FIRST_MATERIAL_ORDER = 0;
const LAST_MATERIAL_ORDER = 9;

const SIGNED_URL_EXPIRATION_SECONDS = 60 * 60;

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

export interface GroupedStudyMaterials {
  readonly support: StudyMaterialWithStatus[];
  readonly extended: StudyMaterialWithStatus[];
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

function normalizeMaterials(materials: StudyMaterial[]): StudyMaterial[] {
  return materials
    .filter(
      (material) =>
        material.materialOrder >= FIRST_MATERIAL_ORDER &&
        material.materialOrder <= LAST_MATERIAL_ORDER,
    )
    .sort(
      (first, second) =>
        first.materialOrder - second.materialOrder ||
        first.materialType.localeCompare(second.materialType),
    );
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

function mapMaterialWithStatus(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus {
  return {
    ...material,
    releaseDate: getReleaseDate(material, region),
    status: isMaterialAvailable(material, region) ? "available" : "locked",
  };
}

/**
 * Extrae de forma segura la ruta de un objeto de Storage.
 *
 * Acepta:
 *
 * https://PROJECT.supabase.co/storage/v1/object/public/study-materials/spain/support/file.pdf
 *
 * y también:
 *
 * spain/support/file.pdf
 *
 * No considera válidas URLs pertenecientes a otro bucket.
 */
function getStoragePath(value: string, bucket: string): string | null {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  /**
   * Si ya tenemos una ruta relativa de Storage,
   * intentamos utilizarla directamente.
   */
  const extractedPath = extractStoragePath(trimmedValue, bucket);

  if (extractedPath) {
    return extractedPath;
  }

  /**
   * Fallback específico para URLs públicas de Supabase.
   *
   * Esto evita depender de que extractStoragePath()
   * reconozca todas las variantes posibles de URL.
   */
  const publicStoragePrefix = `/storage/v1/object/public/${bucket}/`;

  const publicStorageIndex = trimmedValue.indexOf(publicStoragePrefix);

  if (publicStorageIndex !== -1) {
    const pathStart = publicStorageIndex + publicStoragePrefix.length;

    const path = trimmedValue.slice(pathStart).split("?")[0].split("#")[0];

    return path || null;
  }

  return null;
}

/**
 * Determina si un valor apunta realmente al bucket
 * que estamos intentando proteger.
 */
function isStorageReference(value: string, bucket: string): boolean {
  return getStoragePath(value, bucket) !== null;
}

/**
 * Genera una URL firmada únicamente cuando el valor
 * pertenece al bucket privado esperado.
 *
 * Si el valor no es una referencia válida de ese bucket,
 * se devuelve null para que el servicio pueda mantener
 * el valor original sin romper toda la pantalla.
 */
async function createSignedStorageUrl(
  value: string,
  bucket: string,
): Promise<string | null> {
  const path = getStoragePath(value, bucket);

  if (!path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_EXPIRATION_SECONDS);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

/**
 * Resuelve las URLs de un material.
 *
 * Importante:
 *
 * - PDFs reales del bucket privado se convierten en URLs firmadas.
 * - URLs pendientes/de prueba se conservan sin provocar
 *   un error global.
 * - Miniaturas locales como /images/logo.png se conservan.
 * - Miniaturas reales de Storage se convierten en URLs firmadas.
 */
async function resolveMaterialUrls(
  material: StudyMaterial,
): Promise<StudyMaterial> {
  let pdfUrl = material.pdfUrl;

  if (isStorageReference(material.pdfUrl, PDF_BUCKET)) {
    const signedPdfUrl = await createSignedStorageUrl(
      material.pdfUrl,
      PDF_BUCKET,
    );

    if (signedPdfUrl) {
      pdfUrl = signedPdfUrl;
    }
  }

  let thumbnailUrl = material.thumbnailUrl;

  if (isStorageReference(material.thumbnailUrl, THUMBNAIL_BUCKET)) {
    const signedThumbnailUrl = await createSignedStorageUrl(
      material.thumbnailUrl,
      THUMBNAIL_BUCKET,
    );

    if (signedThumbnailUrl) {
      thumbnailUrl = signedThumbnailUrl;
    }
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
    .gte("material_order", FIRST_MATERIAL_ORDER)
    .lte("material_order", LAST_MATERIAL_ORDER)
    .order("material_order", {
      ascending: true,
    })
    .order("material_type", {
      ascending: true,
    });

  if (error) {
    throw new Error(ERROR_GET_MATERIALS);
  }

  return normalizeMaterials(
    (data ?? []).map((row) => mapMaterial(row as StudyMaterialRow)),
  );
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

  if (
    material.materialOrder < FIRST_MATERIAL_ORDER ||
    material.materialOrder > LAST_MATERIAL_ORDER
  ) {
    return null;
  }

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
