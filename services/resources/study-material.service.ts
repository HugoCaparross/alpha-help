import { supabase } from "@/lib/supabase/client";

import { isSpain } from "@/lib/utils/regions";

import type { Region } from "@/lib/utils/regions";

import type {
  StudyMaterial,
  StudyMaterialWithStatus,
} from "@/types/study-material";

/**
 * Forma cruda de la fila tal y como la devuelve Supabase.
 * Se utiliza únicamente para mapear snake_case → camelCase.
 */
interface StudyMaterialRow {
  id: string;

  title: string;

  description: string;

  pdf_url: string;

  thumbnail_url: string;

  material_order: number;

  release_date_spain: string;

  release_date_latam: string;
}

/**
 * Convierte una fila de Supabase al modelo de dominio.
 */
function mapRow(row: StudyMaterialRow): StudyMaterial {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    pdfUrl: row.pdf_url,

    thumbnailUrl: row.thumbnail_url,

    materialOrder: row.material_order,

    releaseDateSpain: row.release_date_spain,

    releaseDateLatam: row.release_date_latam,
  };
}

/**
 * Devuelve la fecha de publicación correspondiente
 * a la región del usuario.
 */
function resolveReleaseDate(
  material: StudyMaterial,
  region: Region,
): string {
  return isSpain(region)
    ? material.releaseDateSpain
    : material.releaseDateLatam;
}

/**
 * Calcula el estado del material según su fecha de publicación.
 */
function resolveStatus(
  releaseDate: string,
): StudyMaterialWithStatus["status"] {
  const releaseTimestamp = new Date(releaseDate).getTime();

  return releaseTimestamp <= Date.now()
    ? "available"
    : "locked";
}

/**
 * Resuelve un material completo para la región indicada.
 */
function resolveMaterial(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus {
  const releaseDate = resolveReleaseDate(material, region);

  return {
    ...material,

    releaseDate,

    status: resolveStatus(releaseDate),
  };
}

/**
 * Obtiene todos los materiales del programa.
 */
export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  const { data, error } = await supabase
    .from("study_materials")
    .select("*")
    .order("material_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Error al obtener los materiales: ${error.message}`,
    );
  }

  return (data ?? []).map(mapRow);
}

/**
 * Obtiene todos los materiales resolviendo automáticamente
 * su fecha de publicación y estado para la región indicada.
 */
export async function getStudyMaterialsWithStatus(
  region: Region,
): Promise<StudyMaterialWithStatus[]> {
  const studyMaterials = await getStudyMaterials();

  return studyMaterials.map((material) =>
    resolveMaterial(material, region),
  );
}

/**
 * Devuelve únicamente los materiales
 * ya disponibles para el usuario.
 */
export async function getAvailableStudyMaterials(
  region: Region,
): Promise<StudyMaterialWithStatus[]> {
  const resolvedMaterials =
    await getStudyMaterialsWithStatus(region);

  return resolvedMaterials.filter(
    (material) => material.status === "available",
  );
}

/**
 * Devuelve el siguiente material
 * pendiente de desbloquearse.
 */
export async function getNextStudyMaterial(
  region: Region,
): Promise<StudyMaterialWithStatus | null> {
  const resolvedMaterials =
    await getStudyMaterialsWithStatus(region);

  const lockedMaterials = resolvedMaterials
    .filter((material) => material.status === "locked")
    .sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() -
        new Date(b.releaseDate).getTime(),
    );

  return lockedMaterials.at(0) ?? null;
}