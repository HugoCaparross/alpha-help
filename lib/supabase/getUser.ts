import type { User } from "@supabase/supabase-js";

import { supabase } from "./client";

/**
 * Devuelve el usuario autenticado.
 *
 * Debe utilizarse únicamente desde componentes
 * y servicios ejecutados en el cliente.
 */
export async function getUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    return null;
  }

  return user;
}