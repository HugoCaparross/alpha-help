import { supabase } from "@/lib/supabase/client";

import type {
  Session,
  SessionWithStatus,
  Region,
} from "@/types/study-session";

/**
 * Forma cruda de la fila tal y como la devuelve Supabase (snake_case).
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

function resolveReleaseDate(
  session: Session,
  region: Region,
): string {
  return region === "spain"
    ? session.releaseDateSpain
    : session.releaseDateLatam;
}

function resolveStatus(
  releaseDate: string,
): SessionWithStatus["status"] {
  return new Date(releaseDate).getTime() <= Date.now()
    ? "available"
    : "locked";
}

/**
 * Obtiene todas las sesiones ordenadas.
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
 * Obtiene todas las sesiones con su estado ya resuelto
 * según la región del usuario.
 */
export async function getSessionsWithStatus(
  region: Region,
): Promise<SessionWithStatus[]> {
  const sessions = await getSessions();

  return sessions.map((session) => {
    const releaseDate = resolveReleaseDate(
      session,
      region,
    );

    return {
      ...session,
      releaseDate,
      status: resolveStatus(releaseDate),
    };
  });
}

/**
 * Devuelve únicamente las sesiones disponibles.
 */
export async function getAvailableSessions(
  region: Region,
): Promise<SessionWithStatus[]> {
  const sessions =
    await getSessionsWithStatus(region);

  return sessions.filter(
    (session) => session.status === "available",
  );
}

/**
 * Devuelve la siguiente sesión pendiente de publicarse.
 */
export async function getNextSession(
  region: Region,
): Promise<SessionWithStatus | null> {
  const sessions =
    await getSessionsWithStatus(region);

  const lockedSessions = sessions
    .filter(
      (session) => session.status === "locked",
    )
    .sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() -
        new Date(b.releaseDate).getTime(),
    );

  return lockedSessions[0] ?? null;
}