import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

const MATERIAL_VIEWS_TABLE = "material_views" as const;

const ERROR_UNAUTHENTICATED = "Usuario no autenticado.";

const ERROR_REGISTER = "No se ha podido registrar la consulta del material.";

const ERROR_CHECK = "No se ha podido comprobar el progreso del material.";

const ERROR_PROGRESS = "No se ha podido recuperar el progreso.";

/**
 * Código PostgreSQL para
 * violación de clave única.
 */
const UNIQUE_VIOLATION = "23505";

/**
 * Devuelve el usuario autenticado.
 *
 * El identificador del usuario siempre
 * procede de la sesión autenticada.
 */
async function getAuthenticatedUser() {
  const user = await getUser();

  if (!user) {
    throw new Error(ERROR_UNAUTHENTICATED);
  }

  return user;
}

/**
 * Marca como consultado el material
 * correspondiente a una sesión.
 *
 * Cada sesión únicamente puede
 * registrarse una vez por usuario,
 * independientemente del documento
 * consultado (recurso de apoyo o
 * guía ampliada).
 *
 * La base de datos garantiza esta
 * restricción mediante una clave
 * UNIQUE (user_id, session_order).
 */
export async function markMaterialAsCompleted(
  sessionOrder: number,
): Promise<void> {
  const user = await getAuthenticatedUser();

  const { error } = await supabase.from(MATERIAL_VIEWS_TABLE).insert({
    user_id: user.id,
    session_order: sessionOrder,
  });

  if (!error) {
    return;
  }

  /**
   * El material ya estaba registrado.
   *
   * El estado final deseado ya se cumple,
   * por lo que no se considera un error.
   */
  if (error.code === UNIQUE_VIOLATION) {
    return;
  }

  throw new Error(ERROR_REGISTER);
}

/**
 * Comprueba si el participante
 * ya ha consultado el material
 * correspondiente a una sesión.
 *
 * El usuario siempre se obtiene
 * de la sesión autenticada.
 */
export async function hasCompletedMaterial(
  sessionOrder: number,
): Promise<boolean> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("id")
    .eq("user_id", user.id)
    .eq("session_order", sessionOrder)
    .maybeSingle();

  if (error) {
    throw new Error(ERROR_CHECK);
  }

  return data !== null;
}

/**
 * Devuelve las sesiones cuyos
 * materiales ya han sido consultados.
 */
export async function getCompletedSessionOrders(): Promise<number[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("session_order")
    .eq("user_id", user.id)
    .order("session_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return (data ?? []).map(({ session_order }) => session_order);
}

/**
 * Devuelve el número de sesiones
 * cuyos materiales han sido consultados.
 */
export async function getCompletedSessionsCount(): Promise<number> {
  const user = await getAuthenticatedUser();

  const { count, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return count ?? 0;
}

/**
 * Calcula el porcentaje de progreso
 * respecto a los materiales del estudio.
 */
export async function getMaterialProgress(
  totalSessions: number,
): Promise<number> {
  if (totalSessions <= 0) {
    return 0;
  }

  const completed = await getCompletedSessionsCount();

  return Math.round((completed / totalSessions) * 100);
}
