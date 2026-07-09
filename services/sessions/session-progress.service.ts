import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

const SESSION_VIEWS_TABLE =
  "session_views" as const;

const ERROR_UNAUTHENTICATED =
  "Usuario no autenticado.";

const ERROR_REGISTER =
  "No se ha podido registrar la visualización de la sesión.";

const ERROR_CHECK =
  "No se ha podido comprobar el progreso de la sesión.";

const ERROR_PROGRESS =
  "No se ha podido recuperar el progreso.";

const ERROR_DELETE =
  "No se ha podido eliminar el progreso.";

/**
 * Código PostgreSQL para
 * violación de clave única.
 */
const UNIQUE_VIOLATION =
  "23505";

/**
 * Devuelve el usuario autenticado.
 */
async function getAuthenticatedUser() {
  const user = await getUser();

  if (!user) {
    throw new Error(
      ERROR_UNAUTHENTICATED,
    );
  }

  return user;
}

/**
 * Marca una sesión como visualizada.
 *
 * Cada sesión únicamente puede
 * registrarse una vez por participante.
 *
 * La integridad está garantizada
 * mediante la restricción UNIQUE
 * (user_id, session_id).
 */
export async function markSessionCompleted(
  sessionId: string,
): Promise<void> {
  const user =
    await getAuthenticatedUser();

  const { error } =
    await supabase
      .from(SESSION_VIEWS_TABLE)
      .insert({
        user_id: user.id,
        session_id: sessionId,
      });

  if (!error) {
    return;
  }

  /**
   * La sesión ya estaba
   * registrada.
   */
  if (
    error.code ===
    UNIQUE_VIOLATION
  ) {
    return;
  }

  throw new Error(
    ERROR_REGISTER,
  );
}

/**
 * Comprueba si el participante
 * ya ha visualizado una sesión.
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
    throw new Error(
      ERROR_CHECK,
    );
  }

  return data !== null;
}

/**
 * Devuelve los identificadores
 * de todas las sesiones
 * visualizadas por el participante.
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
    throw new Error(
      ERROR_PROGRESS,
    );
  }

  return (data ?? []).map(
    ({ session_id }) =>
      session_id,
  );
}

/**
 * Devuelve el número de sesiones
 * visualizadas por el participante.
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
    throw new Error(
      ERROR_PROGRESS,
    );
  }

  return count ?? 0;
}

/**
 * Calcula el porcentaje de progreso
 * respecto a las sesiones
 * del estudio.
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
    (completed / totalSessions) *
      100,
  );
}

/**
 * Elimina el registro de
 * visualización de una sesión.
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
      .eq(
        "session_id",
        sessionId,
      );

  if (error) {
    throw new Error(
      ERROR_DELETE,
    );
  }
}