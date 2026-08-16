import "server-only";

import { createClient } from "@supabase/supabase-js";

const ERROR_MISSING_ENV = (variable: string) =>
  `Falta la variable de entorno ${variable}.`;

/**
 * Obtiene una variable de entorno
 * obligatoria para la aplicación.
 */
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(ERROR_MISSING_ENV(name));
  }

  return value;
}

const SUPABASE_URL = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");

const SUPABASE_SERVICE_ROLE_KEY = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

/**
 * Cliente de Supabase con permisos
 * administrativos.
 *
 * IMPORTANTE:
 * - Solo puede ejecutarse en servidor.
 * - Utiliza la Service Role Key.
 * - No debe importarse desde componentes
 *   cliente.
 * - No mantiene sesiones de usuario.
 * - No utiliza cookies.
 *
 * Debe utilizarse exclusivamente
 * desde:
 * - Route Handlers
 * - Server Actions
 * - Cron Jobs
 * - Código server-side
 */
export function createServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
