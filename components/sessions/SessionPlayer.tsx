"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CheckCircle2, LoaderCircle } from "lucide-react";

import YoutubePlayer from "./YoutubePlayer";

import { extractYoutubeId } from "@/lib/utils/youtube";

import {
  isSessionCompleted,
  markSessionCompleted,
} from "@/services/sessions/session-progress.service";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionPlayerProps {
  readonly session: SessionWithStatus;

  readonly onCompleted?: () => void;
}

/**
 * Porcentaje mínimo de reproducción
 * necesario para considerar una
 * sesión grabada como visualizada
 * automáticamente.
 *
 * Durante una retransmisión en
 * directo este cálculo no es fiable
 * (la duración que reporta YouTube
 * varía mientras se emite), así que
 * el seguimiento automático se
 * desactiva y se confía únicamente
 * en el botón manual.
 */
const COMPLETION_THRESHOLD = 50;

const ERROR_INVALID_VIDEO = "La sesión no dispone de un vídeo válido.";

const ERROR_REGISTER =
  "No se ha podido registrar la visualización de la sesión.";

/**
 * Reproductor del estudio.
 *
 * El objetivo es simplemente
 * comprobar que el participante
 * ha visto la sesión, sin importar
 * si lo ha hecho en directo o en
 * diferido: ambas cuentan igual.
 */
export default function SessionPlayer({
  session,
  onCompleted,
}: SessionPlayerProps) {
  const youtubeId = extractYoutubeId(session.youtubeUrl);

  const hasRegistered = useRef(false);

  const [completed, setCompleted] = useState(false);

  const [checkingStatus, setCheckingStatus] = useState(true);

  const [marking, setMarking] = useState(false);

  const [error, setError] = useState("");

  /**
   * Comprueba si la sesión ya
   * estaba marcada como vista
   * al abrir el reproductor.
   */
  useEffect(() => {
    let cancelled = false;

    setCheckingStatus(true);

    isSessionCompleted(session.id)
      .then((value) => {
        if (cancelled) return;

        hasRegistered.current = value;

        setCompleted(value);
      })
      .catch(() => {
        /* Si falla la comprobación, se deja sin marcar. */
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingStatus(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session.id]);

  /**
   * Registra la sesión como vista
   * una única vez.
   */
  const registerSession = useCallback(async () => {
    if (hasRegistered.current) {
      return;
    }

    hasRegistered.current = true;

    try {
      await markSessionCompleted(session.id);

      setCompleted(true);

      onCompleted?.();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      hasRegistered.current = false;

      setError(ERROR_REGISTER);
    }
  }, [session.id, onCompleted]);

  /**
   * Marca la sesión manualmente.
   *
   * Es el único mecanismo fiable
   * mientras la sesión está en
   * directo, y también sirve como
   * alternativa en diferido (por
   * ejemplo, si el participante ya
   * la ha visto por su cuenta).
   */
  async function handleManualMark() {
    if (marking || completed) return;

    setMarking(true);
    setError("");

    await registerSession();

    setMarking(false);
  }

  /**
   * Escucha el porcentaje reproducido.
   *
   * Se ignora mientras la sesión
   * está en directo, ya que la
   * duración reportada por YouTube
   * no es fiable durante la emisión.
   */
  const handleProgress = useCallback(
    (percentage: number) => {
      if (session.isLive) {
        return;
      }

      if (percentage < COMPLETION_THRESHOLD) {
        return;
      }

      void registerSession();
    },
    [session.isLive, registerSession],
  );

  if (!youtubeId) {
    return (
      <div className="session-player-error" role="alert">
        {ERROR_INVALID_VIDEO}
      </div>
    );
  }

  return (
    <div className="session-player">
      {session.isLive && (
        <div className="session-player__live-banner">
          <span className="session-player__live-dot" aria-hidden="true" />
          Esta sesión se está retransmitiendo en directo ahora mismo.
        </div>
      )}

      <YoutubePlayer youtubeId={youtubeId} onProgress={handleProgress} />

      <div className="session-player__watched-bar">
        {completed ? (
          <span className="session-player__watched-confirmed">
            <CheckCircle2 size={18} />
            Ya has marcado esta sesión como vista.
          </span>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={handleManualMark}
            disabled={marking || checkingStatus}
          >
            {marking ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Guardando...
              </>
            ) : (
              "Marcar como vista"
            )}
          </button>
        )}

        <span className="session-player__watched-hint">
          {session.isLive
            ? "Si estás siguiendo el directo, márcala cuando la termines de ver."
            : "Se marca automáticamente al superar la mitad del vídeo, o puedes marcarla tú mismo/a."}
        </span>
      </div>

      {error && (
        <p className="session-player-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
