"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import YouTube from "react-youtube";

import type { YouTubeEvent, YouTubeProps } from "react-youtube";

interface YoutubePlayerProps {
  readonly youtubeId: string;

  readonly onReady?: () => void;

  readonly onProgress?: (percentage: number) => void;

  readonly onEnded?: () => void;

  readonly onError?: () => void;
}

/**
 * Intervalo utilizado para
 * calcular el progreso.
 */
const CHECK_INTERVAL = 1000;

/**
 * Estados del reproductor
 * de YouTube.
 */
const PLAYER_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
} as const;

/**
 * Reproductor reutilizable
 * basado en YouTube.
 *
 * Se limita a reproducir
 * el vídeo y emitir eventos
 * al componente superior.
 */
export default function YoutubePlayer({
  youtubeId,
  onReady,
  onProgress,
  onEnded,
  onError,
}: YoutubePlayerProps) {
  const playerRef = useRef<YouTubeEvent["target"] | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lastPercentageRef = useRef(-1);

  /**
   * Detiene el seguimiento
   * del progreso.
   */
  const stopTracking = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }

    clearInterval(intervalRef.current);

    intervalRef.current = null;
  }, []);

  /**
   * Inicia el seguimiento
   * del porcentaje reproducido.
   */
  const startTracking = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const player = playerRef.current;

      if (!player) {
        return;
      }

      const duration = player.getDuration();

      if (duration <= 0) {
        return;
      }

      const current = player.getCurrentTime();

      const percentage = Math.min(100, Math.round((current / duration) * 100));

      if (percentage === lastPercentageRef.current) {
        return;
      }

      lastPercentageRef.current = percentage;

      onProgress?.(percentage);
    }, CHECK_INTERVAL);
  }, [onProgress]);

  /**
   * El reproductor está listo.
   */
  const handleReady = useCallback(
    (event: YouTubeEvent) => {
      playerRef.current = event.target;

      lastPercentageRef.current = -1;

      onReady?.();
    },
    [onReady],
  );

  /**
   * Cambios de estado
   * del reproductor.
   */
  const handleStateChange = useCallback(
    (event: YouTubeEvent<number>) => {
      switch (event.data) {
        case PLAYER_STATE.PLAYING:
          startTracking();
          break;

        case PLAYER_STATE.PAUSED:
        case PLAYER_STATE.BUFFERING:
          stopTracking();
          break;

        case PLAYER_STATE.ENDED:
          stopTracking();

          lastPercentageRef.current = 100;

          onProgress?.(100);

          onEnded?.();

          break;

        default:
          break;
      }
    },
    [onEnded, onProgress, startTracking, stopTracking],
  );

  /**
   * Error durante
   * la reproducción.
   */
  const handleError = useCallback(() => {
    stopTracking();

    onError?.();
  }, [onError, stopTracking]);

  /**
   * Reinicia el estado
   * cuando cambia el vídeo.
   */
  useEffect(() => {
    stopTracking();

    playerRef.current = null;

    lastPercentageRef.current = -1;
  }, [youtubeId, stopTracking]);

  /**
   * Limpieza al desmontar.
   */
  useEffect(() => {
    return () => {
      stopTracking();

      playerRef.current = null;
    };
  }, [stopTracking]);

  /**
   * Configuración del
   * reproductor.
   */
  const options = useMemo<YouTubeProps["opts"]>(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        rel: 0,
        playsinline: 1,
        origin:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    }),
    [],
  );

  return (
    <div className="youtube-player">
      <YouTube
        videoId={youtubeId}
        opts={options}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={handleError}
      />
    </div>
  );
}
