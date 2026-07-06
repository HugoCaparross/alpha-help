import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ERROR_SUPABASE_URL =
  "Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL.";

const ERROR_SUPABASE_ANON_KEY =
  "Falta la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY.";

if (!SUPABASE_URL) {
  throw new Error(
    ERROR_SUPABASE_URL,
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    ERROR_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente de Supabase utilizado
 * por todos los componentes y
 * servicios ejecutados en cliente.
 */
export const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,

        autoRefreshToken: true,

        detectSessionInUrl: true,
      },
    },
  );