import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

import { isSpain, type Region } from "@/lib/utils/regions";

import type { Session, SessionWithStatus } from "@/types/study-session";

const STUDY_SESSIONS_TABLE = "study_sessions";

/** Introducción + 9 sesiones. */
export const TOTAL_STUDY_SESSIONS = 10;
const FIRST_SESSION_ORDER = 0;
const LAST_SESSION_ORDER = 9;

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

const ERROR_GET_SESSIONS = "No se han podido recuperar las sesiones.";
const ERROR_PROFILE_NOT_FOUND =
  "No se ha podido recuperar el perfil del participante.";

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

function mapSession(row: SessionRow): Session {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    youtubeUrl: row.youtube_url,
    thumbnailUrl: row.thumbnail_url,
    sessionOrder: row.session_order,
    releaseDateSpain: row.release_date_spain,
    releaseDateLatam: row.release_date_latam,
    isLive: row.is_live,
  };
}

function normalizeSessions(sessions: Session[]): Session[] {
  return sessions
    .filter(
      (session) =>
        session.sessionOrder >= FIRST_SESSION_ORDER &&
        session.sessionOrder <= LAST_SESSION_ORDER,
    )
    .sort((first, second) => first.sessionOrder - second.sessionOrder);
}

async function getCurrentRegion(): Promise<Region> {
  const profile = await getProfile();

  if (!profile) {
    throw new Error(ERROR_PROFILE_NOT_FOUND);
  }

  return profile.region;
}

function getReleaseDate(session: Session, region: Region): string {
  return isSpain(region) ? session.releaseDateSpain : session.releaseDateLatam;
}

function isReleased(releaseDate: string): boolean {
  const timestamp = Date.parse(releaseDate);
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

export function isSessionAvailable(session: Session, region: Region): boolean {
  return isReleased(getReleaseDate(session, region));
}

function mapSessionWithStatus(
  session: Session,
  region: Region,
): SessionWithStatus {
  return {
    ...session,
    releaseDate: getReleaseDate(session, region),
    status: isSessionAvailable(session, region) ? "available" : "locked",
  };
}

export async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from(STUDY_SESSIONS_TABLE)
    .select(SESSION_FIELDS)
    .gte("session_order", FIRST_SESSION_ORDER)
    .lte("session_order", LAST_SESSION_ORDER)
    .order("session_order", { ascending: true });

  if (error) {
    throw new Error(ERROR_GET_SESSIONS);
  }

  return normalizeSessions(
    (data ?? []).map((row) => mapSession(row as SessionRow)),
  );
}

export async function getSessionById(
  sessionId: string,
): Promise<Session | null> {
  const { data, error } = await supabase
    .from(STUDY_SESSIONS_TABLE)
    .select(SESSION_FIELDS)
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(ERROR_GET_SESSIONS);
  }

  if (!data) {
    return null;
  }

  const session = mapSession(data as SessionRow);

  if (
    session.sessionOrder < FIRST_SESSION_ORDER ||
    session.sessionOrder > LAST_SESSION_ORDER
  ) {
    return null;
  }

  return session;
}

export async function getSessionsWithStatus(): Promise<SessionWithStatus[]> {
  const [region, sessions] = await Promise.all([
    getCurrentRegion(),
    getSessions(),
  ]);

  return sessions.map((session) => mapSessionWithStatus(session, region));
}

export async function getAvailableSessions(): Promise<SessionWithStatus[]> {
  const sessions = await getSessionsWithStatus();
  return sessions.filter(({ status }) => status === "available");
}

export async function getNextSession(): Promise<SessionWithStatus | null> {
  const sessions = await getSessionsWithStatus();
  return sessions.find(({ status }) => status === "locked") ?? null;
}
