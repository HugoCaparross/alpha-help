"use client";

import { useCallback, useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";

import MaterialEmptyState from "./MaterialEmptyState";
import MaterialsGrid from "./MaterialsGrid";
import MaterialCategoryCard from "./MaterialCategoryCard";

import {
  getGroupedStudyMaterials,
  type GroupedStudyMaterials,
} from "@/services/resources/study-material.service";

import type { MaterialType } from "@/types/study-material";

import "@/components/styles/materiales.css";

const PAGE_TITLE = "Materiales";

const PAGE_DESCRIPTION =
  "Documentos de apoyo para acompañar cada sesión del programa. Cada material se publica automáticamente según el calendario del estudio y queda disponible para consultarlo siempre que lo necesites.";

const LOADING_MESSAGE = "Preparando los materiales...";

const LOAD_ERROR =
  "No se han podido cargar los materiales. Inténtalo de nuevo.";

const EMPTY_MATERIALS: GroupedStudyMaterials = {
  support: [],
  extended: [],
};

interface CategoryCopy {
  title: string;
  description: string;
  sectionDescription: string;
}

const CATEGORY_COPY: Record<MaterialType, CategoryCopy> = {
  support: {
    title: "Materiales de apoyo",
    description:
      "Resúmenes prácticos para repasar rápidamente las ideas principales de cada sesión.",
    sectionDescription:
      "Resúmenes prácticos para repasar rápidamente las ideas principales de cada sesión.",
  },
  extended: {
    title: "Guías completas",
    description:
      "Documentación ampliada para profundizar en los contenidos trabajados en cada sesión.",
    sectionDescription:
      "Documentación ampliada para profundizar en los contenidos trabajados en cada sesión.",
  },
};

/**
 * Vista principal del módulo
 * de materiales del estudio.
 *
 * Muestra primero dos categorías
 * (Materiales de apoyo y Guías
 * completas) y, al seleccionar una,
 * las 9 sesiones correspondientes.
 */
export default function MaterialesView() {
  const [materials, setMaterials] =
    useState<GroupedStudyMaterials>(EMPTY_MATERIALS);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState<MaterialType | null>(
    null,
  );

  const loadMaterials = useCallback(async () => {
    setLoading(true);

    setError("");

    try {
      const data = await getGroupedStudyMaterials();

      setMaterials(data);
    } catch (loadError) {
      if (process.env.NODE_ENV === "development") {
        console.error(loadError);
      }

      setMaterials(EMPTY_MATERIALS);

      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  function retryLoadMaterials() {
    void loadMaterials();
  }

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
          onClick={retryLoadMaterials}
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (materials.support.length === 0 && materials.extended.length === 0) {
    return <MaterialEmptyState />;
  }

  if (!activeCategory) {
    const availableSupport = materials.support.filter(
      (material) => material.status === "available",
    ).length;

    const availableExtended = materials.extended.filter(
      (material) => material.status === "available",
    ).length;

    return (
      <section className="materiales-page">
        <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

        <div className="material-categories-grid">
          <MaterialCategoryCard
            type="support"
            title={CATEGORY_COPY.support.title}
            description={CATEGORY_COPY.support.description}
            total={materials.support.length}
            available={availableSupport}
            onOpen={setActiveCategory}
          />

          <MaterialCategoryCard
            type="extended"
            title={CATEGORY_COPY.extended.title}
            description={CATEGORY_COPY.extended.description}
            total={materials.extended.length}
            available={availableExtended}
            onOpen={setActiveCategory}
          />
        </div>
      </section>
    );
  }

  const activeMaterials = materials[activeCategory];

  const copy = CATEGORY_COPY[activeCategory];

  return (
    <section className="materiales-page">
      <button
        type="button"
        className="materiales-back"
        onClick={() => setActiveCategory(null)}
      >
        <ArrowLeft size={16} />
        <span>Volver a materiales</span>
      </button>

      <PageHeader title={copy.title} description={copy.sectionDescription} />

      {activeMaterials.length > 0 ? (
        <MaterialsGrid materials={activeMaterials} />
      ) : (
        <MaterialEmptyState />
      )}
    </section>
  );
}
