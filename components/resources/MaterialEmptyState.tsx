import { FileX } from "lucide-react";

/**
 * Estado vacío mostrado cuando
 * todavía no existen materiales
 * disponibles para el participante.
 */
export default function MaterialEmptyState() {
  return (
    <section className="materials-empty" role="status" aria-live="polite">
      <div className="materials-empty__icon" aria-hidden="true">
        <FileX size={28} />
      </div>

      <h2 className="materials-empty__title">No hay materiales disponibles</h2>

      <p className="materials-empty__text">
        Todavía no hay materiales disponibles para tu participación. Los
        documentos de apoyo se publicarán automáticamente conforme avance el
        calendario del estudio.
      </p>
    </section>
  );
}
