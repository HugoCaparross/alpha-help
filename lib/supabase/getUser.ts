import type { User } from "@supabase/supabase-js";

import { supabase } from "./client";

/**
 * Obtiene el usuario autenticado actualmente.
 *
 * Devuelve `null` cuando no existe una sesión activa
 * o no ha sido posible recuperar el usuario.
 */
export async function getUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error al obtener el usuario:", error);
    }

    return null;
  }

  return user;
}