import Image from "next/image";

import { Calendar, Lock, PlayCircle } from "lucide-react";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionCardProps {
  readonly session: SessionWithStatus;

  readonly onOpen: (session: SessionWithStatus) => void;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const AVAILABLE_TEXT = "Disponible desde";

const LOCKED_TEXT = "Bloqueada";

const CTA_TEXT = "Ver sesión";

function formatDate(date: string): string {
  return dateFormatter.format(Date.parse(date));
}

/**
 * Tarjeta de una sesión
 * del programa.
 */
export default function SessionCard({ session, onOpen }: SessionCardProps) {
  const isAvailable = session.status === "available";

  const formattedDate = formatDate(session.releaseDate);

  const cardClassName = ["session-card", !isAvailable && "session-card--locked"]
    .filter(Boolean)
    .join(" ");

  function handleOpen() {
    if (!isAvailable) {
      return;
    }

    onOpen(session);
  }

  return (
    <article
      className={cardClassName}
      aria-labelledby={`session-title-${session.id}`}
    >
      <div className="session-card__thumb">
        <Image
          src={session.thumbnailUrl}
          alt={session.title}
          fill
          loading="lazy"
          priority={false}
          sizes="(max-width: 768px) 100vw, 400px"
          className="session-card__thumb-img"
        />

        <span className="session-card__order">
          Sesión {session.sessionOrder}
        </span>

        {!isAvailable && (
          <div className="session-card__lock-overlay" aria-hidden="true">
            <Lock size={22} />

            <span>{LOCKED_TEXT}</span>
          </div>
        )}
      </div>

      <div className="session-card__body">
        <h3 id={`session-title-${session.id}`} className="session-card__title">
          {session.title}
        </h3>

        <p className="session-card__desc">{session.description}</p>

        {isAvailable ? (
          <>
            <div className="session-card__date">
              <Calendar size={14} aria-hidden="true" />

              <span>
                {AVAILABLE_TEXT} {formattedDate}
              </span>
            </div>

            <button
              type="button"
              className="session-card__cta"
              onClick={handleOpen}
              aria-label={`Abrir la sesión "${session.title}"`}
            >
              <PlayCircle size={17} aria-hidden="true" />

              <span>{CTA_TEXT}</span>
            </button>
          </>
        ) : (
          <div className="session-card__locked-cta">
            <Lock size={15} aria-hidden="true" />

            <span>
              Esta sesión estará disponible a partir del {formattedDate}.
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
