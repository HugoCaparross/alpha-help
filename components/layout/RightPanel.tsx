"use client";

import { useEffect, useMemo, useState } from "react";
import { User as UserIcon, CheckCircle } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

type Profile = {
  id: string;
  email: string;
  full_name?: string | null;
  role?: string | null;
};

type Progress = {
  evaluacionInicial: boolean;
  sesionesCompletadas: number;
  sesionesTotales: number;
};

export default function RightPanel() {
  const [profile, setProfile] = useState<Profile | null>(
    null
  );

  const [progress, setProgress] =
    useState<Progress>({
      evaluacionInicial: false,
      sesionesCompletadas: 0,
      sesionesTotales: 0,
    });

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();

        setProfile(data ?? null);

        if (!data?.id) {
          return;
        }

        const [
          questionnaireResult,
          totalSessionsResult,
          completedSessionsResult,
        ] = await Promise.all([
          supabase
            .from("questionnaire_submissions")
            .select("id")
            .eq("user_id", data.id)
            .eq("questionnaire_type", "pre")
            .maybeSingle(),

          supabase
            .from("sessions")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq("is_published", true),

          supabase
            .from("session_views")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq("user_id", data.id),
        ]);

        setProgress({
          evaluacionInicial:
            !!questionnaireResult.data,
          sesionesCompletadas:
            completedSessionsResult.count ?? 0,
          sesionesTotales:
            totalSessionsResult.count ?? 0,
        });
      } catch (error) {
        console.error(
          "Error loading right panel data:",
          error
        );
      }
    }

    load();
  }, []);

  const progresoGeneral = useMemo(() => {
    const total =
      1 + progress.sesionesTotales;

    const completados =
      Number(progress.evaluacionInicial) +
      progress.sesionesCompletadas;

    if (total === 0) {
      return 0;
    }

    return Math.round(
      (completados / total) * 100
    );
  }, [progress]);

  const userInitial =
    profile?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const userName =
    profile?.full_name?.trim() ||
    "Participante";

  return (
    <aside className="right-panel">
      <div className="right-panel-content">
        {/* PERFIL */}
        <div className="right-panel-card">
          <div className="right-panel-flex-row">
            <div className="right-panel-avatar">
              {userInitial}
            </div>

            <div>
              <p className="right-panel-name">
                {userName}
              </p>

              <p className="right-panel-secondary-text">
                {profile?.email ?? ""}
              </p>
            </div>
          </div>

          <div className="right-panel-link-wrapper">
            <a
              href="/perfil"
              className="right-panel-link"
            >
              Ver mi perfil
            </a>
          </div>
        </div>

        {/* PROGRESO */}
        <div className="right-panel-card">
          <h3 className="right-panel-title">
            Tu progreso
          </h3>

          <div className="right-panel-items-list">
            <div className="right-panel-flex-row">
              <CheckCircle className="right-panel-icon" />

              <div>
                <div className="right-panel-label">
                  Evaluación inicial
                </div>

                <div className="right-panel-secondary-text">
                  {progress.evaluacionInicial
                    ? "Completada"
                    : "Pendiente"}
                </div>
              </div>
            </div>

            <div className="right-panel-flex-row">
              <UserIcon className="right-panel-icon" />

              <div>
                <div className="right-panel-label">
                  Sesiones completadas
                </div>

                <div className="right-panel-secondary-text">
                  {
                    progress.sesionesCompletadas
                  }{" "}
                  de{" "}
                  {progress.sesionesTotales}
                </div>
              </div>
            </div>

            <div className="right-panel-flex-row">
              <CheckCircle className="right-panel-icon" />

              <div>
                <div className="right-panel-label">
                  Progreso general
                </div>

                <div className="right-panel-secondary-text">
                  {progresoGeneral}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="right-panel-card">
          <h4 className="right-panel-subtitle">
            Información
          </h4>

          <p className="right-panel-info-text">
            Recuerda que tus respuestas son
            confidenciales y se utilizan
            únicamente con fines de
            investigación.
          </p>
        </div>
      </div>
    </aside>
  );
}