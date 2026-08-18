const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/**
 * Extrae el ID de un vídeo de YouTube a partir de una URL.
 *
 * Formatos admitidos:
 *
 * - https://www.youtube.com/watch?v=XXXXXXXXXXX
 * - https://youtu.be/XXXXXXXXXXX
 * - https://www.youtube.com/embed/XXXXXXXXXXX
 * - https://www.youtube.com/shorts/XXXXXXXXXXX
 * - https://www.youtube.com/live/XXXXXXXXXXX
 */
export function extractYoutubeId(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const value = url.trim();

  if (!value) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return null;
  }

  const hostname = normalizeHostname(parsedUrl.hostname);

  if (!YOUTUBE_HOSTS.has(hostname)) {
    return null;
  }

  /*
   * youtu.be/XXXXXXXXXXX
   */
  if (hostname === "youtu.be") {
    const id = parsedUrl.pathname.split("/").filter(Boolean)[0];

    return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  /*
   * youtube.com/watch?v=XXXXXXXXXXX
   */
  if (parsedUrl.pathname === "/watch") {
    const id = parsedUrl.searchParams.get("v");

    return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  /*
   * youtube.com/embed/XXXXXXXXXXX
   * youtube.com/shorts/XXXXXXXXXXX
   * youtube.com/live/XXXXXXXXXXX
   */
  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

  const supportedPrefixes = new Set(["embed", "shorts", "live"]);

  if (pathParts.length >= 2 && supportedPrefixes.has(pathParts[0])) {
    const id = pathParts[1];

    return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  return null;
}

/**
 * Genera la miniatura estándar de YouTube.
 */
export function getYoutubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
