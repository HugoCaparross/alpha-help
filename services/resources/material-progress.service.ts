import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

const MATERIAL_VIEWS_TABLE = "material_views";

/**
 * Marca un material como leído
 * por el participante.
 *
 * Si ya estaba registrado,
 * no realiza ninguna acción.
 */
export async function markMaterialAsCompleted(
  materialId: string,
): Promise<void> {
  const user = await getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const alreadyCompleted =
    await hasCompletedMaterial(materialId);

  if (alreadyCompleted) {
    return;
  }

  const { error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .insert({
      user_id: user.id,
      material_id: materialId,
    });

  if (error) {
    throw new Error(
      "No se ha podido registrar el material.",
    );
  }
}

/**
 * Comprueba si un material
 * ya ha sido marcado como leído.
 */
export async function hasCompletedMaterial(
  materialId: string,
): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("id")
    .eq("user_id", user.id)
    .eq("material_id", materialId)
    .maybeSingle();

  if (error) {
    throw new Error(
      "No se ha podido comprobar el material.",
    );
  }

  return data !== null;
}

/**
 * Devuelve los identificadores
 * de todos los materiales
 * completados por el participante.
 */
export async function getCompletedMaterialIds(): Promise<
  string[]
> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("material_id")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(
      "No se ha podido recuperar el progreso.",
    );
  }

  return data.map(
    ({ material_id }) => material_id,
  );
}

/**
 * Devuelve el número
 * de materiales completados.
 */
export async function getCompletedMaterialsCount(): Promise<number> {
  const user = await getUser();

  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(
      "No se ha podido recuperar el progreso.",
    );
  }

  return count ?? 0;
}

/**
 * Devuelve el porcentaje
 * de progreso del participante.
 */
export async function getMaterialProgress(
  totalMaterials: number,
): Promise<number> {
  if (totalMaterials <= 0) {
    return 0;
  }

  const completed =
    await getCompletedMaterialsCount();

  return Math.round(
    (completed / totalMaterials) * 100,
  );
}

/**
 * Elimina el registro
 * de un material completado.
 *
 * Uso exclusivo para administración
 * o pruebas.
 */
export async function unmarkMaterialAsCompleted(
  materialId: string,
): Promise<void> {
  const user = await getUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  const { error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .delete()
    .eq("user_id", user.id)
    .eq("material_id", materialId);

  if (error) {
    throw new Error(
      "No se ha podido eliminar el progreso.",
    );
  }
}