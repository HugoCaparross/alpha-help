"use client";

import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface PdfViewerProps {
  readonly title: string;
  readonly pdfUrl: string;
}

const ERROR_MESSAGE = "Este documento todavía no está disponible.";

const LOADING_MESSAGE = "Cargando documento...";

/**
 * Tiempo máximo de espera
 * para cargar el documento.
 */
const LOAD_TIMEOUT = 10000;

/**
 * Visor reutilizable de documentos PDF.
 *
 * Su única responsabilidad es mostrar
 * el documento utilizando el visor
 * nativo del navegador y permitir
 * su descarga. No incluye acciones
 * de impresión ni de apertura en
 * una nueva pestaña.
 *
 * El registro del progreso pertenece
 * exclusivamente a MaterialsGrid.
 */
export default function PdfViewer({ title, pdfUrl }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);

  const [hasError, setHasError] = useState(false);

  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Reinicia el visor cuando
   * cambia el documento.
   */
  useEffect(() => {
    setLoading(true);

    setHasError(false);

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = setTimeout(() => {
      setLoading(false);

      setHasError(true);
    }, LOAD_TIMEOUT);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [pdfUrl]);

  const objectKey = useMemo(() => pdfUrl, [pdfUrl]);

  function handleLoaded() {
    setLoading(false);

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }

  /**
   * Descarga el documento.
   */
  function handleDownload() {
    const link = document.createElement("a");

    link.href = pdfUrl;

    link.download = title.endsWith(".pdf") ? title : `${title}.pdf`;

    link.rel = "noopener noreferrer";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  if (!pdfUrl) {
    return (
      <div className="pdf-viewer-error" role="alert">
        <p>{ERROR_MESSAGE}</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <header className="pdf-viewer__toolbar">
        <div className="pdf-viewer__title">{title}</div>

        <div className="pdf-viewer__actions">
          <button
            type="button"
            className="pdf-viewer__button"
            onClick={handleDownload}
          >
            <Download size={17} />
            Descargar
          </button>
        </div>
      </header>

      <div className="pdf-viewer__content">
        {loading && !hasError && (
          <div className="pdf-viewer-loading">
            <div className="pdf-viewer-spinner" />

            <p>{LOADING_MESSAGE}</p>
          </div>
        )}

        {hasError ? (
          <div className="pdf-viewer-error" role="alert">
            <p>{ERROR_MESSAGE}</p>
          </div>
        ) : (
          <object
            key={objectKey}
            data={pdfUrl}
            type="application/pdf"
            className="pdf-viewer__object"
            aria-label={title}
            onLoad={handleLoaded}
          >
            <p>Tu navegador no puede mostrar este documento PDF.</p>
          </object>
        )}
      </div>
    </div>
  );
}
