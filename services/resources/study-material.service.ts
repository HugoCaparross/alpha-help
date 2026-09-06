import type {
  StudyMaterial,
  StudyMaterialWithStatus,
} from "@/types/study-material";

const MATERIALS_ENDPOINT =
  "/api/resources/materials";

export const TOTAL_STUDY_MATERIALS = 10;

export interface GroupedStudyMaterials {
  readonly support: StudyMaterialWithStatus[];
  readonly extended: StudyMaterialWithStatus[];
}

interface MaterialsResponse {
  materials?: StudyMaterialWithStatus[];
  error?: string;
}

/**
 * Recupera los materiales desde el endpoint del servidor.
 *
 * La disponibilidad NO se calcula aquí.
 * El servidor es la única fuente de verdad para:
 *
 * - evaluación inicial completada;
 * - fecha de liberación;
 * - región del participante;
 * - estado del material.
 *
 * De esta forma el cliente nunca puede desbloquear
 * un material modificando una fecha localmente.
 */
async function fetchMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  const response = await fetch(
    MATERIALS_ENDPOINT,
    {
      cache: "no-store",
      credentials: "include",
    },
  );

  const payload =
    (await response
      .json()
      .catch(() => null)) as
    | MaterialsResponse
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.error ??
      "No se han podido recuperar los materiales.",
    );
  }

  if (
    !payload ||
    !Array.isArray(
      payload.materials,
    )
  ) {
    return [];
  }

  return payload.materials.filter(
    (material) =>
      material &&
      typeof material.id ===
      "string" &&
      typeof material.title ===
      "string" &&
      typeof material.description ===
      "string" &&
      typeof material.materialOrder ===
      "number" &&
      Number.isInteger(
        material.materialOrder,
      ) &&
      material.materialOrder >=
      0 &&
      material.materialOrder <
      TOTAL_STUDY_MATERIALS &&
      (
        material.materialType ===
        "support" ||
        material.materialType ===
        "extended"
      ) &&
      (
        material.status ===
        "available" ||
        material.status ===
        "locked"
      ),
  );
}

/**
 * Devuelve todos los materiales.
 *
 * El estado ya viene determinado
 * por el servidor.
 */
export async function getStudyMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  return fetchMaterials();
}

/**
 * Obtiene un material concreto por id.
 *
 * Si está bloqueado, devuelve el objeto
 * con su estado bloqueado.
 *
 * La URL real del PDF debe ser controlada
 * exclusivamente por el endpoint del servidor.
 */
export async function getStudyMaterialById(
  materialId: string,
): Promise<
  StudyMaterialWithStatus | null
> {
  if (!materialId) {
    return null;
  }

  const materials =
    await fetchMaterials();

  return (
    materials.find(
      (material) =>
        material.id ===
        materialId,
    ) ?? null
  );
}

/**
 * Devuelve todos los materiales junto
 * con su estado de disponibilidad.
 */
export async function getStudyMaterialsWithStatus(): Promise<
  StudyMaterialWithStatus[]
> {
  return fetchMaterials();
}

/**
 * Agrupa los materiales entre:
 *
 * - versión reducida / material de apoyo;
 * - versión extendida.
 */
export async function getGroupedStudyMaterials(): Promise<
  GroupedStudyMaterials
> {
  const materials =
    await fetchMaterials();

  return groupStudyMaterials(
    materials,
  );
}

/**
 * Devuelve únicamente los materiales
 * que el servidor ha marcado como disponibles.
 *
 * IMPORTANTE:
 * Esta función NO desbloquea materiales.
 * Solo filtra el resultado recibido.
 */
export async function getAvailableStudyMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  const materials =
    await fetchMaterials();

  return materials.filter(
    ({
      status,
    }) =>
      status ===
      "available",
  );
}

/**
 * Devuelve el siguiente material pendiente
 * según el orden de las sesiones.
 *
 * El material puede estar bloqueado por:
 *
 * - evaluación inicial pendiente;
 * - fecha de liberación todavía no alcanzada.
 */
export async function getNextStudyMaterial(): Promise<
  StudyMaterialWithStatus | null
> {
  const materials =
    await fetchMaterials();

  return (
    [...materials]
      .filter(
        ({
          status,
        }) =>
          status ===
          "locked",
      )
      .sort(
        (
          first,
          second,
        ) =>
          first.materialOrder -
          second.materialOrder,
      )[0] ?? null
  );
}

/**
 * Separa los materiales por tipo.
 *
 * Tanto los materiales reducidos como los
 * extendidos mantienen exactamente las mismas
 * reglas de disponibilidad.
 */
export function groupStudyMaterials(
  materials: readonly StudyMaterialWithStatus[],
): GroupedStudyMaterials {
  return {
    support:
      materials.filter(
        ({
          materialType,
        }: StudyMaterialWithStatus) =>
          materialType ===
          "support",
      ),

    extended:
      materials.filter(
        ({
          materialType,
        }: StudyMaterialWithStatus) =>
          materialType ===
          "extended",
      ),
  };
}