import Image from "next/image";

import {
  Calendar,
  FileText,
  Lock,
} from "lucide-react";

import type {
  StudyMaterialWithStatus,
} from "@/types/study-material";

interface MaterialCardProps {
  readonly material: StudyMaterialWithStatus;

  readonly onOpen: (
    material: StudyMaterialWithStatus,
  ) => void;
}

const dateFormatter =
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const AVAILABLE_TEXT =
  "Disponible desde";

const LOCKED_TEXT =
  "Bloqueado";

const CTA_TEXT =
  "Consultar recurso";

function formatDate(
  date: string | null | undefined,
): string | null {
  if (!date) {
    return null;
  }

  const timestamp =
    Date.parse(date);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return dateFormatter.format(
    timestamp,
  );
}

export default function MaterialCard({
  material,
  onOpen,
}: MaterialCardProps) {
  const isAvailable =
    material.status ===
    "available";

  const formattedDate =
    formatDate(
      material.releaseDate,
    );

  const cardClassName = [
    "material-card",
    !isAvailable &&
    "material-card--locked",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * Los materiales bloqueados no pueden
   * abrirse ni interactuar con ellos.
   *
   * La comprobación se hace también
   * en el servidor, por lo que esta
   * protección visual no es la única
   * medida de seguridad.
   */
  function handleOpen() {
    if (
      !isAvailable ||
      !material.pdfUrl
    ) {
      return;
    }

    onOpen(material);
  }

  /**
   * Mensaje específico según el motivo
   * por el que todavía no está disponible.
   */
  const lockedMessage =
    material.lockReason ===
      "initial-evaluation"
      ? "Completa la evaluación inicial para acceder a este material."
      : formattedDate
        ? `Este material estará disponible a partir del ${formattedDate}.`
        : "Este material estará disponible cuando se configure la fecha de la sesión correspondiente.";

  return (
    <article
      className={cardClassName}
      data-status={
        material.status
      }
      data-material-type={
        material.materialType
      }
      aria-labelledby={`material-title-${material.id}`}
    >
      <div className="material-card__thumb">
        <Image
          src={
            material.thumbnailUrl
          }
          alt={
            material.title
          }
          fill
          loading="lazy"
          priority={false}
          sizes="(max-width: 768px) 100vw, 400px"
          className="material-card__thumb-img"
        />

        <span className="material-card__order">
          {material.materialOrder ===
            0
            ? "Introducción"
            : `Sesión ${material.materialOrder}`}
        </span>

        {!isAvailable && (
          <div
            className="material-card__lock-overlay"
            aria-hidden="true"
          >
            <Lock
              size={22}
            />

            <span>
              {LOCKED_TEXT}
            </span>
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

        <p className="material-card__desc">
          {material.description}
        </p>

        {isAvailable ? (
          <>
            {formattedDate && (
              <div className="material-card__date">
                <Calendar
                  size={14}
                  aria-hidden="true"
                />

                <span>
                  {
                    AVAILABLE_TEXT
                  }{" "}
                  {
                    formattedDate
                  }
                </span>
              </div>
            )}

            <button
              type="button"
              className="material-card__cta"
              onClick={
                handleOpen
              }
              aria-label={`Abrir "${material.title}"`}
            >
              <FileText
                size={17}
                aria-hidden="true"
              />

              <span>
                {CTA_TEXT}
              </span>
            </button>
          </>
        ) : (
          <div
            className="material-card__locked-cta"
            aria-label={
              lockedMessage
            }
          >
            <Lock
              size={15}
              aria-hidden="true"
            />

            <span>
              {
                lockedMessage
              }
            </span>
          </div>
        )}
      </div>
    </article>
  );
}