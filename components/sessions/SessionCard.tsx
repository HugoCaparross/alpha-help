import Image from "next/image";
import { Calendar, CheckCircle2, Lock, PlayCircle, Video } from "lucide-react";
import type { SessionWithStatus } from "@/types/study-session";

interface SessionCardProps {
  readonly session: SessionWithStatus;
  readonly completed: boolean;
  readonly onOpen: (session: SessionWithStatus) => void;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
function formatDate(date: string | null): string {
  const timestamp = date ? Date.parse(date) : Number.NaN;
  return Number.isFinite(timestamp) ? dateFormatter.format(timestamp) : "Fecha pendiente";
}

export default function SessionCard({ session, completed, onOpen }: SessionCardProps) {
  const isUpcoming = session.status === "upcoming";
  const isLive = session.status === "live";
  const isEnded = session.status === "ended";
  const canOpen = session.canJoinLive || session.canWatchRecording;
  const hasThumbnail = typeof session.thumbnailUrl === "string" && session.thumbnailUrl.trim().length > 0;

  function handleOpen() {
    if (!canOpen) return;
    onOpen(session);
  }

  const cardClassName = [
    "session-card",
    isUpcoming && "session-card--upcoming",
    isLive && "session-card--live",
    isEnded && "session-card--ended",
    !hasThumbnail && "session-card--no-thumbnail",
  ].filter(Boolean).join(" ");

  return (
    <article className={cardClassName} aria-labelledby={`session-title-${session.id}`}>
      <div className="session-card__thumb">
        {hasThumbnail && <Image src={session.thumbnailUrl} alt={session.title} fill loading="lazy" priority={false} sizes="(max-width: 768px) 100vw, 400px" className="session-card__thumb-img" />}
        <span className="session-card__order">{session.sessionOrder === 0 ? "Introducción" : `Sesión ${session.sessionOrder}`}</span>

        {isLive && (
          <span className="session-card__live-badge session-card__zoom-badge"><Video size={13} aria-hidden="true" /> Directo</span>
        )}

        {isEnded && (
          <span className="session-card__live-badge session-card__recording-badge"><PlayCircle size={13} aria-hidden="true" /> Diferido</span>
        )}

        {completed && (
          <span className="session-card__watched-badge"><CheckCircle2 size={13} /> Vista</span>
        )}
      </div>

      <div className="session-card__body">
        <h3 id={`session-title-${session.id}`} className="session-card__title">{session.title}</h3>
        <p className="session-card__desc">{session.description}</p>

        <div className="session-card__date">
          <Calendar size={14} aria-hidden="true" />
          <span>{formatDate(session.releaseDate)}</span>
        </div>

        {isUpcoming && (
          <div className="session-card__status-message">
            <span className="session-card__status-title">Sesión bloqueada</span>
            <span>Esta sesión permanecerá bloqueada hasta 15 minutos antes del comienzo.</span>
            <span>Comienza: {formatDate(session.releaseDate)}</span>
          </div>
        )}

        {isLive && session.canJoinLive && (
          <button type="button" className="session-card__cta" onClick={handleOpen} aria-label={`Unirse a la sesión "${session.title}"`}>
            <Video size={17} aria-hidden="true" />
            <span>Unirse a la sesión</span>
          </button>
        )}

        {isEnded && session.canWatchRecording && (
          <button type="button" className="session-card__cta" onClick={handleOpen} aria-label={`Ver la grabación de "${session.title}"`}>
            <PlayCircle size={17} aria-hidden="true" />
            <span>Ver grabación</span>
          </button>
        )}

        {isEnded && !session.canWatchRecording && (
          <div className="session-card__locked-cta">
            <Lock size={15} aria-hidden="true" />
            <span>Grabación pendiente de publicación.</span>
          </div>
        )}
      </div>
    </article>
  );
}
