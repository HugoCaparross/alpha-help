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

/**
 * Número total de sesiones
 * que componen el estudio.
 */
export const TOTAL_STUDY_SESSIONS = 9;

const SESSION_FIELDS = `
  id,
  title,
  description,
  youtube_url,
  thumbnail_url,
  session_order,
  release_date_spain,
  release_date_latam,
  is_live
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

  is_live: boolean;
}

/**
 * Convierte una fila de Supabase
 * al modelo utilizado por la aplicación.
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

    isLive:
      row.is_live,
  };
}

/**
 * Devuelve la región
 * del participante autenticado.
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
 * Obtiene la fecha de publicación
 * correspondiente a la región
 * del participante.
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
 * Comprueba si una fecha
 * ya ha sido alcanzada.
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
 * Indica si una sesión
 * está disponible para
 * una determinada región.
 *
 * Función reutilizable por
 * Dashboard, Administrador
 * y futuros componentes.
 */
export function isSessionAvailable(
  session: Session,
  region: Region,
): boolean {
  return isReleased(
    getReleaseDate(
      session,
      region,
    ),
  );
}

/**
 * Calcula el estado
 * de una sesión.
 */
function getStatus(
  session: Session,
  region: Region,
): SessionWithStatus["status"] {
  return isSessionAvailable(
    session,
    region,
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
  return {
    ...session,

    releaseDate:
      getReleaseDate(
        session,
        region,
      ),

    status:
      getStatus(
        session,
        region,
      ),
  };
}

/**
 * Obtiene todas las sesiones
 * del estudio.
 */
export async function getSessions(): Promise
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
    (row) =>
      mapSession(
        row as SessionRow,
      ),
  );
}

/**
 * Obtiene una sesión
 * concreta del estudio.
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
 * la región del participante
 * y su estado.
 */
export async function getSessionsWithStatus(): Promise
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
export async function getAvailableSessions(): Promise
  SessionWithStatus[]
> {
  const sessions =
    await getSessionsWithStatus();

  return sessions.filter(
    ({ status }) =>
      status ===
      "available",
  );
}

/**
 * Devuelve la siguiente
 * sesión pendiente
 * de publicación.
 */
export async function getNextSession(): Promise
  SessionWithStatus | null
> {
  const sessions =
    await getSessionsWithStatus();

  return (
    sessions.find(
      ({ status }) =>
        status ===
        "locked",
    ) ?? null
  );
}