import { FileX } from "lucide-react";

import BackToDashboard from "@/components/ui/BackToDashboard";

export default function MaterialEmptyState() {
  return (
    <section
      className="materials-empty"
      role="status"
      aria-live="polite"
    >
      <div className="page-navigation">
        <BackToDashboard />
      </div>

      <div
        className="materials-empty__icon"
        aria-hidden="true"
      >
        <FileX size={28} />
      </div>

      <h2 className="materials-empty__title">
        No hay materiales disponibles
      </h2>

      <p className="materials-empty__text">
        Todavía no hay materiales disponibles para tu
        participación. Los documentos de apoyo se
        publicarán automáticamente conforme avance el
        calendario del estudio.
      </p>
    </section>
  );
}