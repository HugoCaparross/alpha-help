"use client";

import { useCallback, useRef, useState } from "react";

import YoutubePlayer from "./YoutubePlayer";

import { extractYoutubeId } from "@/lib/utils/youtube";

import { markSessionCompleted } from "@/services/sessions/session-progress.service";

import type { SessionWithStatus } from "@/types/study-session";

interface SessionPlayerProps {
  readonly session: SessionWithStatus;

  readonly onCompleted?: () => void;

  readonly onClose?: () => void;
}

/**
 * Porcentaje mínimo de reproducción
 * necesario para considerar una
 * sesión como visualizada.
 */
const COMPLETION_THRESHOLD = 50;

const ERROR_INVALID_VIDEO =
  "La sesión no dispone de un vídeo válido.";

const ERROR_REGISTER =
  "No se ha podido registrar la visualización de la sesión.";

/**
 * Reproductor del estudio.
 *
 * Se encarga de registrar la sesión
 * cuando el participante alcanza
 * el porcentaje mínimo establecido.
 */
export default function SessionPlayer({
  session,
  onCompleted,
}: SessionPlayerProps) {
  const youtubeId = extractYoutubeId(
    session.youtubeUrl,
  );

  const hasRegistered =
    useRef(false);

  const [error, setError] =
    useState("");

  /**
   * Registra la sesión
   * una única vez.
   */
  const registerSession =
    useCallback(async () => {
      if (
        hasRegistered.current
      ) {
        return;
      }

      hasRegistered.current = true;

      try {
        await markSessionCompleted(
          session.id,
        );

        onCompleted?.();
      } catch (error) {
        if (
          process.env
            .NODE_ENV ===
          "development"
        ) {
          console.error(
            error,
          );
        }

        hasRegistered.current =
          false;

        setError(
          ERROR_REGISTER,
        );
      }
    }, [
      session.id,
      onCompleted,
    ]);

  /**
   * Escucha el porcentaje
   * reproducido.
   */
  const handleProgress =
    useCallback(
      (
        percentage: number,
      ) => {
        if (
          percentage <
          COMPLETION_THRESHOLD
        ) {
          return;
        }

        void registerSession();
      },
      [
        registerSession,
      ],
    );

  if (!youtubeId) {
    return (
      <div
        className="session-player-error"
        role="alert"
      >
        {ERROR_INVALID_VIDEO}
      </div>
    );
  }

  return (
    <div className="session-player">
      <YoutubePlayer
        youtubeId={youtubeId}
        onProgress={
          handleProgress
        }
      />

      {error && (
        <p
          className="session-player-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}