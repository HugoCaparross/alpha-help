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

const PAGE_TITLE = "Recursos";

const PAGE_DESCRIPTION =
  "Aquí encontrarás documentos de apoyo que te servirán para complementar cada sesión del programa. Cada tema se publicará automáticamente cada mes, siguiendo el calendario del estudio y podrás descargarlo y consultarlo siempre que lo necesites.";

const LOADING_MESSAGE = "Preparando los recursos...";

const LOAD_ERROR = "No se han podido cargar los recursos. Inténtalo de nuevo.";

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
    title: "Versiones reducidas",
    description:
      "Guías prácticas para repasar rápidamente las ideas de cada sesión.",
    sectionDescription:
      "Guías prácticas para repasar rápidamente las ideas de cada sesión.",
  },

  extended: {
    title: "Versiones extendidas",
    description:
      "Manuales completos y ampliados con contenidos adicionales (casos prácticos, ejercicios, material complementario y test) para que puedas profundizar en las ideas de cada sesión.",
    sectionDescription:
      "Manuales completos y ampliados con contenidos adicionales (casos prácticos, ejercicios, material complementario y test) para que puedas profundizar en las ideas de cada sesión.",
  },
};

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
        <span>Volver a recursos</span>
      </button>

      <PageHeader title={copy.title} description={copy.sectionDescription} />

      {activeMaterials.length > 0 ? (
        <MaterialsGrid
          materials={activeMaterials}
          variant={activeCategory === "extended" ? "cover" : "grid"}
        />
      ) : (
        <MaterialEmptyState />
      )}
    </section>
  );
}
