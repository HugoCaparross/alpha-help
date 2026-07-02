"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import MaterialsGrid from "./MaterialsGrid";

import { getProfile } from "@/lib/supabase/getProfile";

import { getStudyMaterialsWithStatus } from "@/services/resources/study-material.service";

import type { Region } from "@/lib/utils/regions";
import type { StudyMaterialWithStatus } from "@/types/study-material";

import "@/components/styles/materiales.css";

const PAGE_DESCRIPTION =
  "Documentos de apoyo para acompañar cada sesión del programa. Cada material se publica automáticamente según el calendario del estudio y queda disponible para consultarlo siempre que lo necesites.";

export default function MaterialesView() {
  const [materials, setMaterials] = useState<StudyMaterialWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const profile = await getProfile();

      if (!profile) {
        throw new Error("No se ha encontrado el perfil del usuario.");
      }

      const region = (profile.region ?? "spain") as Region;

      const materialsData = await getStudyMaterialsWithStatus(region);

      setMaterials(materialsData);
    } catch (error) {
      console.error("Error loading study materials:", error);

      setMaterials([]);

      setError("No se han podido cargar los materiales. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  return (
    <section className="materiales-page">
      <PageHeader title="Materiales" description={PAGE_DESCRIPTION} />

      {loading && (
        <div
          className="materiales-page__state"
          role="status"
          aria-live="polite"
        >
          <span className="materiales-page__spinner" aria-hidden="true" />

          <p className="materiales-page__state-text">
            Preparando los materiales...
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          className="materiales-page__state materiales-page__state--error"
          role="alert"
          aria-live="assertive"
        >
          <p className="materiales-page__state-text">{error}</p>

          <button
            type="button"
            className="btn-primary"
            onClick={() => void loadMaterials()}
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && <MaterialsGrid materials={materials} />}
    </section>
  );
}
