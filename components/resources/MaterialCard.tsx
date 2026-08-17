import Image from "next/image";

import { Calendar, FileText, Lock } from "lucide-react";

import type { StudyMaterialWithStatus } from "@/types/study-material";

interface MaterialCardProps {
  readonly material: StudyMaterialWithStatus;

  readonly onOpen: (material: StudyMaterialWithStatus) => void;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const AVAILABLE_TEXT = "Disponible desde";

const LOCKED_TEXT = "Bloqueado";

const CTA_TEXT = "Consultar recurso";

function formatDate(date: string): string {
  return dateFormatter.format(Date.parse(date));
}

export default function MaterialCard({ material, onOpen }: MaterialCardProps) {
  const isAvailable = material.status === "available";

  const formattedDate = formatDate(material.releaseDate);

  const cardClassName = [
    "material-card",
    !isAvailable && "material-card--locked",
  ]
    .filter(Boolean)
    .join(" ");

  const ctaText = CTA_TEXT;

  function handleOpen() {
    if (!isAvailable) {
      return;
    }

    onOpen(material);
  }

  return (
    <article
      className={cardClassName}
      data-status={material.status}
      data-material-type={material.materialType}
      aria-labelledby={`material-title-${material.id}`}
    >
      <div className="material-card__thumb">
        <Image
          src={material.thumbnailUrl}
          alt={material.title}
          fill
          loading="lazy"
          priority={false}
          sizes="(max-width: 768px) 100vw, 400px"
          className="material-card__thumb-img"
        />

        <span className="material-card__order">
          {material.materialOrder === 0
            ? "Introducción"
            : `Sesión ${material.materialOrder}`}
        </span>

        {!isAvailable && (
          <div className="material-card__lock-overlay" aria-hidden="true">
            <Lock size={22} />

            <span>{LOCKED_TEXT}</span>
          </div>
        )}
      </div>

      <div className="material-card__body">
        <h3
          id={`material-title-${material.id}`}
          className="material-card__title"
        >
          {material.title}
        </h3>

        <p className="material-card__desc">{material.description}</p>

        {isAvailable ? (
          <>
            <div className="material-card__date">
              <Calendar size={14} aria-hidden="true" />

              <span>
                {AVAILABLE_TEXT} {formattedDate}
              </span>
            </div>

            <button
              type="button"
              className="material-card__cta"
              onClick={handleOpen}
              aria-label={`Abrir "${material.title}"`}
            >
              <FileText size={17} aria-hidden="true" />

              <span>{ctaText}</span>
            </button>
          </>
        ) : (
          <div className="material-card__locked-cta">
            <Lock size={15} aria-hidden="true" />

            <span>
              Este material estará disponible a partir del {formattedDate}.
            </span>
          </div>
        )}
      </div>
    </article>
  );
}