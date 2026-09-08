"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Download, FileText, Video } from "lucide-react";

import QuestionnaireUnlockPanel from "@/components/admin/QuestionnaireUnlockPanel";

import { listAdminSessions } from "@/services/admin/admin-session.service";
import { listAdminMaterials } from "@/services/admin/admin-material.service";

const REGION_LIMIT = 10;
const TOTAL_SESSION_LIMIT = 20;
const TOTAL_MATERIAL_LIMIT = 40;

type RegionValue = "España" | "Latinoamérica";

const REGIONS: RegionValue[] = ["España", "Latinoamérica"];

export default function AdminHomePage() {
  const [sessions, setSessions] = useState<Awaited<ReturnType<typeof listAdminSessions>>>([]);
  const [materials, setMaterials] = useState<Awaited<ReturnType<typeof listAdminMaterials>>>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      setLoading(true);

      const [sessionsResult, materialsResult] = await Promise.allSettled([
        listAdminSessions(),
        listAdminMaterials(),
      ]);

      if (cancelled) return;

      if (sessionsResult.status === "fulfilled") {
        setSessions(sessionsResult.value);
      }

      if (materialsResult.status === "fulfilled") {
        setMaterials(materialsResult.value);
      }

      setLoading(false);
    }

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const sessionCounts = useMemo(() => {
    return REGIONS.reduce<Record<RegionValue, number>>(
      (counts, region) => {
        counts[region] = sessions.filter(
          (session) => session.region === region,
        ).length;
        return counts;
      },
      {
        España: 0,
        Latinoamérica: 0,
      },
    );
  }, [sessions]);

  const materialCounts = useMemo(() => {
    return REGIONS.reduce<Record<RegionValue, number>>(
      (counts, region) => {
        counts[region] = materials.filter(
          (material) => material.region === region,
        ).length;
        return counts;
      },
      {
        España: 0,
        Latinoamérica: 0,
      },
    );
  }, [materials]);

  const sessionsCount = sessionCounts.España + sessionCounts.Latinoamérica;
  const materialsCount = materialCounts.España + materialCounts.Latinoamérica;

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
            {loading ? "—" : `${sessionsCount} / ${TOTAL_SESSION_LIMIT}`}
          </div>
          <div className="admin-stat-card__label">Sesiones configuradas</div>
          <div className="admin-stat-card__detail">
            España {loading ? "—" : `${sessionCounts.España}/${REGION_LIMIT}`} · Latinoamérica {loading ? "—" : `${sessionCounts.Latinoamérica}/${REGION_LIMIT}`}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__value">
            {loading ? "—" : `${materialsCount} / ${TOTAL_MATERIAL_LIMIT}`}
          </div>
          <div className="admin-stat-card__label">Materiales configurados</div>
          <div className="admin-stat-card__detail">
            España {loading ? "—" : `${materialCounts.España}/20`} · Latinoamérica {loading ? "—" : `${materialCounts.Latinoamérica}/20`}
          </div>
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
