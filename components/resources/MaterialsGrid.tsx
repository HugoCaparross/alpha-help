"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Modal from "@/components/ui/Modal";

import MaterialCard from "./MaterialCard";
import PdfViewer from "./PdfViewer";

import {
  markMaterialAsCompleted,
} from "@/services/resources/material-progress.service";

import type {
  StudyMaterialWithStatus,
} from "@/types/study-material";

interface MaterialsGridProps {
  readonly materials: readonly StudyMaterialWithStatus[];
}

const MINIMUM_READING_TIME = 3000;

export default function MaterialsGrid({
  materials,
}: MaterialsGridProps) {
  const [
    selectedMaterial,
    setSelectedMaterial,
  ] =
    useState<StudyMaterialWithStatus | null>(
      null,
    );

  const timeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const hasRegisteredRef =
    useRef(false);

  /**
   * Abre un material únicamente si el servidor
   * lo ha marcado como disponible.
   *
   * Esta comprobación es deliberadamente redundante:
   *
   * - MaterialCard ya bloquea la interacción.
   * - MaterialsGrid vuelve a validar.
   * - El endpoint del servidor impide obtener la URL
   *   del PDF si el material está bloqueado.
   *
   * Así evitamos depender de una única capa de protección.
   */
  const openMaterial = useCallback(
    (
      material: StudyMaterialWithStatus,
    ) => {
      if (
        material.status !==
        "available" ||
        !material.pdfUrl
      ) {
        return;
      }

      setSelectedMaterial(
        material,
      );
    },
    [],
  );

  const closeMaterial =
    useCallback(() => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current,
        );

        timeoutRef.current =
          null;
      }

      hasRegisteredRef.current =
        false;

      setSelectedMaterial(
        null,
      );
    }, []);

  /**
   * Marca el material como completado
   * después del tiempo mínimo de lectura.
   *
   * Solo puede ejecutarse sobre un material
   * que haya sido previamente validado como
   * disponible.
   */
  useEffect(() => {
    if (
      !selectedMaterial ||
      selectedMaterial.status !==
      "available" ||
      !selectedMaterial.pdfUrl
    ) {
      return;
    }

    hasRegisteredRef.current =
      false;

    timeoutRef.current =
      setTimeout(
        async () => {
          if (
            hasRegisteredRef.current
          ) {
            return;
          }

          hasRegisteredRef.current =
            true;

          try {
            await markMaterialAsCompleted(
              selectedMaterial.materialOrder,
            );
          } catch (error) {
            if (
              process.env
                .NODE_ENV ===
              "development"
            ) {
              console.error(
                error,
              );
            }
          }
        },
        MINIMUM_READING_TIME,
      );

    return () => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current,
        );

        timeoutRef.current =
          null;
      }
    };
  }, [selectedMaterial]);

  const modalTitle =
    useMemo(() => {
      if (
        !selectedMaterial
      ) {
        return "";
      }

      return selectedMaterial.materialOrder ===
        0
        ? selectedMaterial.title
        : `Sesión ${selectedMaterial.materialOrder} · ${selectedMaterial.title}`;
    }, [selectedMaterial]);

  return (
    <>
      <section
        className="materials-grid"
        aria-label="Listado de materiales"
      >
        {materials.map(
          (material) => (
            <MaterialCard
              key={
                material.id
              }
              material={
                material
              }
              onOpen={
                openMaterial
              }
            />
          ),
        )}
      </section>

      {/*
       * El modal solo existe cuando existe un material
       * válido y disponible.
       *
       * Un material bloqueado jamás llega aquí.
       */}
      {selectedMaterial &&
        selectedMaterial.status ===
        "available" &&
        selectedMaterial.pdfUrl && (
          <Modal
            open={
              true
            }
            title={
              modalTitle
            }
            onClose={
              closeMaterial
            }
            maxWidth={
              1200
            }
          >
            <PdfViewer
              title={
                selectedMaterial.title
              }
              pdfUrl={
                selectedMaterial.pdfUrl
              }
            />
          </Modal>
        )}
    </>
  );
}