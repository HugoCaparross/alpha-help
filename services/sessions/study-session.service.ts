import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";
import { getDatabaseRegion, isSpain, type Region } from "@/lib/utils/regions";
import type { Session, SessionWithStatus } from "@/types/study-session";

const STUDY_SESSIONS_TABLE = "study_sessions";
export const TOTAL_STUDY_SESSIONS = 10;
const FIRST_SESSION_ORDER = 0;
const LAST_SESSION_ORDER = 9;
export const LIVE_JOIN_LEAD_MINUTES = 15;

const SESSION_FIELDS = `
  id,
  title,
  description,
  zoom_url,
  zoom_recording_url,
  thumbnail_url,
  session_order,
  release_date_spain,
  release_date_latam,
  live_ended_at
`;

const ERROR_GET_SESSIONS = "No se han podido recuperar las sesiones.";
const ERROR_PROFILE_NOT_FOUND = "No se ha podido recuperar el perfil del participante.";

interface SessionRow {
  id: string;
  title: string;
  description: string;
  zoom_url: string;
  zoom_recording_url: string | null;
  thumbnail_url: string;
  session_order: number;
  release_date_spain: string;
  release_date_latam: string;
  live_ended_at: string | null;
}

function mapSession(row: SessionRow): Session {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    zoomUrl: row.zoom_url,
    zoomRecordingUrl: row.zoom_recording_url,
    thumbnailUrl: row.thumbnail_url,
    sessionOrder: row.session_order,
    releaseDateSpain: row.release_date_spain,
    releaseDateLatam: row.release_date_latam,
    liveEndedAt: row.live_ended_at,
  };
}

function normalizeSessions(sessions: Session[]): Session[] {
  return sessions
    .filter((session) => session.sessionOrder >= FIRST_SESSION_ORDER && session.sessionOrder <= LAST_SESSION_ORDER)
    .sort((a, b) => a.sessionOrder - b.sessionOrder);
}

async function getCurrentRegion(): Promise<Region> {
  const profile = await getProfile();
  if (!profile) throw new Error(ERROR_PROFILE_NOT_FOUND);
  return profile.region;
}

function getReleaseDate(session: Session, region: Region): string {
  return isSpain(region) ? session.releaseDateSpain : session.releaseDateLatam;
}

function getSessionStatus(session: Session, region: Region, now = Date.now()): SessionWithStatus {
  const releaseDate = getReleaseDate(session, region);
  const start = Date.parse(releaseDate);
  const joinFrom = start - LIVE_JOIN_LEAD_MINUTES * 60_000;
  const endedAt = session.liveEndedAt ? Date.parse(session.liveEndedAt) : Number.NaN;

  if (Number.isFinite(endedAt) && endedAt <= now) {
    return { ...session, releaseDate, status: "ended", canJoinLive: false, canWatchRecording: Boolean(session.zoomRecordingUrl?.trim()) };
  }

  if (!Number.isFinite(start)) {
    return { ...session, releaseDate, status: "upcoming", canJoinLive: false, canWatchRecording: false };
  }

  const canJoinLive = now >= joinFrom;
  return {
    ...session,
    releaseDate,
    status: canJoinLive ? "live" : "upcoming",
    canJoinLive: canJoinLive && Boolean(session.zoomUrl.trim()),
    canWatchRecording: false,
  };
}

export async function getSessions(region?: Region): Promise<Session[]> {
  const currentRegion = region ?? (await getCurrentRegion());
  const databaseRegion = getDatabaseRegion(currentRegion);
  const { data, error } = await supabase
    .from(STUDY_SESSIONS_TABLE)
    .select(SESSION_FIELDS)
    .eq("region", databaseRegion)
    .gte("session_order", FIRST_SESSION_ORDER)
    .lte("session_order", LAST_SESSION_ORDER)
    .order("session_order", { ascending: true });

  if (error) {
    console.error("[study-session.service][getSessions]", error);
    throw new Error(ERROR_GET_SESSIONS);
  }

  return normalizeSessions((data ?? []).map((row) => mapSession(row as SessionRow)));
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const region = await getCurrentRegion();
  const databaseRegion = getDatabaseRegion(region);
  const { data, error } = await supabase
    .from(STUDY_SESSIONS_TABLE)
    .select(SESSION_FIELDS)
    .eq("id", sessionId)
    .eq("region", databaseRegion)
    .maybeSingle();

  if (error) {
    console.error("[study-session.service][getSessionById]", error);
    throw new Error(ERROR_GET_SESSIONS);
  }
  if (!data) return null;
  const session = mapSession(data as SessionRow);
  return session.sessionOrder >= FIRST_SESSION_ORDER && session.sessionOrder <= LAST_SESSION_ORDER ? session : null;
}

export async function getSessionsWithStatus(): Promise<SessionWithStatus[]> {
  const region = await getCurrentRegion();
  const sessions = await getSessions(region);
  const now = Date.now();
  return sessions.map((session) => getSessionStatus(session, region, now));
}

export async function getAvailableSessions(): Promise<SessionWithStatus[]> {
  const sessions = await getSessionsWithStatus();
  return sessions.filter((session) => session.status === "live");
}

export async function getNextSession(): Promise<SessionWithStatus | null> {
  const sessions = await getSessionsWithStatus();
  return sessions.find((session) => session.status === "upcoming") ?? null;
}
