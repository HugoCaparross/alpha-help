import { supabase } from "@/lib/supabase/client";

import { isSpain } from "@/lib/utils/regions";

import type { Region } from "@/lib/utils/regions";

import type {
  Session,
  SessionWithStatus,
} from "@/types/study-session";

/**
 * Forma cruda de la fila tal y como la devuelve Supabase.
 * Se utiliza únicamente para mapear snake_case → camelCase.
 */
interface SessionRow {
  id: string;

  title: string;

  description: string;

  youtube_url: string;

  thumbnail_url: string;

  session_order: number;

  release_date_spain: string;

  release_date_latam: string;
}

/**
 * Convierte una fila de Supabase al modelo de dominio.
 */
function mapRow(row: SessionRow): Session {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    youtubeUrl: row.youtube_url,

    thumbnailUrl: row.thumbnail_url,

    sessionOrder: row.session_order,

    releaseDateSpain: row.release_date_spain,

    releaseDateLatam: row.release_date_latam,
  };
}

/**
 * Devuelve la fecha de publicación correspondiente
 * a la región del usuario.
 */
function resolveReleaseDate(
  session: Session,
  region: Region,
): string {
  return isSpain(region)
    ? session.releaseDateSpain
    : session.releaseDateLatam;
}

/**
 * Calcula el estado de la sesión según su fecha de publicación.
 */
function resolveStatus(
  releaseDate: string,
): SessionWithStatus["status"] {
  const releaseTimestamp = new Date(releaseDate).getTime();

  return releaseTimestamp <= Date.now()
    ? "available"
    : "locked";
}

/**
 * Resuelve una sesión completa para la región indicada.
 */
function resolveSession(
  session: Session,
  region: Region,
): SessionWithStatus {
  const releaseDate = resolveReleaseDate(
    session,
    region,
  );

  return {
    ...session,

    releaseDate,

    status: resolveStatus(releaseDate),
  };
}

/**
 * Obtiene todas las sesiones del programa.
 */
export async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("session_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Error al obtener las sesiones: ${error.message}`,
    );
  }

  return (data ?? []).map(mapRow);
}

/**
 * Obtiene todas las sesiones resolviendo automáticamente
 * su fecha de publicación y estado para la región indicada.
 */
export async function getSessionsWithStatus(
  region: Region,
): Promise<SessionWithStatus[]> {
  const studySessions = await getSessions();

  return studySessions.map((session) =>
    resolveSession(session, region),
  );
}

/**
 * Devuelve únicamente las sesiones
 * ya disponibles para el usuario.
 */
export async function getAvailableSessions(
  region: Region,
): Promise<SessionWithStatus[]> {
  const resolvedSessions =
    await getSessionsWithStatus(region);

  return resolvedSessions.filter(
    (session) => session.status === "available",
  );
}

/**
 * Devuelve la siguiente sesión
 * pendiente de desbloquearse.
 */
export async function getNextSession(
  region: Region,
): Promise<SessionWithStatus | null> {
  const resolvedSessions =
    await getSessionsWithStatus(region);

  const lockedSessions = resolvedSessions
    .filter(
      (session) => session.status === "locked",
    )
    .sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() -
        new Date(b.releaseDate).getTime(),
    );

  return lockedSessions.at(0) ?? null;
}