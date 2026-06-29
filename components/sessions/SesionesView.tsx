"use client";

import { useEffect, useState } from "react";

import SessionsGrid from "./SessionsGrid";
import SessionEmptyState from "./SessionEmptyState";

import { getUser } from "@/lib/supabase/getUser";
import { supabase } from "@/lib/supabase/client";

import { getSessionsWithStatus } from "@/services/sessions/study-session.service"

import type { Region, SessionWithStatus } from "@/types/study-session";

export default function SesionesView() {
  const [sessions, setSessions] = useState<SessionWithStatus[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        const user = await getUser();

        if (!user) {
          setError("No se ha podido identificar al usuario.");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("region")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        const region = (profile?.region ?? "spain") as Region;

        const sessionsData = await getSessionsWithStatus(region);

        setSessions(sessionsData);
      } catch (error) {
        console.error(error);

        setError("Ha ocurrido un error al cargar las sesiones.");
      } finally {
        setLoading(false);
      }
    }

    void loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="sesiones-loading">
        <p>Cargando sesiones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sesiones-error">
        <p>{error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return <SessionEmptyState />;
  }

  return (
    <div className="sesiones-page">
      <div className="sesiones-page__header">
        <span className="sesiones-page__eyebrow">Formación online</span>

        <h1 className="sesiones-page__title">Sesiones del programa</h1>

        <p className="sesiones-page__description">
          A lo largo del programa tendrás acceso a nueve sesiones formativas.
          Cada sesión estará disponible automáticamente en su fecha de
          publicación correspondiente según tu región.
        </p>
      </div>

      <SessionsGrid sessions={sessions} />
    </div>
  );
}
