"use client";

import { Download } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface PdfViewerProps {
  readonly title: string;
  readonly pdfUrl: string;
}

const ERROR_MESSAGE =
  "Este documento todavía no está disponible.";

const LOADING_MESSAGE =
  "Cargando documento...";

const LOAD_TIMEOUT = 10000;

/**
 * Visor reutilizable de documentos PDF.
 *
 * IMPORTANTE:
 *
 * Este componente solo debe recibir una pdfUrl
 * cuando el servidor haya determinado que el
 * material está disponible.
 *
 * Si recibe una URL vacía, el documento no se
 * carga y tampoco se muestra ninguna acción
 * relacionada con el PDF.
 */
export default function PdfViewer({
  title,
  pdfUrl,
}: PdfViewerProps) {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  const loadTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /**
   * No permitimos inicializar el visor
   * si no existe una URL válida.
   */
  const hasValidUrl =
    typeof pdfUrl === "string" &&
    pdfUrl.trim().length > 0;

  /**
   * Reinicia el estado cuando cambia
   * el documento.
   */
  useEffect(() => {
    if (!hasValidUrl) {
      setLoading(false);
      setHasError(true);

      if (
        loadTimeoutRef.current
      ) {
        clearTimeout(
          loadTimeoutRef.current,
        );

        loadTimeoutRef.current =
          null;
      }

      return;
    }

    setLoading(true);
    setHasError(false);

    if (
      loadTimeoutRef.current
    ) {
      clearTimeout(
        loadTimeoutRef.current,
      );
    }

    loadTimeoutRef.current =
      setTimeout(() => {
        setLoading(false);
        setHasError(true);
      }, LOAD_TIMEOUT);

    return () => {
      if (
        loadTimeoutRef.current
      ) {
        clearTimeout(
          loadTimeoutRef.current,
        );

        loadTimeoutRef.current =
          null;
      }
    };
  }, [
    pdfUrl,
    hasValidUrl,
  ]);

  const objectKey =
    useMemo(
      () => pdfUrl,
      [pdfUrl],
    );

  function handleLoaded() {
    setLoading(false);

    if (
      loadTimeoutRef.current
    ) {
      clearTimeout(
        loadTimeoutRef.current,
      );

      loadTimeoutRef.current =
        null;
    }
  }

  /**
   * Descarga el documento.
   *
   * Esta acción solo puede ejecutarse
   * cuando existe una URL válida.
   */
  function handleDownload() {
    if (!hasValidUrl) {
      return;
    }

    const link =
      document.createElement(
        "a",
      );

    link.href = pdfUrl;

    link.download =
      title
        .toLowerCase()
        .endsWith(".pdf")
        ? title
        : `${title}.pdf`;

    link.rel =
      "noopener noreferrer";

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );
  }

  /**
   * Cualquier material sin URL se considera
   * no disponible.
   *
   * No se renderiza:
   *
   * - iframe;
   * - object;
   * - botón de descarga;
   * - enlace;
   * - visor PDF.
   */
  if (!hasValidUrl) {
    return (
      <div
        className="pdf-viewer-error"
        role="alert"
      >
        <p>
          {ERROR_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <header className="pdf-viewer__toolbar">
        <div className="pdf-viewer__title">
          {title}
        </div>

        <div className="pdf-viewer__actions">
          <button
            type="button"
            className="pdf-viewer__button"
            onClick={
              handleDownload
            }
            disabled={
              !hasValidUrl
            }
            aria-label={`Descargar ${title}`}
          >
            <Download
              size={17}
              aria-hidden="true"
            />

            <span>
              Descargar
            </span>
          </button>
        </div>
      </header>

      <div className="pdf-viewer__content">
        {loading &&
          !hasError && (
            <div className="pdf-viewer-loading">
              <div
                className="pdf-viewer-spinner"
                aria-hidden="true"
              />

              <p>
                {
                  LOADING_MESSAGE
                }
              </p>
            </div>
          )}

        {hasError ? (
          <div
            className="pdf-viewer-error"
            role="alert"
          >
            <p>
              {ERROR_MESSAGE}
            </p>
          </div>
        ) : (
          <object
            key={objectKey}
            data={pdfUrl}
            type="application/pdf"
            className="pdf-viewer__object"
            aria-label={title}
            onLoad={
              handleLoaded
            }
          >
            <p>
              Tu navegador no puede
              mostrar este documento PDF.
            </p>
          </object>
        )}
      </div>
    </div>
  );
}