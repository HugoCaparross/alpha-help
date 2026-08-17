"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Download, FileText, Video } from "lucide-react";

import QuestionnaireUnlockPanel from "@/components/admin/QuestionnaireUnlockPanel";

import { listAdminSessions } from "@/services/admin/admin-session.service";
import { listAdminMaterials } from "@/services/admin/admin-material.service";

export default function AdminHomePage() {
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);
  const [materialsCount, setMaterialsCount] = useState<number | null>(null);

  useEffect(() => {
    void listAdminSessions()
      .then((data) => setSessionsCount(data.length))
      .catch(() => setSessionsCount(0));

    void listAdminMaterials()
      .then((data) => setMaterialsCount(data.length))
      .catch(() => setMaterialsCount(0));
  }, []);

  return (
    <section className="admin-page admin-page--overview">
      <header className="admin-header">
        <h1 className="admin-header__title">Panel de administración</h1>

        <p className="admin-header__description">
          Gestiona las sesiones en vídeo, los materiales descargables y exporta
          los datos del estudio.
        </p>
      </header>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__value">
            {sessionsCount ?? "—"} / 10
          </div>
          <div className="admin-stat-card__label">Contenidos configurados</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__value">
            {materialsCount ?? "—"} / 20
          </div>
          <div className="admin-stat-card__label">Materiales configurados</div>
        </div>
      </div>

      <QuestionnaireUnlockPanel />

      <div className="admin-quick-links">
        <Link href="/admin/sesiones" className="admin-quick-link">
          <Video size={22} />
          <span className="admin-quick-link__title">Sesiones (vídeos)</span>
          <span className="admin-quick-link__description">
            Sube las URL de YouTube (en directo o grabadas) de cada sesión.
          </span>
        </Link>

        <Link href="/admin/materiales" className="admin-quick-link">
          <FileText size={22} />
          <span className="admin-quick-link__title">Materiales (PDF)</span>
          <span className="admin-quick-link__description">
            Sube los materiales de apoyo y las guías completas de cada sesión.
          </span>
        </Link>

        <Link href="/admin/exportar" className="admin-quick-link">
          <Download size={22} />
          <span className="admin-quick-link__title">Exportar datos</span>
          <span className="admin-quick-link__description">
            Descarga el registro de participantes y los cuestionarios en CSV.
          </span>
        </Link>
      </div>
    </section>
  );
}