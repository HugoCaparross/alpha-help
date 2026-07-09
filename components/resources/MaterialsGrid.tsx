"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Modal from "@/components/ui/Modal";

import MaterialCard from "./MaterialCard";
import PdfViewer from "./PdfViewer";

import { markMaterialAsCompleted } from "@/services/resources/material-progress.service";

import type { StudyMaterialWithStatus } from "@/types/study-material";

interface MaterialsGridProps {
  readonly materials: readonly StudyMaterialWithStatus[];
}

/**
 * Tiempo mínimo que el participante
 * debe mantener abierto un material
 * para considerarlo consultado.
 */
const MINIMUM_READING_TIME = 3000;

/**
 * Rejilla de materiales.
 *
 * Gestiona la apertura del visor,
 * el registro de progreso y el
 * ciclo de vida del modal.
 */
export default function MaterialsGrid({ materials }: MaterialsGridProps) {
  const [selectedMaterial, setSelectedMaterial] =
    useState<StudyMaterialWithStatus | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasRegisteredRef = useRef(false);

  /**
   * Abre un material.
   */
  const openMaterial = useCallback((material: StudyMaterialWithStatus) => {
    setSelectedMaterial(material);
  }, []);

  /**
   * Cierra el visor.
   */
  const closeMaterial = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;
    }

    hasRegisteredRef.current = false;

    setSelectedMaterial(null);
  }, []);

  /**
   * Registra el material
   * tras permanecer abierto
   * el tiempo mínimo.
   */
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

  /**
   * Título mostrado
   * en el modal.
   */
  const modalTitle = useMemo(() => {
    if (!selectedMaterial) {
      return "";
    }

    return `Material ${selectedMaterial.materialOrder} · ${selectedMaterial.title}`;
  }, [selectedMaterial]);

  return (
    <>
      <section className="materials-grid" aria-label="Listado de materiales">
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
