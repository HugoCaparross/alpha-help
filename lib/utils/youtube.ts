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

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/**
 * Extrae el ID de un vídeo de YouTube.
 *
 * Formatos admitidos:
 *
 * - /watch?v=ID
 * - youtu.be/ID
 * - /embed/ID
 * - /shorts/ID
 * - /live/ID
 */
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
 * Consulta el estado real de un vídeo
 * mediante YouTube Data API.
 *
 * Esta función SOLO debe utilizarse
 * en servidor.
 */
export async function getYoutubeStatus(
  videoId: string,
): Promise<YoutubeStatusResult> {
  if (!YOUTUBE_ID_REGEX.test(videoId)) {
    throw new Error("El ID de YouTube no es válido.");
  }

  const apiKey = process.env.YOUTUBE_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("Falta configurar YOUTUBE_DATA_API_KEY.");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");

  url.searchParams.set("part", "snippet,liveStreamingDetails");

  url.searchParams.set("id", videoId);

  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      "No se ha podido consultar el estado del vídeo en YouTube.",
    );
  }

  const payload = (await response.json()) as {
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
  };

  const video = payload.items?.[0];

  if (!video) {
    throw new Error("El vídeo de YouTube no existe o no está disponible.");
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
