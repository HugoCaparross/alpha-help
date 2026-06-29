import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Falta la variable NEXT_PUBLIC_SUPABASE_URL.",
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "Falta la variable SUPABASE_SERVICE_ROLE_KEY.",
  );
}

/**
 * Cliente de Supabase con permisos administrativos.
 *
 * Solo debe utilizarse en código ejecutado
 * exclusivamente en el servidor (API Routes,
 * Server Actions, Cron Jobs, etc.).
 */
export function createServerClient() {
  return createClient(
    supabaseUrl,
    serviceRoleKey,
  );
}