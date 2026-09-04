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
      ),
  );
}

export async function getStudyMaterials(): Promise<
  StudyMaterial[]
> {
  const materials =
    await fetchMaterials();

  return materials;
}

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

export async function getStudyMaterialsWithStatus(): Promise<
  StudyMaterialWithStatus[]
> {
  return fetchMaterials();
}

export async function getGroupedStudyMaterials(): Promise<
  GroupedStudyMaterials
> {
  const materials =
    await fetchMaterials();

  return groupStudyMaterials(
    materials,
  );
}

export async function getAvailableStudyMaterials(): Promise<
  StudyMaterialWithStatus[]
> {
  const materials =
    await fetchMaterials();

  /*
   * El servidor es quien determina
   * realmente si el material está
   * disponible.
   *
   * El cliente no calcula fechas ni
   * puede desbloquear materiales.
   */
  return materials.filter(
    ({
      status,
    }) =>
      status ===
      "available",
  );
}

export async function getNextStudyMaterial(): Promise<
  StudyMaterialWithStatus | null
> {
  const materials =
    await fetchMaterials();

  /*
   * Buscamos el primer material
   * bloqueado por orden de sesión.
   */
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
