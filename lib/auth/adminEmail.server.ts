import "server-only";

import { ADMIN_USERNAME } from "@/lib/constants/admin";

/**
 * Correo electrónico real utilizado
 * internamente por Supabase Auth para
 * la cuenta de administración.
 *
 * IMPORTANTE: esta variable NUNCA debe
 * llevar el prefijo NEXT_PUBLIC_. Si lo
 * llevara, Next.js la incrustaría en el
 * bundle de cliente y cualquiera podría
 * leer el correo real del administrador
 * inspeccionando el JavaScript servido
 * al navegador, anulando por completo
 * la ofuscación de "admin" como usuario
 * de acceso.
 *
 * Este módulo importa "server-only",
 * así que cualquier intento de usarlo
 * desde un componente cliente falla
 * en tiempo de build en lugar de filtrar
 * el secreto silenciosamente.
 */
export const ADMIN_LOGIN_EMAIL =
  process.env.ADMIN_LOGIN_EMAIL?.trim() || "alpha-help@unir.net";

/**
 * Resuelve, en servidor, el correo
 * electrónico real que debe utilizarse
 * para autenticar contra Supabase a
 * partir de lo introducido por el
 * usuario en el formulario de login.
 *
 * Si el usuario escribe "admin" (con
 * independencia de mayúsculas o
 * espacios), se sustituye por el
 * correo interno de administración.
 */
export function resolveLoginEmail(input: string): string {
  const normalized = input.trim().toLowerCase();

  if (normalized === ADMIN_USERNAME) {
    return ADMIN_LOGIN_EMAIL;
  }

  return normalized;
}
