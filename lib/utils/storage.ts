/**
 * Extrae la ruta interna de un objeto
 * de Supabase Storage.
 *
 * Admite tanto:
 *
 * - rutas internas:
 *   spain/support/1-documento.pdf
 *
 * - URLs antiguas:
 *   https://.../storage/v1/object/public/study-materials/spain/support/1-documento.pdf
 *
 * Esto permite mantener compatibles
 * los materiales que ya estaban
 * almacenados antes de convertir
 * los buckets en privados.
 */

export function extractStoragePath(
  value: string | null | undefined,
  bucket: string,
): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  /**
   * Si ya es una ruta interna,
   * la devolvemos directamente.
   */
  if (
    !normalized.startsWith("http://") &&
    !normalized.startsWith("https://") &&
    !normalized.startsWith("/")
  ) {
    return normalized;
  }

  /**
   * URL pública antigua de Supabase.
   */
  const publicMarker = `/storage/v1/object/public/${bucket}/`;

  const publicIndex = normalized.indexOf(publicMarker);

  if (publicIndex !== -1) {
    return normalized.slice(publicIndex + publicMarker.length);
  }

  /**
   * URL firmada de Supabase.
   *
   * Aunque contiene parámetros,
   * la ruta del objeto sigue estando
   * después del nombre del bucket.
   */
  const objectMarker = `/storage/v1/object/`;

  const objectIndex = normalized.indexOf(objectMarker);

  if (objectIndex !== -1) {
    const afterObject = normalized.slice(objectIndex + objectMarker.length);

    const bucketMarker = `${bucket}/`;

    const bucketIndex = afterObject.indexOf(bucketMarker);

    if (bucketIndex !== -1) {
      return afterObject.slice(bucketIndex + bucketMarker.length).split("?")[0];
    }
  }

  return null;
}

/**
 * Indica si un valor representa
 * una URL local de Next.js.
 */
export function isLocalStorageUrl(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  return value.startsWith("/");
}
