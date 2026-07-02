import Image from "next/image";

import { Calendar, FileText, Lock } from "lucide-react";

import type { StudyMaterialWithStatus } from "@/types/study-material";

interface MaterialCardProps {
  material: StudyMaterialWithStatus;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(Date.parse(date));
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
        <Image
          src={material.thumbnailUrl}
          alt={material.title}
          fill
          className="material-card__thumb-img"
          sizes="(max-width: 768px) 100vw, 400px"
        />

        <span className="material-card__order">
          Material {material.materialOrder}
        </span>

        {!isAvailable && (
          <div className="material-card__lock-overlay" aria-hidden="true">
            <Lock size={22} />

            <span>Bloqueado</span>
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

              <span>Disponible desde {formattedDate}</span>
            </div>

            <a
              href={material.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="material-card__cta"
              aria-label={`Consultar ${material.title}`}
            >
              <FileText size={17} />
              Consultar material
            </a>
          </>
        ) : (
          <div className="material-card__locked-cta">
            <Lock size={15} />

            <span>
              Este material estará disponible a partir del {formattedDate}.
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
