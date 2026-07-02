import { supabase } from "@/lib/supabase/client";

import {
  isSpain,
  type Region,
} from "@/lib/utils/regions";

import type {
  Session,
  SessionWithStatus,
} from "@/types/study-session";

const STUDY_SESSIONS_TABLE =
  "study_sessions";

const SESSION_FIELDS = `
  id,
  title,
  description,
  youtube_url,
  thumbnail_url,
  session_order,
  release_date_spain,
  release_date_latam
`;

/**
 * Forma cruda devuelta por Supabase.
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
 * Convierte una fila de Supabase
 * al modelo utilizado por la aplicación.
 */
function mapRow(
  row: SessionRow,
): Session {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    youtubeUrl: row.youtube_url,

    thumbnailUrl:
      row.thumbnail_url,

    sessionOrder:
      row.session_order,

    releaseDateSpain:
      row.release_date_spain,

    releaseDateLatam:
      row.release_date_latam,
  };
}

/**
 * Devuelve la fecha de publicación
 * correspondiente a la región indicada.
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
 * Calcula el estado actual
 * de una sesión.
 */
function resolveStatus(
  releaseDate: string,
): SessionWithStatus["status"] {
  return Date.parse(
    releaseDate,
  ) <= Date.now()
    ? "available"
    : "locked";
}

/**
 * Convierte una sesión en una sesión
 * lista para mostrarse al participante.
 */
function resolveSession(
  session: Session,
  region: Region,
): SessionWithStatus {
  const releaseDate =
    resolveReleaseDate(
      session,
      region,
    );

  return {
    ...session,

    releaseDate,

    status:
      resolveStatus(
        releaseDate,
      ),
  };
}

/**
 * Obtiene todas las sesiones
 * del programa.
 */
export async function getSessions(): Promise<
  Session[]
> {
  const {
    data,
    error,
  } = await supabase
    .from(STUDY_SESSIONS_TABLE)
    .select(SESSION_FIELDS)
    .order(
      "session_order",
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      "No se han podido recuperar las sesiones.",
    );
  }

  return (data ?? []).map(
    mapRow,
  );
}

/**
 * Obtiene todas las sesiones
 * resolviendo automáticamente
 * su estado para la región indicada.
 */
export async function getSessionsWithStatus(
  region: Region,
): Promise<
  SessionWithStatus[]
> {
  const sessions =
    await getSessions();

  return sessions.map(
    (session) =>
      resolveSession(
        session,
        region,
      ),
  );
}

/**
 * Devuelve únicamente
 * las sesiones disponibles.
 */
export async function getAvailableSessions(
  region: Region,
): Promise<
  SessionWithStatus[]
> {
  const sessions =
    await getSessionsWithStatus(
      region,
    );

  return sessions.filter(
    (session) =>
      session.status ===
      "available",
  );
}

/**
 * Devuelve la siguiente sesión
 * pendiente de publicarse.
 */
export async function getNextSession(
  region: Region,
): Promise<SessionWithStatus | null> {
  const sessions =
    await getSessionsWithStatus(
      region,
    );

  const nextSession =
    sessions
      .filter(
        (session) =>
          session.status ===
          "locked",
      )
      .sort(
        (a, b) =>
          Date.parse(
            a.releaseDate,
          ) -
          Date.parse(
            b.releaseDate,
          ),
      )[0];

  return nextSession ?? null;
}