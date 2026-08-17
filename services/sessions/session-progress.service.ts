import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

const SESSION_VIEWS_TABLE = "session_views" as const;

const TOTAL_STUDY_SESSIONS = 10;

const FIRST_SESSION_ORDER = 0;
const LAST_SESSION_ORDER = 9;

const ERROR_UNAUTHENTICATED = "Usuario no autenticado.";

const ERROR_REGISTER =
  "No se ha podido registrar la visualización de la sesión.";

const ERROR_CHECK = "No se ha podido comprobar el progreso de la sesión.";

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

/**
 * Marca una sesión como visualizada.
 *
 * La BD garantiza que un participante
 * solo tenga una visualización por sesión.
 */
export async function markSessionCompleted(sessionId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  if (!sessionId.trim()) {
    throw new Error(ERROR_REGISTER);
  }

  const { error } = await supabase.from(SESSION_VIEWS_TABLE).insert({
    user_id: user.id,
    session_id: sessionId,
  });

  if (!error) {
    return;
  }

  if (error.code === UNIQUE_VIOLATION) {
    return;
  }

  throw new Error(ERROR_REGISTER);
}

export async function isSessionCompleted(sessionId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from(SESSION_VIEWS_TABLE)
    .select("id")
    .eq("user_id", user.id)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(ERROR_CHECK);
  }

  return data !== null;
}

export async function getCompletedSessionIds(): Promise<string[]> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from(SESSION_VIEWS_TABLE)
    .select("session_id")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return (data ?? []).map(({ session_id }) => session_id);
}

export async function getCompletedSessionsCount(): Promise<number> {
  const user = await getAuthenticatedUser();

  const { count, error } = await supabase
    .from(SESSION_VIEWS_TABLE)
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(ERROR_PROGRESS);
  }

  return Math.min(count ?? 0, TOTAL_STUDY_SESSIONS);
}

export async function getSessionProgress(
  totalSessions = TOTAL_STUDY_SESSIONS,
): Promise<number> {
  const normalizedTotal = Math.min(
    Math.max(totalSessions, 0),
    TOTAL_STUDY_SESSIONS,
  );

  if (normalizedTotal === 0) {
    return 0;
  }

  const completed = await getCompletedSessionsCount();

  return Math.round((completed / normalizedTotal) * 100);
}

export function isValidSessionProgressOrder(sessionOrder: number): boolean {
  return isValidSessionOrder(sessionOrder);
}
