"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, CheckCircle, BookOpen } from "lucide-react";

import { getProfile } from "@/lib/supabase/getProfile";
import UserMenu from "./UserMenu";

type Progress = {
  evaluacionInicial: boolean;
  sesionesCompletadas: number;
  sesionesTotales: number;
  manualesConsultados: number;
  manualesTotales: number;
};

export default function RightPanel() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<Progress>({
    evaluacionInicial: false,
    sesionesCompletadas: 0,
    sesionesTotales: 9,
    manualesConsultados: 0,
    manualesTotales: 9,
  });

  useEffect(() => {
    async function load() {
      const data = await getProfile();
      setProfile(data || null);
    }

    load();
  }, []);

  return (
    <aside className="right-panel">
      <div className="right-panel-content">
        {/* Block 1 - Perfil */}
        <div className="right-panel-card">
          <div className="right-panel-flex-row">
            <div className="right-panel-avatar">
              {profile?.email?.charAt(0)?.toUpperCase() || "M"}
            </div>

            <div>
              <p className="right-panel-name">{profile?.full_name || "Marta López"}</p>
              <p className="right-panel-secondary-text">{profile?.email || "marta.lopez@example.com"}</p>
            </div>
          </div>

          <div className="right-panel-link-wrapper">
            <a href="/perfil" className="right-panel-link">
              Ver mi perfil
            </a>
          </div>
        </div>

        {/* Block 2 - Progreso */}
        <div className="right-panel-card">
          <h3 className="right-panel-title">Tu progreso</h3>

          <div className="right-panel-items-list">
            <div className="right-panel-flex-row">
              <CheckCircle className="right-panel-icon" />
              <div>
                <div className="right-panel-label">Evaluación inicial</div>
                <div className="right-panel-secondary-text">{progress.evaluacionInicial ? "Completada" : "Pendiente"}</div>
              </div>
            </div>

            <div className="right-panel-flex-row">
              <UserIcon className="right-panel-icon" />
              <div>
                <div className="right-panel-label">Sesiones completadas</div>
                <div className="right-panel-secondary-text">{progress.sesionesCompletadas} de {progress.sesionesTotales}</div>
              </div>
            </div>

            <div className="right-panel-flex-row">
              <BookOpen className="right-panel-icon" />
              <div>
                <div className="right-panel-label">Manuales consultados</div>
                <div className="right-panel-secondary-text">{progress.manualesConsultados} de {progress.manualesTotales}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Block 3 - Información contextual */}
        <div className="right-panel-card">
          <h4 className="right-panel-subtitle">Información</h4>
          <p className="right-panel-info-text">Recuerda que tus respuestas son confidenciales y se utilizan únicamente con fines de investigación.</p>
        </div>
      </div>
    </aside>
  );
}
