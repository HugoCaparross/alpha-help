/**
 * Limitador de peticiones muy simple,
 * en memoria, por IP.
 *
 * NOTA: al ser en memoria, el contador
 * se reinicia si la función serverless
 * arranca una instancia nueva (cold
 * start) y no se comparte entre
 * instancias concurrentes. Es un
 * "mejor esfuerzo" para frenar el caso
 * más común (un mismo bot machacando el
 * formulario), no una solución robusta
 * a nivel de infraestructura. Para algo
 * más fiable en producción, considera
 * Upstash Redis / Vercel KV.
 */

interface Bucket {
  count: number;

  windowStart: number;
}

const buckets = new Map<string, Bucket>();

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
  const now = Date.now();

  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });

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
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}