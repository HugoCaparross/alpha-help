import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable ${name}.`);
  }

  return value;
}

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

/**
 * Cliente de Supabase con permisos administrativos.
 *
 * Solo debe utilizarse en código ejecutado
 * exclusivamente en el servidor (API Routes,
 * Server Actions, Cron Jobs, etc.).
 */
export function createServerClient() {
  return createClient(supabaseUrl, serviceRoleKey);
}