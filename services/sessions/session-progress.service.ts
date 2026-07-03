import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

const SESSION_VIEWS_TABLE = "session_views";

const ERROR_UNAUTHENTICATED =
  "Usuario no autenticado.";

const ERROR_REGISTER =
  "No se ha podido registrar la sesión.";

const ERROR_CHECK =
  "No se ha podido comprobar la sesión.";

const ERROR_PROGRESS =
  "No se ha podido recuperar el progreso.";

const ERROR_DELETE =
  "No se ha podido eliminar el progreso.";

/**
 * Devuelve el usuario autenticado.
 */
async function getAuthenticatedUser() {
  const user = await getUser();

  if (!user) {
    throw new Error(ERROR_UNAUTHENTICATED);
  }

  return user;
}

/**
 * Marca una sesión como completada.
 *
 * Si la sesión ya estaba registrada,
 * no realiza ninguna acción.
 */
export async function markSessionCompleted(
  sessionId: string,
): Promise<void> {
  const user =
    await getAuthenticatedUser();

  const completed =
    await isSessionCompleted(
      sessionId,
      user.id,
    );

  if (completed) {
    return;
  }

  const { error } = await supabase
    .from(SESSION_VIEWS_TABLE)
    .insert({
      user_id: user.id,
      session_id: sessionId,
    });

  if (error) {
    throw new Error(ERROR_REGISTER);
  }
}

/**
 * Comprueba si una sesión
 * ya ha sido completada.
 */
export async function isSessionCompleted(
  sessionId: string,
  userId?: string,
): Promise<boolean> {
  const authenticatedUser =
    userId
      ? { id: userId }
      : await getAuthenticatedUser();

  const { data, error } =
    await supabase
      .from(SESSION_VIEWS_TABLE)
      .select("id")
      .eq(
        "user_id",
        authenticatedUser.id,
      )
      .eq(
        "session_id",
        sessionId,
      )
      .maybeSingle();

  if (error) {
    throw new Error(ERROR_CHECK);
  }

  return data !== null;
}

/**
 * Devuelve los identificadores
 * de todas las sesiones completadas
 * por el participante.
 */
export async function getCompletedSessionIds(): Promise<
  string[]
> {
  const user =
    await getAuthenticatedUser();

  const { data, error } =
    await supabase
      .from(SESSION_VIEWS_TABLE)
      .select("session_id")
      .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return (data ?? []).map(
    ({ session_id }) => session_id,
  );
}

/**
 * Devuelve el número total
 * de sesiones completadas.
 */
export async function getCompletedSessionsCount(): Promise<number> {
  const user =
    await getAuthenticatedUser();

  const { count, error } =
    await supabase
      .from(SESSION_VIEWS_TABLE)
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
 * Calcula el porcentaje
 * de progreso del participante.
 */
export async function getSessionProgress(
  totalSessions: number,
): Promise<number> {
  if (totalSessions <= 0) {
    return 0;
  }

  const completed =
    await getCompletedSessionsCount();

  return Math.round(
    (completed / totalSessions) * 100,
  );
}

/**
 * Elimina el registro
 * de una sesión completada.
 *
 * Uso exclusivo para
 * administración o pruebas.
 */
export async function unmarkSessionCompleted(
  sessionId: string,
): Promise<void> {
  const user =
    await getAuthenticatedUser();

  const { error } =
    await supabase
      .from(SESSION_VIEWS_TABLE)
      .delete()
      .eq("user_id", user.id)
      .eq("session_id", sessionId);

  if (error) {
    throw new Error(ERROR_DELETE);
  }
}