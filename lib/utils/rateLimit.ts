/**
 * Limitador de peticiones muy simple,
 * en memoria, por IP.
 *
 * NOTA: al ser en memoria, el contador
 * se reinicia si la función serverless
 * arranca una instancia nueva (cold
 * start) y no se comparte entre
 * instancias concurrentes.
 *
 * Es un "mejor esfuerzo" para frenar
 * el caso más común (un mismo bot
 * machacando el formulario), no una
 * solución robusta a nivel de
 * infraestructura.
 *
 * Para algo más fiable en producción,
 * considera Upstash Redis / Vercel KV.
 */

interface Bucket {
  count: number;

  windowStart: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Limpia periódicamente buckets
 * cuyo periodo ya ha expirado.
 *
 * Se ejecuta antes de crear un nuevo
 * bucket para evitar que el Map crezca
 * indefinidamente en una instancia
 * que reciba muchas IPs diferentes.
 */
function cleanupExpiredBuckets(now: number, windowMs: number): void {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > windowMs) {
      buckets.delete(key);
    }
  }
}

/**
 * Devuelve true si la petición para
 * `key` debe permitirse, o false si se
 * ha superado `limit` peticiones dentro
 * de `windowMs`.
 */
export function isAllowedByRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  if (
    !key ||
    !Number.isFinite(limit) ||
    !Number.isFinite(windowMs) ||
    limit <= 0 ||
    windowMs <= 0
  ) {
    return false;
  }

  const now = Date.now();

  cleanupExpiredBuckets(now, windowMs);

  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, {
      count: 1,
      windowStart: now,
    });

    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;

  return true;
}

/**
 * Extrae una IP "best effort" de las
 * cabeceras habituales tras un proxy
 * (Vercel, Cloudflare, etc.).
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}
