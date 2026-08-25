const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export type YoutubeBroadcastStatus =
  | "live"
  | "upcoming"
  | "completed"
  | "video"
  | "unknown";

export interface YoutubeStatusResult {
  readonly videoId: string;

  readonly status: YoutubeBroadcastStatus;

  readonly isLive: boolean;

  readonly actualStartTime: string | null;

  readonly actualEndTime: string | null;
}

export interface YoutubeStatusError extends Error {
  code: "missing_api_key" | "api_error" | "not_found" | "invalid_video_id";

  httpStatus?: number;
}

function createYoutubeError(
  message: string,
  code: YoutubeStatusError["code"],
  httpStatus?: number,
): YoutubeStatusError {
  const error = new Error(message) as YoutubeStatusError;

  error.name = "YoutubeStatusError";

  error.code = code;

  error.httpStatus = httpStatus;

  return error;
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function extractYoutubeId(url: string): string | null {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url.trim());
  } catch {
    return null;
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    return null;
  }

  const hostname = normalizeHostname(parsedUrl.hostname);

  if (!YOUTUBE_HOSTS.has(hostname)) {
    return null;
  }

  if (hostname === "youtu.be") {
    const id = parsedUrl.pathname.split("/").filter(Boolean)[0];

    return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  if (parsedUrl.pathname === "/watch") {
    const id = parsedUrl.searchParams.get("v");

    return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  const parts = parsedUrl.pathname.split("/").filter(Boolean);

  if (parts.length >= 2 && ["embed", "shorts", "live"].includes(parts[0])) {
    const id = parts[1];

    return YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  return null;
}

export function getYoutubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Consulta el estado real de un vídeo mediante YouTube Data API v3.
 * Esta función solo debe ejecutarse en servidor.
 */
export async function getYoutubeStatus(
  videoId: string,
): Promise<YoutubeStatusResult> {
  if (!YOUTUBE_ID_REGEX.test(videoId)) {
    throw createYoutubeError(
      "El ID de YouTube no es válido.",
      "invalid_video_id",
      400,
    );
  }

  const apiKey = process.env.YOUTUBE_DATA_API_KEY?.trim();

  if (!apiKey) {
    throw createYoutubeError(
      "La integración con YouTube no está configurada. Falta YOUTUBE_DATA_API_KEY.",
      "missing_api_key",
      503,
    );
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");

  url.searchParams.set("part", "snippet,liveStreamingDetails");

  url.searchParams.set("id", videoId);

  url.searchParams.set("key", apiKey);

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      cache: "no-store",
    });
  } catch {
    throw createYoutubeError(
      "No se ha podido conectar con YouTube para comprobar el estado del vídeo.",
      "api_error",
      503,
    );
  }

  const payload = (await response.json().catch(() => null)) as {
    error?: {
      message?: string;

      errors?: Array<{
        reason?: string;
      }>;
    };

    items?: Array<{
      id?: string;

      snippet?: {
        liveBroadcastContent?: "live" | "upcoming" | "none";
      };

      liveStreamingDetails?: {
        actualStartTime?: string;

        actualEndTime?: string;
      };
    }>;
  } | null;

  if (!response.ok) {
    const reason = payload?.error?.errors?.[0]?.reason;

    if (response.status === 403 && reason === "quotaExceeded") {
      throw createYoutubeError(
        "YouTube ha rechazado la consulta porque se ha agotado la cuota de la API.",
        "api_error",
        503,
      );
    }

    throw createYoutubeError(
      payload?.error?.message ??
        "No se ha podido comprobar el estado del vídeo en YouTube.",
      "api_error",
      response.status,
    );
  }

  const video = payload?.items?.[0];

  if (!video) {
    throw createYoutubeError(
      "El vídeo de YouTube no existe o no está disponible públicamente.",
      "not_found",
      404,
    );
  }

  const broadcastStatus = video.snippet?.liveBroadcastContent;

  const details = video.liveStreamingDetails;

  if (broadcastStatus === "live") {
    return {
      videoId,

      status: "live",

      isLive: true,

      actualStartTime: details?.actualStartTime ?? null,

      actualEndTime: null,
    };
  }

  if (broadcastStatus === "upcoming") {
    return {
      videoId,

      status: "upcoming",

      isLive: false,

      actualStartTime: details?.actualStartTime ?? null,

      actualEndTime: null,
    };
  }

  if (details?.actualEndTime) {
    return {
      videoId,

      status: "completed",

      isLive: false,

      actualStartTime: details.actualStartTime ?? null,

      actualEndTime: details.actualEndTime,
    };
  }

  return {
    videoId,

    status: "video",

    isLive: false,

    actualStartTime: details?.actualStartTime ?? null,

    actualEndTime: null,
  };
}
