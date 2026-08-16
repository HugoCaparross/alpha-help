import type { User } from "@supabase/supabase-js";

import { supabase } from "./client";

const ERROR_GET_USER = "No se ha podido recuperar el usuario autenticado.";

/**
 * Devuelve el usuario autenticado.
 *
 * Uso exclusivo desde componentes
 * y servicios ejecutados en cliente.
 */
export async function getUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(ERROR_GET_USER, error);
    }

    return null;
  }

  return user;
}
