import { createClient } from "@supabase/supabase-js";

/**
 * Variables públicas de Supabase.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Falta la variable NEXT_PUBLIC_SUPABASE_URL.",
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Falta la variable NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

/**
 * Cliente único de Supabase para el lado del cliente.
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);