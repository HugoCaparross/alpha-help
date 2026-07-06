"use client";

import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import MaterialEmptyState from "./MaterialEmptyState";
import MaterialsGrid from "./MaterialsGrid";

import { getStudyMaterialsWithStatus } from "@/services/resources/study-material.service";

import type { StudyMaterialWithStatus } from "@/types/study-material";

import "@/components/styles/materiales.css";

const PAGE_TITLE = "Materiales";

const PAGE_DESCRIPTION =
  "Documentos de apoyo para acompañar cada sesión del programa. Cada material se publica automáticamente según el calendario del estudio y queda disponible para consultarlo siempre que lo necesites.";

const LOADING_MESSAGE = "Preparando los materiales...";

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
      const data = await getStudyMaterialsWithStatus();

      setMaterials(data);
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
      <section className="materiales-loading" aria-busy="true">
        <p>{LOADING_MESSAGE}</p>
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
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      <MaterialsGrid materials={materials} />
    </section>
  );
}
