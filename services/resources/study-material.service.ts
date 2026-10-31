import { supabase } from "@/lib/supabase/client";

import {
  isSpain,
  type Region,
} from "@/lib/utils/regions";

import type {
  MaterialType,
  StudyMaterial,
  StudyMaterialWithStatus,
} from "@/types/study-material";

const STUDY_MATERIALS_TABLE = "study_materials";

const PDF_BUCKET = "study-materials";
const THUMBNAIL_BUCKET = "study-material-thumbnails";

const SIGNED_URL_SECONDS = 60 * 60;

const MATERIALS_ENDPOINT = "/api/resources/materials";

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

const ERROR_GET_MATERIALS =
  "No se han podido recuperar los materiales.";

const ERROR_MATERIALS_ENDPOINT =
  "No se han podido recuperar los materiales del programa.";

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
  release_date_spain: string | null;
  release_date_latam: string | null;
}

interface StudyMaterialApiResponse {
  materials?: StudyMaterialWithStatus[];
  error?: string;
}

/**
 * Obtiene la ruta de un archivo almacenado
 * en Supabase Storage.
 */
function getStoragePath(
  value: string,
  bucket: string,
): string | null {
  if (!value) {
    return null;
  }

  if (
    !value.startsWith("http://") &&
    !value.startsWith("https://")
  ) {
    const normalized = value.replace(/^\/+/, "");

    return /^(spain|latam)\/(support|extended)\//.test(
      normalized,
    )
      ? normalized
      : null;
  }

  const publicMarker =
    `/storage/v1/object/public/${bucket}/`;

  const signedMarker =
    `/storage/v1/object/sign/${bucket}/`;

  const publicIndex = value.indexOf(publicMarker);
  const signedIndex = value.indexOf(signedMarker);

  if (publicIndex >= 0) {
    return decodeURIComponent(
      value.slice(publicIndex + publicMarker.length),
    );
  }

  if (signedIndex >= 0) {
    const path = value
      .slice(signedIndex + signedMarker.length)
      .split("?")[0];

    return path ? decodeURIComponent(path) : null;
  }

  return null;
}

/**
 * Genera una URL firmada para un archivo privado.
 */
async function resolveStorageUrl(
  value: string,
  bucket: string,
): Promise<string> {
  const path = getStoragePath(value, bucket);

  if (!path) {
    return value;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_SECONDS);

  if (error || !data?.signedUrl) {
    throw new Error(ERROR_GET_MATERIALS);
  }

  return data.signedUrl;
}

/**
 * Resuelve las URLs del PDF y de su miniatura.
 *
 * Se conserva para las consultas generales de materiales.
 */
async function resolveMaterialUrls(
  material: StudyMaterial,
): Promise<StudyMaterial> {
  const [pdfUrl, thumbnailUrl] = await Promise.all([
    resolveStorageUrl(material.pdfUrl, PDF_BUCKET),
    resolveStorageUrl(
      material.thumbnailUrl,
      THUMBNAIL_BUCKET,
    ),
  ]);

  return {
    ...material,
    pdfUrl,
    thumbnailUrl,
  };
}

/**
 * Convierte una fila de Supabase al modelo de la aplicación.
 *
 * Las fechas nulas se normalizan a cadenas vacías,
 * manteniendo la compatibilidad con StudyMaterial.
 */
function mapMaterial(
  row: StudyMaterialRow,
): StudyMaterial {
  const releaseDateSpain: string =
    row.release_date_spain ?? "";

  const releaseDateLatam: string =
    row.release_date_latam ?? "";

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    pdfUrl: row.pdf_url,
    thumbnailUrl: row.thumbnail_url,
    materialOrder: row.material_order,
    materialType: row.material_type,
    releaseDateSpain,
    releaseDateLatam,
  };
}

/**
 * Devuelve la fecha de publicación correspondiente
 * a la región del participante.
 */
function getReleaseDate(
  material: StudyMaterial,
  region: Region,
): string | null {
  return isSpain(region)
    ? material.releaseDateSpain
    : material.releaseDateLatam;
}

/**
 * Comprueba si la fecha de publicación ha llegado.
 *
 * Las fechas vacías o inválidas no desbloquean materiales.
 */
function isReleased(
  releaseDate: string | null | undefined,
): boolean {
  if (!releaseDate) {
    return false;
  }

  const timestamp = Date.parse(releaseDate);

  return (
    Number.isFinite(timestamp) &&
    timestamp <= Date.now()
  );
}

/**
 * Comprueba si un material está disponible
 * para una región determinada.
 */
export function isMaterialAvailable(
  material: StudyMaterial,
  region: Region,
): boolean {
  return isReleased(getReleaseDate(material, region));
}

/**
 * Calcula el estado del material.
 */
function getStatus(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus["status"] {
  return isMaterialAvailable(material, region)
    ? "available"
    : "locked";
}

/**
 * Añade el estado de disponibilidad al material.
 */
function mapMaterialWithStatus(
  material: StudyMaterial,
  region: Region,
): StudyMaterialWithStatus {
  const releaseDate = getReleaseDate(material, region);
  const status = getStatus(material, region);

  return {
    ...material,
    releaseDate,
    status,
    lockReason:
      status === "locked"
        ? "release-date"
        : null,
  };
}

/**
 * Obtiene todos los materiales del estudio,
 * ordenados por sesión y tipo.
 *
 * Se conserva el método original para mantener
 * la compatibilidad con otros servicios.
 */
export async function getStudyMaterials(): Promise<
  StudyMaterial[]
> {
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

  const materials = (data ?? []).map((row) =>
    mapMaterial(row as StudyMaterialRow),
  );

  return Promise.all(
    materials.map(resolveMaterialUrls),
  );
}

/**
 * Obtiene un material concreto por su identificador.
 *
 * Se conserva el comportamiento original.
 */
export async function getStudyMaterialById(
  materialId: string,
): Promise<StudyMaterial | null> {
  if (!materialId) {
    return null;
  }

  const { data, error } = await supabase
    .from(STUDY_MATERIALS_TABLE)
    .select(MATERIAL_FIELDS)
    .eq("id", materialId)
    .maybeSingle();

  if (error) {
    throw new Error(ERROR_GET_MATERIALS);
  }

  if (!data) {
    return null;
  }

  const material = mapMaterial(
    data as StudyMaterialRow,
  );

  return resolveMaterialUrls(material);
}

/**
 * NUEVA IMPLEMENTACIÓN:
 *
 * Recupera todos los materiales mediante el endpoint
 * seguro del servidor.
 *
 * El endpoint:
 *
 * - Identifica al participante autenticado.
 * - Recupera su región.
 * - Obtiene los materiales de esa región.
 * - Incluye los materiales disponibles.
 * - Incluye los materiales pendientes de publicación.
 * - Calcula el estado de cada material.
 * - No entrega la URL del PDF de los materiales bloqueados.
 *
 * Importante:
 * No filtrar por status === "available" aquí.
 */
export async function getStudyMaterialsWithStatus(): Promise<
  StudyMaterialWithStatus[]
> {
  const response = await fetch(
    MATERIALS_ENDPOINT,
    {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const payload =
    (await response.json().catch(() => null)) as
    | StudyMaterialApiResponse
    | null;

  if (
    !response.ok ||
    !payload ||
    !Array.isArray(payload.materials)
  ) {
    console.error(
      "Error retrieving study materials:",
      payload?.error,
    );

    throw new Error(
      payload?.error ?? ERROR_MATERIALS_ENDPOINT,
    );
  }

  const materials = payload.materials;

  /*
   * Validación defensiva de los estados recibidos.
   *
   * Un material sin un estado válido no debe
   * considerarse disponible por defecto.
   */
  return materials.map((material) => {
    const validStatus =
      material.status === "available" ||
      material.status === "locked";

    if (!validStatus) {
      return {
        ...material,
        pdfUrl: "",
        status: "locked" as const,
        lockReason: "release-date" as const,
      };
    }

    if (material.status === "locked") {
      return {
        ...material,
        pdfUrl: "",
        status: "locked" as const,
        lockReason: "release-date" as const,
      };
    }

    return {
      ...material,
      status: "available" as const,
      lockReason: null,
    };
  });
}

/**
 * Agrupa TODOS los materiales por tipo.
 *
 * IMPORTANTE:
 * No elimina los materiales bloqueados.
 *
 * Cada categoría recibe tanto los materiales
 * disponibles como los pendientes de publicación.
 */
export async function getGroupedStudyMaterials(): Promise<
  GroupedStudyMaterials
> {
  const materials = await getStudyMaterialsWithStatus();

  const orderedMaterials = [...materials].sort(
    (first, second) => {
      if (first.materialOrder !== second.materialOrder) {
        return first.materialOrder - second.materialOrder;
      }

      return first.materialType.localeCompare(
        second.materialType,
      );
    },
  );

  return {
    support: orderedMaterials.filter(
      ({ materialType }) =>
        materialType === "support",
    ),

    extended: orderedMaterials.filter(
      ({ materialType }) =>
        materialType === "extended",
    ),
  };
}

/**
 * Devuelve únicamente los materiales disponibles.
 *
 * Se conserva para los lugares de la aplicación
 * que necesiten exclusivamente recursos desbloqueados.
 */
export async function getAvailableStudyMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  const materials = await getStudyMaterialsWithStatus();

  return materials.filter(
    ({ status }) => status === "available",
  );
}

/**
 * Devuelve el primer material bloqueado,
 * siguiendo el orden de las sesiones.
 */
export async function getNextStudyMaterial(): Promise<
  StudyMaterialWithStatus | null
> {
  const materials = await getStudyMaterialsWithStatus();

  return (
    [...materials]
      .filter(({ status }) => status === "locked")
      .sort(
        (first, second) =>
          first.materialOrder - second.materialOrder,
      )[0] ?? null
  );
}