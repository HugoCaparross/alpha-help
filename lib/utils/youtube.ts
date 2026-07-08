/**
 * Expresión regular utilizada
 * para extraer el identificador
 * de un vídeo de YouTube.
 */
const YOUTUBE_ID_REGEX =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/;

/**
 * Longitud oficial del identificador
 * de un vídeo de YouTube.
 */
const YOUTUBE_ID_LENGTH = 11;

/**
 * Comprueba si un identificador
 * de YouTube tiene un formato válido.
 */
export function isYoutubeId(
  value: string,
): boolean {
  return (
    value.length ===
      YOUTUBE_ID_LENGTH &&
    /^[A-Za-z0-9_-]+$/.test(
      value,
    )
  );
}

/**
 * Extrae el identificador de un vídeo
 * a partir de una URL de YouTube.
 *
 * Soporta:
 *
 * - youtube.com/watch?v=
 * - youtu.be/
 * - youtube.com/embed/
 * - youtube.com/shorts/
 *
 * Devuelve null cuando la URL
 * no es válida.
 */
export function extractYoutubeId(
  url: string,
): string | null {
  if (!url) {
    return null;
  }

  const match =
    url.match(
      YOUTUBE_ID_REGEX,
    );

  if (!match) {
    return null;
  }

  const id = match[1];

  return isYoutubeId(id)
    ? id
    : null;
}

/**
 * Genera la URL de incrustación
 * utilizada por el reproductor.
 */
export function getYoutubeEmbedUrl(
  youtubeId: string,
): string {
  return `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&playsinline=1`;
}

/**
 * Genera la miniatura oficial
 * de un vídeo de YouTube.
 */
export function getYoutubeThumbnail(
  youtubeId: string,
): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}