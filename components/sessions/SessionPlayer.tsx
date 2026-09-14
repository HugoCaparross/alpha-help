"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CheckCircle2, ExternalLink, FileVideo, LoaderCircle, Video } from "lucide-react";

import { isSessionCompleted, markSessionCompleted } from "@/services/sessions/session-progress.service";
import type { SessionWithStatus } from "@/types/study-session";

interface SessionPlayerProps {
  readonly session: SessionWithStatus;
  readonly onCompleted?: () => void;
}

const ERROR_INVALID_ZOOM = "La sesión no dispone de un enlace de Zoom válido.";
const ERROR_REGISTER = "No se ha podido registrar la visualización de la sesión.";

export default function SessionPlayer({ session, onCompleted }: SessionPlayerProps) {
  const hasRegistered = useRef(false);
  const [completed, setCompleted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setCheckingStatus(true);
    isSessionCompleted(session.id)
      .then((value) => {
        if (cancelled) return;
        hasRegistered.current = value;
        setCompleted(value);
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) setCheckingStatus(false);
      });
    return () => { cancelled = true; };
  }, [session.id]);

  const registerSession = useCallback(async () => {
    if (hasRegistered.current) return;
    hasRegistered.current = true;
    try {
      await markSessionCompleted(session.id);
      setCompleted(true);
      onCompleted?.();
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error(err);
      hasRegistered.current = false;
      setError(ERROR_REGISTER);
    }
  }, [session.id, onCompleted]);

  async function handleManualMark() {
    if (marking || completed) return;
    setMarking(true);
    setError("");
    await registerSession();
    setMarking(false);
  }

  if (!session.zoomUrl.trim()) {
    return <div className="session-player-error" role="alert">{ERROR_INVALID_ZOOM}</div>;
  }

  return (
    <div className="session-player">
      <div className="session-player__zoom-card">
        <div className="session-player__zoom-icon" aria-hidden="true">
          <Video size={28} />
        </div>
        <div className="session-player__zoom-content">
          <span className="session-player__zoom-label">Sesión online</span>
          <h2 className="session-player__title">Acceso a la sesión por Zoom</h2>
          <p className="session-player__description">
            Pulsa el botón para acceder a la reunión de Zoom en la fecha y hora indicadas.
          </p>
          <a
            href={session.zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="session-player__zoom-button"
          >
            <ExternalLink size={17} aria-hidden="true" />
            Entrar a Zoom
          </a>
        </div>
      </div>

      {session.zoomRecordingUrl && (
        <div className="session-player__recording-card">
          <div className="session-player__recording-icon" aria-hidden="true">
            <FileVideo size={22} />
          </div>
          <div>
            <strong>Grabación de la sesión</strong>
            <p>Si no pudiste asistir en directo, puedes acceder a la grabación.</p>
          </div>
          <a href={session.zoomRecordingUrl} target="_blank" rel="noopener noreferrer" className="session-player__recording-link">
            Ver grabación
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      )}

      <div className="session-player__watched-bar">
        {completed ? (
          <span className="session-player__watched-confirmed">
            <CheckCircle2 size={18} />
            Ya has marcado esta sesión como vista.
          </span>
        ) : (
          <button type="button" className="btn-primary" onClick={handleManualMark} disabled={marking || checkingStatus}>
            {marking ? (
              <><LoaderCircle size={16} className="animate-spin" />Guardando...</>
            ) : (
              "Marcar como vista"
            )}
          </button>
        )}
        <span className="session-player__watched-hint">
          Cuando termines la sesión, márcala como vista para registrar tu progreso.
        </span>
      </div>

      {error && <p className="session-player-error" role="alert">{error}</p>}
    </div>
  );
}
