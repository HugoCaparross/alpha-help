import { FileX } from "lucide-react";

import "@/components/styles/materiales.css";

export default function MaterialEmptyState() {
  return (
    <div className="materials-empty">
      <div className="materials-empty__icon" aria-hidden="true">
        <FileX size={28} />
      </div>

      <p className="materials-empty__text">
        No hay materiales disponibles actualmente.
      </p>
    </div>
  );
}
