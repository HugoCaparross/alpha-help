"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

import { X } from "lucide-react";

interface ModalProps {
  readonly open: boolean;

  readonly title?: string;

  readonly children: ReactNode;

  readonly onClose: () => void;

  readonly maxWidth?: number;
}

/**
 * Modal reutilizable de la aplicación.
 *
 * Uso previsto:
 *
 * - Reproducción de sesiones.
 * - Visualización de materiales.
 * - Confirmaciones.
 * - Administración.
 * - Formularios.
 */
export default function Modal({
  open,
  title,
  children,
  onClose,
  maxWidth = 1100,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  /**
   * Cierra el modal
   * pulsando Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  /**
   * Bloquea el scroll
   * del documento.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * Enfoca automáticamente
   * el modal al abrirse.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    dialogRef.current?.focus();
  }, [open]);

  /**
   * Cierra al pulsar
   * sobre el fondo.
   */
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="modal" role="presentation" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="modal__dialog"
        style={{
          maxWidth,
        }}
      >
        <button
          type="button"
          className="modal__close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {title && (
          <header className="modal__header">
            <h2>{title}</h2>
          </header>
        )}

        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
