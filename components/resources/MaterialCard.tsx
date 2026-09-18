import Image from "next/image";
import { Calendar, FileText, Lock } from "lucide-react";
import type { StudyMaterialWithStatus } from "@/types/study-material";

interface MaterialCardProps {
  readonly material: StudyMaterialWithStatus;
  readonly onOpen: (material: StudyMaterialWithStatus) => void;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) ? dateFormatter.format(timestamp) : null;
}

export default function MaterialCard({ material, onOpen }: MaterialCardProps) {
  const isAvailable = material.status === "available";
  const formattedDate = formatDate(material.releaseDate);
  const cardClassName = ["material-card", !isAvailable && "material-card--locked"].filter(Boolean).join(" ");

  function handleOpen() {
    if (!isAvailable || !material.pdfUrl) return;
    onOpen(material);
  }

  const lockedMessage = formattedDate
    ? `Este material estará disponible a partir del ${formattedDate}.`
    : "Este material todavía no tiene una fecha de publicación configurada.";

  return (
    <article className={cardClassName} data-status={material.status} data-material-type={material.materialType} aria-labelledby={`material-title-${material.id}`}>
      <div className="material-card__thumb">
        <Image src={material.thumbnailUrl} alt={material.title} fill loading="lazy" priority={false} sizes="(max-width: 768px) 100vw, 400px" className="material-card__thumb-img" />
        <span className="material-card__order">{material.materialOrder === 0 ? "Introducción" : `Sesión ${material.materialOrder}`}</span>
        {!isAvailable && (
          <div className="material-card__lock-overlay" aria-hidden="true">
            <Lock size={22} />
            <span>Bloqueado</span>
          </div>
        )}
      </div>

      <div className="material-card__body">
        <h3 id={`material-title-${material.id}`} className="material-card__title">{material.title}</h3>
        <p className="material-card__desc">{material.description}</p>

        {isAvailable ? (
          <>
            {formattedDate && (
              <div className="material-card__date">
                <Calendar size={14} aria-hidden="true" />
                <span>Disponible desde {formattedDate}</span>
              </div>
            )}
            <button type="button" className="material-card__cta" onClick={handleOpen} aria-label={`Abrir "${material.title}"`}>
              <FileText size={17} aria-hidden="true" />
              <span>Consultar recurso</span>
            </button>
          </>
        ) : (
          <div className="material-card__locked-cta" aria-label={lockedMessage}>
            <Lock size={15} aria-hidden="true" />
            <span>{lockedMessage}</span>
          </div>
        )}
      </div>
    </article>
  );
}
