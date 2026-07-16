"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Modal from "@/components/ui/Modal";

import MaterialCard from "./MaterialCard";
import PdfViewer from "./PdfViewer";

import { markMaterialAsCompleted } from "@/services/resources/material-progress.service";

import type { StudyMaterialWithStatus } from "@/types/study-material";

interface MaterialsGridProps {
  readonly materials: readonly StudyMaterialWithStatus[];

  /**
   * "cover" se usa para el material largo
   * único: una sola tarjeta con la portada
   * del PDF perfectamente cuadrada.
   */
  readonly variant?: "grid" | "cover";
}

const MINIMUM_READING_TIME = 3000;

export default function MaterialsGrid({
  materials,
  variant = "grid",
}: MaterialsGridProps) {
  const [selectedMaterial, setSelectedMaterial] =
    useState<StudyMaterialWithStatus | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasRegisteredRef = useRef(false);

  const openMaterial = useCallback((material: StudyMaterialWithStatus) => {
    setSelectedMaterial(material);
  }, []);

  const closeMaterial = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;
    }

    hasRegisteredRef.current = false;

    setSelectedMaterial(null);
  }, []);

  useEffect(() => {
    if (!selectedMaterial) {
      return;
    }

    hasRegisteredRef.current = false;

    timeoutRef.current = setTimeout(async () => {
      if (hasRegisteredRef.current) {
        return;
      }

      hasRegisteredRef.current = true;

      try {
        await markMaterialAsCompleted(selectedMaterial.materialOrder);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      }
    }, MINIMUM_READING_TIME);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = null;
      }
    };
  }, [selectedMaterial]);

  const modalTitle = useMemo(() => {
    if (!selectedMaterial) {
      return "";
    }

    return `Material ${selectedMaterial.materialOrder} · ${selectedMaterial.title}`;
  }, [selectedMaterial]);

  return (
    <>
      <section
        className={`materials-grid ${
          variant === "cover" ? "materials-grid--cover" : ""
        }`}
        aria-label="Listado de materiales"
      >
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onOpen={openMaterial}
          />
        ))}
      </section>

      <Modal
        open={selectedMaterial !== null}
        title={modalTitle}
        onClose={closeMaterial}
        maxWidth={1200}
      >
        {selectedMaterial && (
          <PdfViewer
            title={selectedMaterial.title}
            pdfUrl={selectedMaterial.pdfUrl}
          />
        )}
      </Modal>
    </>
  );
}
