import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

const MATERIAL_VIEWS_TABLE = "material_views" as const;

/** Introducción + 9 sesiones. */
export const TOTAL_MATERIAL_CONTENTS = 10;
const FIRST_SESSION_ORDER = 0;
const LAST_SESSION_ORDER = 9;

const ERROR_UNAUTHENTICATED = "Usuario no autenticado.";
const ERROR_REGISTER = "No se ha podido registrar la consulta del material.";
const ERROR_CHECK = "No se ha podido comprobar el progreso del material.";
const ERROR_PROGRESS = "No se ha podido recuperar el progreso.";
const UNIQUE_VIOLATION = "23505";

async function getAuthenticatedUser() {
  const user = await getUser();

  if (!user) {
    throw new Error(ERROR_UNAUTHENTICATED);
  }

  return user;
}

function isValidSessionOrder(sessionOrder: number): boolean {
  return (
    Number.isInteger(sessionOrder) &&
    sessionOrder >= FIRST_SESSION_ORDER &&
    sessionOrder <= LAST_SESSION_ORDER
  );
}

export async function markMaterialAsCompleted(
  sessionOrder: number,
): Promise<void> {
  const user = await getAuthenticatedUser();

  if (!isValidSessionOrder(sessionOrder)) {
    throw new Error(ERROR_REGISTER);
  }

  const { error } = await supabase.from(MATERIAL_VIEWS_TABLE).insert({
    user_id: user.id,
    session_order: sessionOrder,
  });

  if (!error || error.code === UNIQUE_VIOLATION) {
    return;
  }

  throw new Error(ERROR_REGISTER);
}

export async function hasCompletedMaterial(
  sessionOrder: number,
): Promise<boolean> {
  const user = await getAuthenticatedUser();

  if (!isValidSessionOrder(sessionOrder)) {
    return false;
  }

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

export async function getCompletedSessionOrders(): Promise<number[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("session_order")
    .eq("user_id", user.id)
    .order("session_order", { ascending: true });

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return (data ?? [])
    .map(({ session_order }) => session_order)
    .filter(isValidSessionOrder);
}

export async function getCompletedSessionsCount(): Promise<number> {
  const user = await getAuthenticatedUser();

  const { count, error } = await supabase
    .from(MATERIAL_VIEWS_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return Math.min(count ?? 0, TOTAL_MATERIAL_CONTENTS);
}

export async function getMaterialProgress(
  totalSessions = TOTAL_MATERIAL_CONTENTS,
): Promise<number> {
  const normalizedTotal = Math.min(
    Math.max(totalSessions, 0),
    TOTAL_MATERIAL_CONTENTS,
  );

  if (normalizedTotal === 0) {
    return 0;
  }

  const completed = await getCompletedSessionsCount();
  return Math.round((completed / normalizedTotal) * 100);
}
