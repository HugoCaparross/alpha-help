import { supabase } from "./client";

/**
 * Obtiene el usuario autenticado actualmente.
 *
 * Devuelve null si no existe sesión o si se produce
 * cualquier error durante la consulta.
 */
export async function getUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);

    return null;
  }
}