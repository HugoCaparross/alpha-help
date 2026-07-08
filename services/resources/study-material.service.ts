import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

import {
  isSpain,
  type Region,
} from "@/lib/utils/regions";

import type {
  MaterialType,
  StudyMaterial,
  StudyMaterialWithStatus,
} from "@/types/study-material";

const STUDY_MATERIALS_TABLE =
  "study_materials";

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

const ERROR_GET_MATERIALS =
  "No se han podido recuperar los materiales.";

const ERROR_PROFILE_NOT_FOUND =
  "No se ha podido recuperar el perfil del participante.";

/**
 * Materiales agrupados
 * por tipo.
 */
export interface GroupedStudyMaterials {
  readonly support: StudyMaterialWithStatus[];

  readonly extended: StudyMaterialWithStatus[];
}

/**
 * Modelo recibido desde Supabase.
 */
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

/**
 * Convierte una fila de Supabase
 * al modelo de dominio.
 */
function mapMaterial(
  row: StudyMaterialRow,
): StudyMaterial {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    pdfUrl: row.pdf_url,

    thumbnailUrl:
      row.thumbnail_url,

    materialOrder:
      row.material_order,

    materialType:
      row.material_type,

    releaseDateSpain:
      row.release_date_spain,

    releaseDateLatam:
      row.release_date_latam,
  };
}

/**
 * Obtiene automáticamente
 * la región del participante
 * autenticado.
 */
async function getCurrentRegion(): Promise<Region> {
  const profile =
    await getProfile();

  if (!profile) {
    throw new Error(
      ERROR_PROFILE_NOT_FOUND,
    );
  }

  return profile.region;
}

/**
 * Devuelve la fecha de publicación
 * correspondiente a la región.
 */
function getReleaseDate(
  material: StudyMaterial,
  region: Region,
): string {
  return isSpain(region)
    ? material.releaseDateSpain
    : material.releaseDateLatam;
}

/**
 * Indica si el material
 * ya está publicado.
 */
function isReleased(
  releaseDate: string,
): boolean {
  return (
    Date.parse(releaseDate) <=
    Date.now()
  );
}

/**
 * Calcula el estado
 * del material.
 */
function getStatus(
  releaseDate: string,
): StudyMaterialWithStatus["status"] {
  return isReleased(
    releaseDate,
  )
    ? "available"
    : "locked";
}

/**
 * Convierte un material
 * al modelo utilizado
 * por la interfaz.
 */
function mapMaterialWithStatus(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus {
  const releaseDate =
    getReleaseDate(
      material,
      region,
    );

  return {
    ...material,

    releaseDate,

    status:
      getStatus(
        releaseDate,
      ),
  };
}

/**
 * Obtiene todos los materiales
 * del estudio.
 */
export async function getStudyMaterials(): Promise<
  StudyMaterial[]
> {
  const {
    data,
    error,
  } = await supabase
    .from(STUDY_MATERIALS_TABLE)
    .select(MATERIAL_FIELDS)
    .order(
      "material_order",
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      ERROR_GET_MATERIALS,
    );
  }

  return (data ?? []).map(
    mapMaterial,
  );
}

/**
 * Obtiene un material concreto.
 */
export async function getStudyMaterialById(
  materialId: string,
): Promise<StudyMaterial | null> {
  const {
    data,
    error,
  } = await supabase
    .from(STUDY_MATERIALS_TABLE)
    .select(MATERIAL_FIELDS)
    .eq("id", materialId)
    .maybeSingle();

  if (error) {
    throw new Error(
      ERROR_GET_MATERIALS,
    );
  }

  if (!data) {
    return null;
  }

  return mapMaterial(
    data as StudyMaterialRow,
  );
}

/**
 * Obtiene todos los materiales
 * resolviendo automáticamente
 * la región y el estado
 * del participante.
 */
export async function getStudyMaterialsWithStatus(): Promise<
  StudyMaterialWithStatus[]
> {
  const [
    region,
    materials,
  ] = await Promise.all([
    getCurrentRegion(),
    getStudyMaterials(),
  ]);

  return materials.map(
    (material) =>
      mapMaterialWithStatus(
        material,
        region,
      ),
  );
}

/**
 * Obtiene los materiales
 * agrupados por tipo.
 */
export async function getGroupedStudyMaterials(): Promise<
  GroupedStudyMaterials
> {
  const materials =
    await getStudyMaterialsWithStatus();

  return {
    support: materials.filter(
      ({ materialType }) =>
        materialType === "support",
    ),

    extended: materials.filter(
      ({ materialType }) =>
        materialType === "extended",
    ),
  };
}

/**
 * Devuelve únicamente
 * los materiales disponibles.
 */
export async function getAvailableStudyMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  const materials =
    await getStudyMaterialsWithStatus();

  return materials.filter(
    ({ status }) =>
      status === "available",
  );
}

/**
 * Devuelve el siguiente material
 * pendiente de publicación.
 */
export async function getNextStudyMaterial(): Promise<
  StudyMaterialWithStatus | null
> {
  const materials =
    await getStudyMaterialsWithStatus();

  return (
    materials.find(
      ({ status }) =>
        status === "locked",
    ) ?? null
  );
}