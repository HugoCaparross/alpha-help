import "server-only";

import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import {
  extractYoutubeId,
  getYoutubeStatus,
  type YoutubeBroadcastStatus,
} from "@/lib/utils/youtube";

const TABLE = "study_sessions";

const STATUS_TO_CHECK = new Set<YoutubeBroadcastStatus | null>([
  null,
  "unknown",
  "upcoming",
  "live",
]);

interface YoutubeSessionCacheRow {
  readonly id: string;

  readonly title?: string | null;

  readonly youtube_url: string;

  readonly is_live: boolean;

  readonly youtube_status: YoutubeBroadcastStatus | null;

  readonly youtube_checked_at: string | null;
}

export interface YoutubeSessionSyncError {
  readonly sessionId: string;

  readonly title: string | null;

  readonly youtubeUrl: string;

  readonly stage: "extract_id" | "youtube_api" | "database_update";

  readonly code?: string;

  readonly httpStatus?: number;

  readonly message: string;
}

export interface YoutubeSessionSyncSummary {
  readonly scanned: number;

  readonly checked: number;

  readonly updated: number;

  readonly skipped: number;

  readonly failed: number;

  readonly errors: readonly YoutubeSessionSyncError[];
}

/**
 * Sincroniza el estado cacheado de YouTube para las sesiones
 * que todavía pueden cambiar de estado.
 *
 * YouTube es la fuente de verdad.
 * Supabase almacena el último estado confirmado para que
 * los participantes no tengan que consultar YouTube directamente.
 */
export async function syncYoutubeSessionStatuses(): Promise<YoutubeSessionSyncSummary> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .select(
      `
        id,
        title,
        youtube_url,
        is_live,
        youtube_status,
        youtube_checked_at
      `,
    )
    .order("region", {
      ascending: true,
    })
    .order("session_order", {
      ascending: true,
    });

  if (error) {
    console.error("[youtube-sync][SESSIONS]", error);

    throw new Error("No se han podido recuperar las sesiones de YouTube.");
  }

  const sessions = (data ?? []) as YoutubeSessionCacheRow[];

  const candidates = sessions.filter((session) =>
    STATUS_TO_CHECK.has(session.youtube_status),
  );

  let checked = 0;
  let updated = 0;
  let failed = 0;

  const errors: YoutubeSessionSyncError[] = [];

  await Promise.all(
    candidates.map(async (session) => {
      const youtubeId = extractYoutubeId(session.youtube_url);

      if (!youtubeId) {
        failed += 1;

        const syncError: YoutubeSessionSyncError = {
          sessionId: session.id,
          title: session.title ?? null,
          youtubeUrl: session.youtube_url,
          stage: "extract_id",
          code: "invalid_video_id",
          message:
            "No se ha podido extraer un ID de vídeo válido de la URL de YouTube.",
        };

        errors.push(syncError);

        console.error("[youtube-sync][EXTRACT_ID]", syncError);

        return;
      }

      try {
        const youtubeStatus = await getYoutubeStatus(youtubeId);

        const checkedAt = new Date().toISOString();

        const { error: updateError } = await admin
          .from(TABLE)
          .update({
            is_live: youtubeStatus.isLive,
            youtube_status: youtubeStatus.status,
            youtube_checked_at: checkedAt,
            updated_at: checkedAt,
          })
          .eq("id", session.id);

        if (updateError) {
          failed += 1;

          const syncError: YoutubeSessionSyncError = {
            sessionId: session.id,
            title: session.title ?? null,
            youtubeUrl: session.youtube_url,
            stage: "database_update",
            code: "supabase_update_error",
            message: updateError.message,
          };

          errors.push(syncError);

          console.error("[youtube-sync][UPDATE]", {
            ...syncError,
            details: updateError.details,
            hint: updateError.hint,
            errorCode: updateError.code,
          });

          return;
        }

        checked += 1;

        const stateChanged =
          session.is_live !== youtubeStatus.isLive ||
          session.youtube_status !== youtubeStatus.status;

        if (stateChanged) {
          updated += 1;
        }

        console.info("[youtube-sync][SUCCESS]", {
          sessionId: session.id,
          title: session.title ?? null,
          youtubeId,
          previousStatus: session.youtube_status,
          newStatus: youtubeStatus.status,
          previousIsLive: session.is_live,
          newIsLive: youtubeStatus.isLive,
        });
      } catch (error) {
        failed += 1;

        const youtubeError = error as {
          code?: string;
          message?: string;
          httpStatus?: number;
        };

        const syncError: YoutubeSessionSyncError = {
          sessionId: session.id,
          title: session.title ?? null,
          youtubeUrl: session.youtube_url,
          stage: "youtube_api",
          code: youtubeError.code,
          httpStatus: youtubeError.httpStatus,
          message:
            youtubeError.message ??
            "Se ha producido un error desconocido al consultar YouTube.",
        };

        errors.push(syncError);

        console.error("[youtube-sync][YOUTUBE]", syncError);

        /**
         * No modificamos el estado cacheado cuando YouTube
         * no responde correctamente.
         *
         * Esto evita convertir un error temporal de API,
         * cuota o red en un falso "no está en directo".
         */
      }
    }),
  );

  return {
    scanned: sessions.length,
    checked,
    updated,
    skipped: sessions.length - candidates.length,
    failed,
    errors,
  };
}
