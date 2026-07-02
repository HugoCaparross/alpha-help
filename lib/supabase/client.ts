import { createClient } from "@supabase/supabase-js";

/**
 * Obtiene una variable de entorno obligatoria.
 */
function getEnvVariable(
  name: string,
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}.`,
    );
  }

  return value;
}

/**
 * Variables públicas de Supabase.
 */
const supabaseUrl =
  getEnvVariable(
    "NEXT_PUBLIC_SUPABASE_URL",
  );

const supabaseAnonKey =
  getEnvVariable(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

/**
 * Cliente único de Supabase para el lado del cliente.
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);