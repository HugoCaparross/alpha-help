import { Calendar, FileText, Lock } from "lucide-react";

import type { StudyMaterialWithStatus } from "@/types/study-material";

import "@/components/styles/materiales.css";

interface MaterialCardProps {
  material: StudyMaterialWithStatus;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const isAvailable = material.status === "available";

  const formattedDate = formatDate(material.releaseDate);

  return (
    <article
      className={`material-card${isAvailable ? "" : " material-card--locked"}`}
      aria-label={material.title}
    >
      <div className="material-card__thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={material.thumbnailUrl}
          alt={`Miniatura de ${material.title}`}
          className="material-card__thumb-img"
        />

        <span className="material-card__order">
          Material {material.materialOrder}
        </span>

        {!isAvailable && (
          <div className="material-card__lock-overlay" aria-hidden="true">
            <Lock size={22} />
          </div>
        )}
      </div>

      <div className="material-card__body">
        <h3 className="material-card__title">{material.title}</h3>

        <p className="material-card__desc">{material.description}</p>

        {isAvailable ? (
          <>
            <div className="material-card__date">
              <Calendar size={14} />

              <span>Publicado el {formattedDate}</span>
            </div>

            <a
              href={material.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="material-card__cta"
            >
              <FileText size={17} />
              Abrir material
            </a>
          </>
        ) : (
          <div className="material-card__locked-cta">
            <Lock size={15} />
            Disponible el {formattedDate}
          </div>
        )}
      </div>
    </article>
  );
}
