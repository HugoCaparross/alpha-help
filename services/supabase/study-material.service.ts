import { supabase } from "@/lib/supabase/client";

import type {
  StudyMaterial,
  StudyMaterialWithStatus,
} from "@/types/study-material";

import type { Region } from "@/lib/utils/regions";
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

function mapRow(
  row: StudyMaterialRow,
): StudyMaterial {
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

function resolveReleaseDate(
  material: StudyMaterial,
  region: Region,
): string {
  return region === "España"
    ? material.releaseDateSpain
    : material.releaseDateLatam;
}

function resolveStatus(
  releaseDate: string,
): StudyMaterialWithStatus["status"] {
  return new Date(releaseDate).getTime() <= Date.now()
    ? "available"
    : "locked";
}

/**
 * Obtiene todos los materiales del programa.
 */
export async function getStudyMaterials(): Promise<
  StudyMaterial[]
> {
  const { data, error } = await supabase
    .from("study_materials")
    .select("*")
    .order("material_order", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRow);
}

/**
 * Obtiene todos los materiales resolviendo
 * automáticamente la fecha y el estado
 * según la región del usuario.
 */
export async function getStudyMaterialsWithStatus(
  region: Region,
): Promise<StudyMaterialWithStatus[]> {
  const materials =
    await getStudyMaterials();

  return materials.map((material) => {
    const releaseDate =
      resolveReleaseDate(
        material,
        region,
      );

    return {
      ...material,

      releaseDate,

      status:
        resolveStatus(releaseDate),
    };
  });
}

/**
 * Devuelve únicamente los materiales
 * ya disponibles.
 */
export async function getAvailableStudyMaterials(
  region: Region,
): Promise<StudyMaterialWithStatus[]> {
  const materials =
    await getStudyMaterialsWithStatus(
      region,
    );

  return materials.filter(
    (material) =>
      material.status ===
      "available",
  );
}

/**
 * Devuelve el siguiente material
 * que todavía permanece bloqueado.
 */
export async function getNextStudyMaterial(
  region: Region,
): Promise<StudyMaterialWithStatus | null> {
  const materials =
    await getStudyMaterialsWithStatus(
      region,
    );

  const locked = materials
    .filter(
      (material) =>
        material.status ===
        "locked",
    )
    .sort(
      (a, b) =>
        new Date(
          a.releaseDate,
        ).getTime() -
        new Date(
          b.releaseDate,
        ).getTime(),
    );

  return locked[0] ?? null;
}