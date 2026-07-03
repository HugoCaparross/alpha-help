import Image from "next/image";

import { Calendar, Lock, PlayCircle } from "lucide-react";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionCardProps {
  session: SessionWithStatus;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(date: string): string {
  return dateFormatter.format(Date.parse(date));
}

export default function SessionCard({ session }: SessionCardProps) {
  const isAvailable = session.status === "available";

  const formattedDate = formatDate(session.releaseDate);

  return (
    <article
      className={`session-card${isAvailable ? "" : " session-card--locked"}`}
      aria-labelledby={`session-title-${session.id}`}
    >
      <div className="session-card__thumb">
        <Image
          src={session.thumbnailUrl}
          alt={session.title}
          fill
          loading="lazy"
          priority={false}
          className="session-card__thumb-img"
          sizes="(max-width: 768px) 100vw, 400px"
        />

        <span className="session-card__order">
          Sesión {session.sessionOrder}
        </span>

        {!isAvailable && (
          <div className="session-card__lock-overlay" aria-hidden="true">
            <Lock size={22} />

            <span>Bloqueada</span>
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

              <span>Disponible desde {formattedDate}</span>
            </div>

            <a
              href={session.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="session-card__cta"
              aria-label={`Acceder a la sesión "${session.title}"`}
            >
              <PlayCircle size={17} aria-hidden="true" />

              <span>Acceder a la sesión</span>
            </a>
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
