"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import MaterialsGrid from "./MaterialsGrid";
import MaterialEmptyState from "./MaterialEmptyState";

import { getProfile } from "@/lib/supabase/getProfile";

import { getStudyMaterialsWithStatus } from "@/services/resources/study-material.service";

import type { StudyMaterialWithStatus } from "@/types/study-material";

import "@/components/styles/materiales.css";

const PAGE_DESCRIPTION =
  "Documentos de apoyo para acompañar cada sesión del programa. Cada material se publica automáticamente según el calendario del estudio y queda disponible para consultarlo siempre que lo necesites.";

const LOAD_ERROR =
  "No se han podido cargar los materiales. Inténtalo de nuevo.";

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

      const materialsData = await getStudyMaterialsWithStatus(profile.region);

      setMaterials(materialsData);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setMaterials([]);

      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  if (loading) {
    return (
      <section className="materiales-loading">
        <p>Preparando los materiales...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="materiales-error" role="alert" aria-live="polite">
        <p>{error}</p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => void loadMaterials()}
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (materials.length === 0) {
    return <MaterialEmptyState />;
  }

  return (
    <section className="materiales-page">
      <PageHeader title="Materiales" description={PAGE_DESCRIPTION} />

      <MaterialsGrid materials={materials} />
    </section>
  );
}
