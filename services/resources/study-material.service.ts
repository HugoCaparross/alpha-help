import { supabase } from "@/lib/supabase/client";

import {
  isSpain,
  type Region,
} from "@/lib/utils/regions";

import type {
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
  release_date_spain,
  release_date_latam
`;

/**
 * Forma cruda devuelta por Supabase.
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
 * Convierte una fila de Supabase
 * al modelo utilizado por la aplicación.
 */
function mapRow(
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

    releaseDateSpain:
      row.release_date_spain,

    releaseDateLatam:
      row.release_date_latam,
  };
}

/**
 * Devuelve la fecha de publicación
 * correspondiente a la región indicada.
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
 * Calcula el estado actual
 * del material.
 */
function resolveStatus(
  releaseDate: string,
): StudyMaterialWithStatus["status"] {
  return Date.parse(
    releaseDate,
  ) <= Date.now()
    ? "available"
    : "locked";
}

/**
 * Convierte un material en un material
 * listo para mostrarse al participante.
 */
function resolveMaterial(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus {
  const releaseDate =
    resolveReleaseDate(
      material,
      region,
    );

  return {
    ...material,

    releaseDate,

    status:
      resolveStatus(
        releaseDate,
      ),
  };
}

/**
 * Obtiene todos los materiales
 * del programa.
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
      "No se han podido recuperar los materiales.",
    );
  }

  return (data ?? []).map(
    mapRow,
  );
}

/**
 * Obtiene todos los materiales
 * resolviendo automáticamente
 * su estado para la región indicada.
 */
export async function getStudyMaterialsWithStatus(
  region: Region,
): Promise<
  StudyMaterialWithStatus[]
> {
  const materials =
    await getStudyMaterials();

  return materials.map(
    (material) =>
      resolveMaterial(
        material,
        region,
      ),
  );
}

/**
 * Devuelve únicamente
 * los materiales disponibles.
 */
export async function getAvailableStudyMaterials(
  region: Region,
): Promise<
  StudyMaterialWithStatus[]
> {
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
 * pendiente de publicarse.
 */
export async function getNextStudyMaterial(
  region: Region,
): Promise<StudyMaterialWithStatus | null> {
  const materials =
    await getStudyMaterialsWithStatus(
      region,
    );

  const nextMaterial =
    materials
      .filter(
        (material) =>
          material.status ===
          "locked",
      )
      .sort(
        (a, b) =>
          Date.parse(
            a.releaseDate,
          ) -
          Date.parse(
            b.releaseDate,
          ),
      )[0];

  return nextMaterial ?? null;
}