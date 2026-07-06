import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

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

const ERROR_GET_SESSIONS =
  "No se han podido recuperar las sesiones.";

const ERROR_PROFILE_NOT_FOUND =
  "No se ha podido recuperar el perfil del participante.";

/**
 * Modelo recibido desde Supabase.
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
 * al modelo de dominio.
 */
function mapSession(
  row: SessionRow,
): Session {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    youtubeUrl:
      row.youtube_url,

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
 * Obtiene automáticamente
 * la región del participante
 * autenticado.
 */
async function getCurrentRegion(): Promise<Region> {
  const profile =
    await getProfile();

  if (!profile) {
    throw new Error(
      ERROR_PROFILE_NOT_FOUND,
    );
  }

  return profile.region;
}

/**
 * Devuelve la fecha de publicación
 * correspondiente a la región.
 */
function getReleaseDate(
  session: Session,
  region: Region,
): string {
  return isSpain(region)
    ? session.releaseDateSpain
    : session.releaseDateLatam;
}

/**
 * Indica si una sesión
 * ya está publicada.
 */
function isReleased(
  releaseDate: string,
): boolean {
  return (
    Date.parse(releaseDate) <=
    Date.now()
  );
}

/**
 * Calcula el estado
 * de disponibilidad.
 */
function getStatus(
  releaseDate: string,
): SessionWithStatus["status"] {
  return isReleased(
    releaseDate,
  )
    ? "available"
    : "locked";
}

/**
 * Convierte una sesión
 * al modelo utilizado
 * por la interfaz.
 */
function mapSessionWithStatus(
  session: Session,
  region: Region,
): SessionWithStatus {
  const releaseDate =
    getReleaseDate(
      session,
      region,
    );

  return {
    ...session,

    releaseDate,

    status:
      getStatus(
        releaseDate,
      ),
  };
}
/**
 * Obtiene todas las sesiones
 * del estudio.
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
      ERROR_GET_SESSIONS,
    );
  }

  return (data ?? []).map(
    mapSession,
  );
}

/**
 * Obtiene una sesión concreta.
 */
export async function getSessionById(
  sessionId: string,
): Promise<Session | null> {
  const {
    data,
    error,
  } = await supabase
    .from(STUDY_SESSIONS_TABLE)
    .select(SESSION_FIELDS)
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(
      ERROR_GET_SESSIONS,
    );
  }

  if (!data) {
    return null;
  }

  return mapSession(
    data as SessionRow,
  );
}

/**
 * Obtiene todas las sesiones
 * resolviendo automáticamente
 * la región y el estado
 * del participante.
 */
export async function getSessionsWithStatus(): Promise<
  SessionWithStatus[]
> {
  const [
    region,
    sessions,
  ] = await Promise.all([
    getCurrentRegion(),
    getSessions(),
  ]);

  return sessions.map(
    (session) =>
      mapSessionWithStatus(
        session,
        region,
      ),
  );
}
/**
 * Devuelve únicamente
 * las sesiones disponibles.
 */
export async function getAvailableSessions(): Promise<
  SessionWithStatus[]
> {
  const sessions =
    await getSessionsWithStatus();

  return sessions.filter(
    ({ status }) =>
      status === "available",
  );
}

/**
 * Devuelve la siguiente sesión
 * pendiente de publicación.
 */
export async function getNextSession(): Promise<
  SessionWithStatus | null
> {
  const sessions =
    await getSessionsWithStatus();

  return (
    sessions.find(
      ({ status }) =>
        status === "locked",
    ) ?? null
  );
}