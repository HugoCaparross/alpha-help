import { createClient } from "@supabase/supabase-js";

const ERROR_MISSING_ENV = (
  variable: string,
) =>
  `Falta la variable de entorno ${variable}.`;

/**
 * Obtiene una variable de entorno
 * obligatoria para la aplicación.
 */
function getRequiredEnv(
  name: string,
): string {
  const value =
    process.env[name];

  if (!value) {
    throw new Error(
      ERROR_MISSING_ENV(name),
    );
  }

  return value;
}

const SUPABASE_URL =
  getRequiredEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
  );

const SUPABASE_SERVICE_ROLE_KEY =
  getRequiredEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
  );

/**
 * Cliente de Supabase con permisos
 * administrativos.
 *
 * Debe utilizarse exclusivamente
 * desde código ejecutado en el
 * servidor (API Routes, Server
 * Actions, Cron Jobs, etc.).
 *
 * Nunca debe importarse desde
 * componentes cliente.
 */
export function createServerClient() {
  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  );
}