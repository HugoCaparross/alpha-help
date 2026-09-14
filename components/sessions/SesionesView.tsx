"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { getProfile } from "@/lib/supabase/getProfile";
import type { Region } from "@/lib/utils/regions";

import SessionEmptyState from "./SessionEmptyState";
import SessionsGrid from "./SessionsGrid";
import SessionCalendar from "./SessionCalendar";

import { getSessionsWithStatus } from "@/services/sessions/study-session.service";
import { getCompletedSessionIds } from "@/services/sessions/session-progress.service";
import type { SessionWithStatus } from "@/types/study-session";

const PAGE_TITLE = "Sesiones del programa";
const PAGE_DESCRIPTION = "El programa está formado por una introducción, nueve sesiones y una sesión adicional de cierre sin contenidos.";
const LOADING_MESSAGE = "Preparando las sesiones...";
const ERROR_MESSAGE = "No se han podido cargar las sesiones. Inténtalo de nuevo.";

export default function SesionesView() {
  const [sessions, setSessions] = useState<SessionWithStatus[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [region, setRegion] = useState<Region | null>(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profile, data, completed] = await Promise.all([getProfile(), getSessionsWithStatus(), getCompletedSessionIds()]);
      if (!profile) throw new Error("No se ha podido recuperar el perfil del participante.");
      setRegion(profile.region);
      setSessions(data);
      setCompletedIds(new Set(completed));
    } catch (loadError) {
      if (process.env.NODE_ENV === "development") console.error(loadError);
      setSessions([]);
      setRegion(null);
      setCompletedIds(new Set());
      setError(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSessions(); }, [loadSessions]);

  if (loading) return (
    <section className="sesiones-page" aria-busy="true">
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="sesiones-loading"><p>{LOADING_MESSAGE}</p></div>
    </section>
  );

  if (error) return (
    <section className="sesiones-page">
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="sesiones-error" role="alert" aria-live="polite">
        <p>{error}</p>
        <button type="button" className="btn-primary" onClick={() => void loadSessions()}>Reintentar</button>
      </div>
    </section>
  );

  return (
    <section className="sesiones-page">
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <SessionCalendar region={region ?? "spain"} />
      {sessions.length === 0 ? (
        <SessionEmptyState />
      ) : (
        <SessionsGrid sessions={sessions} completedIds={completedIds} onSessionCompleted={loadSessions} />
      )}
    </section>
  );
}
